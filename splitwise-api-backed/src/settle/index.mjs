import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.EXPENSES_TABLE;
export const handler = async (event) => {
  const groupId = event.pathParameters.groupId;

  // Query all expenses for this group from DynamoDB
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "groupId = :gid",
    ExpressionAttributeValues: { ":gid": groupId },
  }));

  const expenses = result.Items;

  // Return empty results if no expenses exist yet
  if (!expenses || expenses.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ balances: {}, settlements: [] }),
    };
  }

  // Compute who owes what, then minimize the transactions
  const balances = computeBalances(expenses);
  const settlements = minimizeCashFlow(balances);

  return {
    statusCode: 200,
    body: JSON.stringify({ balances, settlements }),
  };
};
function computeBalances(expenses) {
  const balances = {};

  expenses.forEach((expense) => {
    const { paidBy, amount, splits } = expense;
    // Credit the payer the full amount they covered
    balances[paidBy] = (balances[paidBy] || 0) + amount;
    // Debit each person by their share of the expense
    splits.forEach((split) => {
      balances[split.memberId] = (balances[split.memberId] || 0) - split.amount;
    });
  });

  return balances;
}

function minimizeCashFlow(balances) {
  const debtors = [];
  const creditors = [];

  // Separate members into people who owe and people who are owed
  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < -0.01) {
      debtors.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ person, amount: balance });
    }
  });

  // Sort both arrays so the largest amounts come first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  // Greedy pairing: match largest debtor with largest creditor
  while (i < debtors.length && j < creditors.length) {
    const transferAmount = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].person,
      to: creditors[j].person,
      amount: Math.round(transferAmount * 100) / 100,
    });

    debtors[i].amount -= transferAmount;
    creditors[j].amount -= transferAmount;

    // Advance past anyone whose balance is now settled
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}
