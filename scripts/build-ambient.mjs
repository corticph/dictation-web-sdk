import { cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = resolve(root, "ambient");

await esbuild.build({
  alias: {
    "@core": resolve(root, "core/src"),
  },
  bundle: true,
  entryPoints: [resolve(pkgDir, "dist/index.js")],
  format: "esm",
  outfile: resolve(pkgDir, "dist/bundle.js"),
  platform: "browser",
});

cpSync(resolve(pkgDir, "package.json"), resolve(pkgDir, "dist/package.json"));
