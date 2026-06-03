import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { bundleCoreTypes } from "./bundle-core-types.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = resolve(root, "dictation");

await esbuild.build({
  bundle: true,
  entryPoints: [resolve(pkgDir, "dist/index.js")],
  format: "esm",
  outfile: resolve(pkgDir, "dist/bundle.js"),
  platform: "browser",
});

bundleCoreTypes(resolve(pkgDir, "dist"), resolve(root, "core/dist"));

const distPkgPath = resolve(pkgDir, "dist/package.json");
cpSync(resolve(pkgDir, "package.json"), distPkgPath);

const distPkg = JSON.parse(readFileSync(distPkgPath, "utf8"));
if (distPkg.exports?.["."]?.import !== "./bundle.js") {
  throw new Error(
    "dictation package.json must resolve the main entry to ./bundle.js (tsc output keeps unresolved @core imports)",
  );
}
delete distPkg.scripts;
writeFileSync(distPkgPath, `${JSON.stringify(distPkg, null, 2)}\n`);

const readmeSrc = resolve(pkgDir, "README.md");
if (existsSync(readmeSrc)) {
  cpSync(readmeSrc, resolve(pkgDir, "dist/README.md"));
}
