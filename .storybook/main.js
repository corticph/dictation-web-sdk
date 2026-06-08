import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export default {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-a11y'
  ],
  framework:  '@storybook/web-components-vite',

  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@core": resolve(root, "core/src"),
    };
    return config;
  },

  wdsFinal: async (config) => {
    return {
      ...config,
      nodeResolve: {
        ...config.nodeResolve,
        exportConditions: ['browser', 'development'],
        browser: true,
        mainFields: ['browser', 'module', 'main'],
        preferBuiltins: false,
      },
      plugins: [
        ...(config.plugins || []),
        {
          name: 'resolve-ws',
          resolveImport({ source }) {
            if (source === 'ws') {
              return 'data:text/javascript,export const WebSocket = globalThis.WebSocket;';
            }
          },
        },
      ],
    };
  },
};
