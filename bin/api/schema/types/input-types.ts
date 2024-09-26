import { Directive, GraphqlType, InputType } from "awscdk-appsync-utils";
import { enumTypeMap } from "./enum-types";

export const inputTypeMap = {
  TodoCreateInput: new InputType("TodoCreateInput", {
    definition: {
      name: GraphqlType.string({ isRequired: true }),
      description: GraphqlType.string({ isRequired: true }),
      assigneeId: GraphqlType.string(),
      priority: GraphqlType.int(),
    },
  }),
  UserCreateInput: new InputType("UserCreateInput", {
    definition: {
      name: GraphqlType.string({ isRequired: true }),
    },
  }),
  TodoInput: new InputType("TodoInput", {
    directives: [Directive.apiKey(), Directive.iam()],
    definition: {
      id: GraphqlType.id({ isRequired: true }),
      name: GraphqlType.string({ isRequired: true }),
      description: GraphqlType.string({ isRequired: true }),
      priority: GraphqlType.int({ isRequired: true }),
      status: enumTypeMap.TodoStatus.attribute({ isRequired: true }),
      created: GraphqlType.awsDateTime({ isRequired: true }),
      updated: GraphqlType.awsDateTime({ isRequired: true }),
    },
  }),
};
