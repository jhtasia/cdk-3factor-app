import { GraphqlType, InputType } from "awscdk-appsync-utils";

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
};
