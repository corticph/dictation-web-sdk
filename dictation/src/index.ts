export type {
  ConfigurableSettings,
  Keybinding,
  RecordingState,
} from "@corti/core-web/types.js";
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
} from "@corti/core-web/utils/events.js";
export {
  CortiDictation as default,
  CortiDictation,
} from "./components/corti-dictation.js";
export { DictationDeviceSelector } from "./components/dictation-device-selector.js";
export { DictationKeybindingSelector } from "./components/dictation-keybinding-selector.js";
export { DictationLanguageSelector } from "./components/dictation-language-selector.js";
export { DictationRecordingButton } from "./components/dictation-recording-button.js";
export { DictationSettingsMenu } from "./components/dictation-settings-menu.js";
export { DictationRoot } from "./contexts/dictation-context.js";
