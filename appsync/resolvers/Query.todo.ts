import { Context, DynamoDBGetItemRequest, util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";
import { QueryTodoArgs } from "../schema/graphql-schema-types";

export const request = (
  context: Context<QueryTodoArgs>
): DynamoDBGetItemRequest => {
  const { id } = context.arguments;

  return ddb.get({
    key: {
      pk: `TODO#${id}`,
      sk: `TODO#${id}`,
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
