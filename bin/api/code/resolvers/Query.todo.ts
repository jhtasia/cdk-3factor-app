import { Context, DynamoDBGetItemRequest } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export const request = (context: Context): DynamoDBGetItemRequest => {
  const { id } = context.arguments;

  return ddb.get({
    key: {
      pk: `TODO#${id}`,
      sk: `TODO#${id}`,
    },
  });
};

export const response = (context: Context) => {
  return context.result;
};
