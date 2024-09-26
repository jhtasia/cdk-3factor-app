import { Directive, GraphqlType, ObjectType } from "awscdk-appsync-utils";
import { enumTypeMap } from "./enum-types";

export const objectTypeMap = {
  Todo: new ObjectType("Todo", {
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
  User: new ObjectType("User", {
    definition: {
      id: GraphqlType.id({ isRequired: true }),
      name: GraphqlType.string({ isRequired: true }),
    },
  }),
};
