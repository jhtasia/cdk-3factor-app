import { EnumType } from "awscdk-appsync-utils";

export const enumTypeMap = {
  TodoStatus: new EnumType("TodoStatus", {
    definition: ["done", "pending"],
  }),
};
