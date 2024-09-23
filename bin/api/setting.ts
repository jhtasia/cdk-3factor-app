import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { bundle } from "./build";

export type ExistsDataSource = "none" | "ddb" | "eventBus";
export type DataSourceName = ExistsDataSource | keyof typeof dataSources;
export type FunctionName = keyof typeof functions;

export const dataSources = {
  example: {
    entry: path.join(__dirname, "lambdaDataSources/example.ts"),
  },
} as const satisfies { [name: string]: NodejsFunctionProps };

export const functions = {
  getUser: {
    dataSource: "ddb",
    code: bundle(path.join(__dirname, "code/functions/getUser.ts")),
  },
} as const satisfies {
  [name: string]: {
    dataSource: DataSourceName;
    code: string;
  };
};
