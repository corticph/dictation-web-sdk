export { CortiDictation as default } from "./components/corti-dictation.js";
export { CortiDictation } from "./components/corti-dictation.js";
export { DictationRoot } from "./contexts/dictation-context.js";
export { DictationRecordingButton } from "./components/dictation-recording-button.js";
export { DictationSettingsMenu } from "./components/settings-menu.js";
export { DictationDeviceSelector } from "./components/device-selector.js";
export { DictationLanguageSelector } from "./components/language-selector.js";
export { DictationKeybindingSelector } from "./components/keybinding-selector.js";

export type {
  ConfigurableSettings,
  Keybinding,
  RecordingState,
} from "./types.js";
export type {
  AudioEventEventDetail,
  AudioLevelChangedEventDetail,
  CommandEventDetail,
  DeltaUsageEventDetail,
  ErrorEventDetail,
  KeybindingActivatedEventDetail,
  KeybindingChangedEventDetail,
  LanguageChangedEventDetail,
  LanguagesChangedEventDetail,
  NetworkActivityEventDetail,
  RecordingDevicesChangedEventDetail,
  RecordingStateChangedEventDetail,
  TranscriptEventDetail,
  UsageEventDetail,
} from "./utils/events.js";
