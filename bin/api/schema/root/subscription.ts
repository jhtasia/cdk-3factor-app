import { Field } from "awscdk-appsync-utils";
import { objectTypeMap } from "../types/object-types";

export const subscriptionMap = {
  todoUpdated: new Field({
    returnType: objectTypeMap.Todo.attribute({ isRequired: true }),
  }),
};
