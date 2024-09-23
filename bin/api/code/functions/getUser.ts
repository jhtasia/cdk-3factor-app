import { Context, DynamoDBGetItemRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export const request = (context: Context): DynamoDBGetItemRequest => {
  const { id } = context.stash.getUserProps;

  if (!id) {
    runtime.earlyReturn(null);
  }

  return ddb.get({
    key: {
      pk: `USER#${id}`,
      sk: `USER#${id}`,
    },
  });
};

export const response = (context: Context) => {
  context.stash.getUserResult = context.result;

  return context.result;
};
