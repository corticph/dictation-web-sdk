import { cpSync, readFileSync, writeFileSync } from "node:fs";
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

const distPkgPath = resolve(pkgDir, "dist/package.json");
cpSync(resolve(pkgDir, "package.json"), distPkgPath);

const distPkg = JSON.parse(readFileSync(distPkgPath, "utf8"));
if (distPkg.exports?.["."]?.import !== "./bundle.js") {
  throw new Error(
    "ambient package.json must resolve the main entry to ./bundle.js (tsc output keeps unresolved @core imports)",
  );
}
writeFileSync(distPkgPath, `${JSON.stringify(distPkg, null, 2)}\n`);
