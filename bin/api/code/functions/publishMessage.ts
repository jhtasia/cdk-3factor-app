import { Context, NONERequest } from "@aws-appsync/utils";

export const request = (context: Context): NONERequest => {
  return { payload: context.arguments.message };
};

export const response = (context: Context) => {
  return context.result;
};
