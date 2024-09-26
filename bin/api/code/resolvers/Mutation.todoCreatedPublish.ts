import { Context, NONERequest } from "@aws-appsync/utils";

export const request = (context: Context): NONERequest => {
  return { payload: {} };
};

export const response = (context: Context) => {
  const { error, result } = context;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
};
