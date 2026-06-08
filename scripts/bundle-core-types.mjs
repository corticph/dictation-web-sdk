import {
  cpSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/**
 * Copies core/dist into pkg/dist/core and rewrites @core/* imports in emitted
 * .d.ts so published packages are self-contained (core is not an npm package).
 */
export function bundleCoreTypes(pkgDistDir, coreDistDir) {
  const distDir = resolve(pkgDistDir);
  const bundledCoreDir = join(distDir, "core");

  cpSync(resolve(coreDistDir), bundledCoreDir, { recursive: true });

  const rewriteFile = (filePath) => {
    let content = readFileSync(filePath, "utf8");
    if (!content.includes("@core/")) {
      return;
    }
    const fileDir = dirname(filePath);
    let relToCore = relative(fileDir, bundledCoreDir).replace(/\\/g, "/");
    if (relToCore === "" || relToCore === ".") {
      relToCore = ".";
    } else if (!relToCore.startsWith(".")) {
      relToCore = `./${relToCore}`;
    }
    const prefix = relToCore.endsWith("/") ? relToCore : `${relToCore}/`;
    content = content.replaceAll("@core/", prefix);
    writeFileSync(filePath, content);
  };

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name.endsWith(".d.ts")) {
        rewriteFile(full);
      }
    }
  };

  walk(distDir);
}
