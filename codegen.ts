import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./appsync/schema/example.graphql",
  generates: {
    "./appsync/schema/graphql-schema-types.ts": {
      plugins: ["typescript"],
      config: {
        scalars: {
          AWSDateTime: "Date",
          AWSTimestamp: "number",
          AWSJSON: "object",
          AWSURL: "string",
          AWSDate: "Date",
          AWSBoolean: "boolean",
          AWSDecimal: "number",
          AWSID: "string",
          AWSIPAddress: "string",
        },
      },
    },
  },
};

export default config;
