import { expect } from "@open-wc/testing";
import {
  proxyWithAnalytics,
  speechAnalytics,
  X_CORTI_ANALYTICS,
} from "../core/src/utils/analytics.js";

describe("speech analytics", () => {
  it("merges extra keys, lowercases them, and keeps web_component identity", () => {
    expect(
      speechAnalytics("@corti/dictation-web", "1.2.3", {
        Workflow: "Ambient-Scribe",
        web_component: "spoof",
      }),
    ).to.deep.equal({
      web_component: "@corti/dictation-web",
      web_component_version: "1.2.3",
      workflow: "ambient-scribe",
    });
  });

  it("puts the payload on the proxy x-corti-analytics query parameter", () => {
    const analytics = speechAnalytics("@corti/ambient-web", "1.2.3");
    const proxy = proxyWithAnalytics(
      { queryParameters: { foo: "bar" }, url: "wss://proxy.example/stream" },
      analytics,
    );

    expect(proxy.url).to.equal("wss://proxy.example/stream");
    expect(proxy.queryParameters?.foo).to.equal("bar");
    expect(
      JSON.parse(proxy.queryParameters?.[X_CORTI_ANALYTICS] ?? "{}"),
    ).to.deep.equal({
      web_component: "@corti/ambient-web",
      web_component_version: "1.2.3",
    });
  });
});
