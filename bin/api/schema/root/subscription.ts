import { Directive, Field } from "awscdk-appsync-utils";
import { objectTypeMap } from "../types/object-types";

export const subscriptionMap = {
  todoCreated: new Field({
    directives: [Directive.subscribe("todoCreatedPublish")],
    returnType: objectTypeMap.Todo.attribute(),
  }),
};
