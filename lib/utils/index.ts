import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";

export const valTransform = <MAP extends object, T>(
  originalMap: MAP,
  transformFunc: (k: keyof MAP, v: MAP[keyof MAP]) => T | undefined
): { [k in keyof MAP]: T } => {
  return (Object.keys(originalMap) as (keyof MAP)[])
    .map(
      (key) =>
        [key, transformFunc(key, originalMap[key])] as [
          keyof MAP,
          T | undefined
        ]
    )
    .filter((entry): entry is [keyof MAP, T] => Boolean(entry[1]))
    .reduce(
      (current, [k, v]) => ({ ...current, [String(k)]: v }),
      {} as { [k in keyof MAP]: T }
    );
};
