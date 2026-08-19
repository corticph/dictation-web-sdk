import type { ProxyOptions } from "../types.js";

export const X_CORTI_ANALYTICS = "x-corti-analytics";

function lowercased(source?: Record<string, string>): Record<string, string> {
  if (!source) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(source)) {
    result[key.toLowerCase()] = value.toLowerCase();
  }

  return result;
}

export function speechAnalytics(
  webComponent: string,
  webComponentVersion: string,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    ...lowercased(extra),
    web_component: webComponent,
    web_component_version: webComponentVersion,
  };
}

export function proxyWithAnalytics(
  proxy: ProxyOptions,
  analytics?: Record<string, string>,
): ProxyOptions {
  return {
    ...proxy,
    queryParameters: {
      ...proxy.queryParameters,
      [X_CORTI_ANALYTICS]: JSON.stringify(lowercased(analytics)),
    },
  };
}
