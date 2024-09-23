import { Context, DynamoDBPutItemRequest } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export const request = (context: Context): DynamoDBPutItemRequest => {
  const userId = util.autoUlid();
  const now = util.time.nowISO8601();

  return ddb.put({
    key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    item: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
      id: userId,
      ...context.arguments.input,
    },
  });
};

export const response = (context: Context) => {
  const { error, result } = context;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
};
