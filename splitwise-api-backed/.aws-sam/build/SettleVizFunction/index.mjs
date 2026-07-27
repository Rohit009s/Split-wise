import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.EXPENSES_TABLE;

export const handler = async (event) => {
  const groupId = event.pathParameters.groupId;

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "groupId = :gid",
    ExpressionAttributeValues: { ":gid": groupId },
  }));

  const expenses = result.Items;

  if (!expenses || expenses.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ steps: [] }),
    };
  }

  const balances = computeBalances(expenses);
  const steps = minimizeCashFlowWithSteps(balances);

  return {
    statusCode: 200,
    body: JSON.stringify({ initialBalances: balances, steps }),
  };
};
function computeBalances(expenses) {
  const balances = {};

  expenses.forEach((expense) => {
    const { paidBy, amount, splits } = expense;
    // Credit the payer the full amount
    balances[paidBy] = (balances[paidBy] || 0) + amount;
    // Debit each person their share
    splits.forEach((split) => {
      balances[split.memberId] = (balances[split.memberId] || 0) - split.amount;
    });
  });

  return balances;
}
function minimizeCashFlowWithSteps(balances) {
  const debtors = [];
  const creditors = [];

  // Separate members into debtors and creditors
  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < -0.01) {
      debtors.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ person, amount: balance });
    }
  });

  // Sort both arrays so largest amounts come first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const steps = [];
  let i = 0;
  let j = 0;
  let stepNumber = 1;

  while (i < debtors.length && j < creditors.length) {
    const transferAmount = Math.min(debtors[i].amount, creditors[j].amount);

    // Record the state BEFORE this transfer
    const step = {
      step: stepNumber,
      action: `${debtors[i].person} pays ${creditors[j].person}`,
      amount: Math.round(transferAmount * 100) / 100,
      debtor: debtors[i].person,
      creditor: creditors[j].person,
      debtorRemainingBefore: Math.round(debtors[i].amount * 100) / 100,
      creditorRemainingBefore: Math.round(creditors[j].amount * 100) / 100,
    };

    // Apply the transfer
    debtors[i].amount -= transferAmount;
    creditors[j].amount -= transferAmount;

    // Record the state AFTER this transfer
    step.debtorRemainingAfter = Math.round(debtors[i].amount * 100) / 100;
    step.creditorRemainingAfter = Math.round(creditors[j].amount * 100) / 100;
    step.debtorSettled = debtors[i].amount < 0.01;
    step.creditorSettled = creditors[j].amount < 0.01;

    steps.push(step);
    stepNumber++;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return steps;
}