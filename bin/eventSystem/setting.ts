import { EventField, RuleTargetInput } from "aws-cdk-lib/aws-events";
import { ApiRule } from "../../lib/constructs/3factor-event-system-construct";

export const apiRules = [
  {
    ruleName: "TodoCreated",
    eventPattern: {
      detail: {
        name: ["TodoCreated"],
      },
    },
    graphQLOperation: `
mutation TodoCreatedPublish($message: TodoInput!) {
  todoCreatedPublish(message: $message) {
    assignee {
      id
      name
    }
    created
    description
    id
    name
    priority
    status
    updated
  }
}

`,
    variables: RuleTargetInput.fromObject({
      message: EventField.fromPath("$.detail.data"),
    }),
    retryAttempts: 3,
  },
] as const satisfies ApiRule[];
