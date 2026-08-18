import { expect } from "@open-wc/testing";
import {
  proxyWithAnalytics,
  speechAnalytics,
  X_CORTI_ANALYTICS,
} from "../core/src/utils/analytics.js";

describe("speech analytics", () => {
  it("builds web_component keys for the SDK analytics payload", () => {
    expect(speechAnalytics("@corti/dictation-web", "1.2.3")).to.deep.equal({
      web_component: "@corti/dictation-web",
      web_component_version: "1.2.3",
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
    expect(proxy.queryParameters?.[X_CORTI_ANALYTICS]).to.equal(
      JSON.stringify(analytics),
    );
  });
});
