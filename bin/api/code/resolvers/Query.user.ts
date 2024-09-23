import { Context, util } from "@aws-appsync/utils";

export const request = (context: Context) => {
  context.stash.getUserProps = context.arguments;
  return {};
};

export const response = (context: Context) => {
  const { error, result } = context;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return context.stash.getUserResult;
};
