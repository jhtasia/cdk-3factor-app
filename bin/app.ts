import * as cdk from "aws-cdk-lib";
import { Cdk3FactorAppStack } from "../lib/stack/cdk-3factor-app-stack";
import { apiRules } from "./eventSystem/setting";
import {
  eventFilters,
  eventTransformationEntry,
  eventTransformationInput,
} from "./state/setting";
import { functions, rules } from "./task/setting";

const app = new cdk.App();

const stack = new Cdk3FactorAppStack(app, "ThreeFactorApp", {
  codeFirstGraphqlApiSetting: {
    dataSourceResourceMap: {},
    appsyncFunctionPropsMap: {},
  },
  stateSetting: {
    eventFilters,
    eventTransformationInput,
    eventTransformationEntry,
  },
  eventSystemSetting: {
    apiRules,
  },
  tasksSetting: {
    rules,
    functions,
  },
});

app.synth();
