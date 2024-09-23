import { Context, DynamoDBPutItemRequest } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { TodoStatus } from "../../schema/graphql-schema-types";

export const request = (context: Context): DynamoDBPutItemRequest => {
  const todoId = util.autoUlid();
  const now = util.time.nowISO8601();

  return ddb.put({
    key: {
      pk: `TODO#${todoId}`,
      sk: `TODO#${todoId}`,
    },
    item: {
      pk: `TODO#${todoId}`,
      sk: `TODO#${todoId}`,
      id: todoId,
      status: TodoStatus.Pending,
      priority: 1,
      created: now,
      updated: now,
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
