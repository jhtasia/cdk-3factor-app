import { RuleTargetInput } from "aws-cdk-lib/aws-events";
import { ApiRule } from "../../lib/constructs/3factor-event-system-construct";

export const apiRules = [
  {
    ruleName: "todoUpdated",
    eventPattern: {
      detailType: ["TodoUpdated"],
    },
    graphQLOperation: `
  mutation Request($todo: Todo!) {
    todoUpdatedPublish(todo: $todo) {
      id
      name
      description
      priority
      status
      created
      updated
    }
  }
`,
    variables: RuleTargetInput.fromObject({ todo: "$.detail" }),
  },
] as const satisfies ApiRule[];
