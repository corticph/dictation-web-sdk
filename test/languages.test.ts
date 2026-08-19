import { expect } from "@open-wc/testing";
import { enabledLanguageCodes } from "../core/src/utils/languages.js";

describe("enabledLanguageCodes", () => {
  const payload = {
    da: { streams: { enabled: true }, transcribe: { enabled: true } },
    en: { streams: { enabled: true }, transcribe: { enabled: false } },
    sv: { streams: { enabled: false }, transcribe: { enabled: true } },
  };

  it("keeps codes enabled for the requested endpoint", () => {
    expect(enabledLanguageCodes(payload, "transcribe")).to.deep.equal([
      "da",
      "sv",
    ]);
    expect(enabledLanguageCodes(payload, "streams")).to.deep.equal([
      "da",
      "en",
    ]);
  });
});
