import { buildSync } from "esbuild";

export const bundle = (entry: string) =>
  buildSync({
    sourcemap: "inline",
    sourcesContent: false,
    write: false,
    format: "esm",
    target: "esnext",
    platform: "node",
    external: ["@aws-appsync/utils"],
    outdir: "dist/",
    entryPoints: [entry],
    bundle: true,
  })?.outputFiles?.[0].text;
