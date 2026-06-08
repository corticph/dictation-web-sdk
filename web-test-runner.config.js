import { resolve } from "node:path";
import { esbuildPlugin } from "@web/dev-server-esbuild";

const filteredLogs = ["Running in dev mode", "Lit is in dev mode"];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: "test/**/*.ts",

  nodeResolve: {
    exportConditions: ["browser", "development"],
  },

  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: resolve(process.cwd(), "tsconfig.test.json"),
    }),
  ],

  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === "string" && filteredLogs.some((l) => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },
});
