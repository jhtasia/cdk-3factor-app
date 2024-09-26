import * as path from "path";
import {
  TaskFunctionsProps,
  TaskRuleProps,
} from "../../lib/constructs/3factor-tasks-construct";

export const rules = [
  {
    ruleName: "LambdaEventHandlerRule",
    eventPattern: {
      detail: ["StateChanged"],
    },
    func: "LambdaEventHandler",
  },
] as const satisfies TaskRuleProps[];

export const functions = {
  LambdaEventHandler: {
    entry: path.join(__dirname, "eventHandler.ts"),
    grantPermissions: [],
  },
} as const satisfies TaskFunctionsProps<typeof rules>;
