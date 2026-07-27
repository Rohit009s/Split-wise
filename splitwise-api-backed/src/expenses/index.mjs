import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.EXPENSES_TABLE;

export const handler = async (event) => {
  const method = event.requestContext.http.method;

  if (method === "POST") {
    return addExpense(event);
  } else if (method === "GET") {
    return getExpenses(event);
  }

  return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
};
async function addExpense(event) {
  const groupId = event.pathParameters.groupId;
  const body = JSON.parse(event.body);
  const expenseId = randomUUID();

  const item = {
    groupId,
    expenseId,
    description: body.description,
    amount: body.amount,
    paidBy: body.paidBy,
    splits: body.splits,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
}
async function getExpenses(event) {
  const groupId = event.pathParameters.groupId;

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "groupId = :gid",
    ExpressionAttributeValues: { ":gid": groupId },
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}