import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { bundleCoreTypes } from "./bundle-core-types.mjs";

const pkgName = process.argv[2];
if (pkgName !== "dictation" && pkgName !== "ambient") {
  throw new Error("Usage: node build-package.mjs <dictation|ambient>");
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = resolve(root, pkgName);

await esbuild.build({
  bundle: true,
  entryPoints: [resolve(pkgDir, "dist/index.js")],
  format: "esm",
  outfile: resolve(pkgDir, "dist/bundle.js"),
  platform: "browser",
});

bundleCoreTypes(resolve(pkgDir, "dist"), resolve(root, "core/dist"));
