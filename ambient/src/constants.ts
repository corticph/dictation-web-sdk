import type { Corti } from "@corti/sdk";

export const DEFAULT_AMBIENT_CONFIG: Corti.StreamConfig = {
  mode: { outputLocale: "en", type: "facts" },
  transcription: {
    isDiarization: true,
    isMultichannel: false,
    participants: [],
    primaryLanguage: "en",
  },
};
