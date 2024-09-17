import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import {
  MutationTodoCreateArgs,
  TodoStatus,
} from "../schema/graphql-schema-types";

export const request = (
  context: Context<MutationTodoCreateArgs>
): DynamoDBPutItemRequest => {
  const { description, name, priority } = context.arguments;

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
      created: now,
      updated: now,
      ...context.arguments,
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
