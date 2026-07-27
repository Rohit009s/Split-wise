import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.GROUPS_TABLE;

export const handler = async (event) => {
  const method = event.requestContext.http.method;

  if (method === "POST") {
    return createGroup(event);
  } else if (method === "GET") {
    return getGroup(event);
  }

  return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
};
async function createGroup(event) {
  const body = JSON.parse(event.body);
  const groupId = randomUUID();

  const item = {
    groupId,
    name: body.name,
    members: body.members,
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
async function getGroup(event) {
  const groupId = event.pathParameters.groupId;

  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { groupId },
  }));

  if (!result.Item) {
    return { statusCode: 404, body: JSON.stringify({ message: "Group not found" }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}