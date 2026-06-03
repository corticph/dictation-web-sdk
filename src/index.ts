export {
  CortiDictation as default,
  CortiDictation,
} from "./components/dictation/corti-dictation.js";
export { DictationDeviceSelector } from "./components/dictation/dictation-device-selector.js";
export { DictationKeybindingSelector } from "./components/dictation/dictation-keybinding-selector.js";
export { DictationLanguageSelector } from "./components/dictation/dictation-language-selector.js";
export { DictationRecordingButton } from "./components/dictation/dictation-recording-button.js";
export { DictationSettingsMenu } from "./components/dictation/dictation-settings-menu.js";
export { DictationRoot } from "./contexts/dictation-context.js";

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
