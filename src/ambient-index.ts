export { AmbientRecordingButton } from "./components/ambient-recording-button.js";
export { AmbientVirtualModeSelector } from "./components/ambient-virtual-mode-selector.js";
export {
  CortiAmbient as default,
  CortiAmbient,
} from "./components/corti-ambient.js";
export { DictationDeviceSelector as AmbientDeviceSelector } from "./components/device-selector.js";
export { DictationKeybindingSelector as AmbientKeybindingSelector } from "./components/keybinding-selector.js";
export { DictationLanguageSelector as AmbientLanguageSelector } from "./components/language-selector.js";
export { DictationSettingsMenu as AmbientSettingsMenu } from "./components/settings-menu.js";
export { AmbientRoot } from "./contexts/ambient-context.js";

export type { AmbientStreamSessionConfig } from "./controllers/ambient-controller.js";
export type {
  ConfigurableSettings,
  Keybinding,
  RecordingState,
} from "./types.js";
export type {
  AudioEventEventDetail,
  AudioLevelChangedEventDetail,
  DeltaUsageEventDetail,
  ErrorEventDetail,
  FactsEventDetail,
  KeybindingActivatedEventDetail,
  KeybindingChangedEventDetail,
  LanguageChangedEventDetail,
  LanguagesChangedEventDetail,
  NetworkActivityEventDetail,
  RecordingDevicesChangedEventDetail,
  RecordingStateChangedEventDetail,
  TranscriptEventDetail,
  UsageEventDetail,
  VirtualModeChangedEventDetail,
} from "./utils/events.js";
