import type { Corti } from "@corti/sdk";

// Inbound WebSocket message unions live in core (not dictation/ambient) because
// RecordingButtonBase is shared and switches on both transcribe and stream payloads.
// A per-package generic TMessage is not narrowed inside that switch, which forces
// casts; RecordingSocketInboundMessage is the concrete union the handler branches on.
export type TranscribeMessage =
  | Corti.TranscribeConfigStatusMessage
  | Corti.TranscribeUsageMessage
  | Corti.TranscribeDeltaUsageMessage
  | Corti.TranscribeEndedMessage
  | Corti.TranscribeErrorMessage
  | Corti.TranscribeTranscriptMessage
  | Corti.TranscribeCommandMessage
  | Corti.TranscribeFlushedMessage
  | Corti.TranscribeAudioEventMessage;

export type StreamAmbientMessage =
  | Corti.StreamTranscriptMessage
  | Corti.StreamFactsMessage
  | Corti.StreamFlushedMessage
  | Corti.StreamDeltaUsageMessage
  | Corti.StreamEndedMessage
  | Corti.StreamUsageMessage
  | Corti.StreamErrorMessage
  | Corti.StreamConfigStatusMessage
  | Corti.StreamAudioEventMessage;

export type RecordingSocketInboundMessage =
  | TranscribeMessage
  | StreamAmbientMessage;
