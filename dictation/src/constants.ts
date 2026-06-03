import type { Corti } from "@corti/sdk";

export const DEFAULT_DICTATION_CONFIG: Corti.TranscribeConfig = {
  automaticPunctuation: false,
  primaryLanguage: "en",
  spokenPunctuation: true,
};
