import { Context, DynamoDBGetItemRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export const request = (context: Context): DynamoDBGetItemRequest => {
  const { id } = context.stash.getTodoProps;
  if (!id) {
    runtime.earlyReturn(null);
  }

  return ddb.get({
    key: {
      pk: `TODO#${id}`,
      sk: `TODO#${id}`,
    },
  });
};

export const response = (context: Context) => {
  context.stash.getTodoResult = context.result;

  return context.result;
};
