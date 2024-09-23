// import { buildSync } from "esbuild";

import { buildSync } from "esbuild";

const bundle = (entry: string) =>
  buildSync({
    sourcemap: "inline",
    sourcesContent: false,
    // write: false,
    format: "esm",
    target: "esnext",
    platform: "node",
    external: ["@aws-appsync/utils"],
    outdir: "dist/",
    entryPoints: [entry],
    bundle: true,
  })?.outputFiles?.[0].text;

console.log(bundle("bin/api/code/resolvers/Mutation.todoCreate.ts")); // 输出构建后的代码字符串
