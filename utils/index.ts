import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";

export const valTransform = <K extends string | number | symbol, V, T>(
  originalMap: { [k in K]: V },
  transformFunc: (k: K, v: V) => T | undefined
): { [k in K]: T } => {
  return (Object.keys(originalMap) as K[])
    .map(
      (key) => [key, transformFunc(key, originalMap[key])] as [K, T | undefined]
    )
    .filter((entry): entry is [K, T] => Boolean(entry[1]))
    .reduce(
      (current, [k, v]) => ({ ...current, [String(k)]: v }),
      {} as { [k in K]: T }
    );
};

export interface FunctionInfoMap {
  [funcName: string]: NodejsFunctionProps;
}
