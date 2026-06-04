import type { Corti } from "@corti/sdk";

/** Default multichannel mapping when virtual mode is on and no participants are configured. */
export const DEFAULT_VIRTUAL_MODE_PARTICIPANTS: Corti.StreamConfigParticipant[] =
  [
    { channel: 0, role: "doctor" },
    { channel: 1, role: "patient" },
  ];

export const DEFAULT_AMBIENT_CONFIG: Corti.StreamConfig = {
  mode: { outputLocale: "en", type: "facts" },
  transcription: {
    isDiarization: true,
    isMultichannel: false,
    participants: [],
    primaryLanguage: "en",
  },
};
