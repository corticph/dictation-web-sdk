import type { ProxyOptions } from "../types.js";

export const X_CORTI_ANALYTICS = "x-corti-analytics";

export function speechAnalytics(
  webComponent: string,
  webComponentVersion: string,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    ...extra,
    web_component: webComponent,
    web_component_version: webComponentVersion,
  };
}

export function proxyWithAnalytics(
  proxy: ProxyOptions,
  analytics: Record<string, string>,
): ProxyOptions {
  return {
    ...proxy,
    queryParameters: {
      ...proxy.queryParameters,
      [X_CORTI_ANALYTICS]: JSON.stringify(analytics),
    },
  };
}
