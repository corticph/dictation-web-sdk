import type { Corti } from "@corti/sdk";
import { DEFAULT_VIRTUAL_MODE_PARTICIPANTS } from "../constants.js";

export function applyVirtualModeToAmbientConfig(
  base: Corti.StreamConfig,
  enabled: boolean,
): Corti.StreamConfig {
  const existingParticipants = base.transcription?.participants;

  if (enabled) {
    return {
      ...base,
      transcription: {
        ...base.transcription,
        diarize: false,
        isMultichannel: true,
        participants: existingParticipants?.length
          ? existingParticipants
          : DEFAULT_VIRTUAL_MODE_PARTICIPANTS,
      },
    };
  }

  return {
    ...base,
    transcription: {
      ...base.transcription,
      diarize: true,
      isMultichannel: false,
      participants:
        existingParticipants === DEFAULT_VIRTUAL_MODE_PARTICIPANTS
          ? []
          : (existingParticipants ?? []),
    },
  };
}
