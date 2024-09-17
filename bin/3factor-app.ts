import * as cdk from "aws-cdk-lib";
import { Cdk3FactorAppStack } from "../lib/cdk-3factor-app-stack";

const app = new cdk.App();
new Cdk3FactorAppStack(app, "ThreeFactorAppStack", {});
app.synth();
