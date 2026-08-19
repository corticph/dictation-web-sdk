import { expect } from "@open-wc/testing";
import { languageCodesFromList } from "../core/src/utils/languages.js";

describe("languageCodesFromList", () => {
  it("uses the map keys from GET /languages", () => {
    expect(
      languageCodesFromList({
        bg: {
          endpoints: {
            streams: { enabled: true },
            transcribe: { enabled: true },
            transcripts: { enabled: false },
          },
        },
        da: {
          endpoints: {
            streams: { enabled: true },
            transcribe: { enabled: true },
            transcripts: { enabled: true },
          },
        },
        "en-x-noformat": {
          endpoints: {
            streams: { enabled: true },
            transcribe: { enabled: true },
            transcripts: { enabled: true },
          },
        },
      }),
    ).to.deep.equal(["bg", "da", "en-x-noformat"]);
  });
});
