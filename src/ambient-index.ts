export { CortiAmbient as default } from "./components/corti-ambient.js";
export { CortiAmbient } from "./components/corti-ambient.js";
export { AmbientRoot } from "./contexts/ambient-context.js";
export { AmbientRecordingButton } from "./components/ambient-recording-button.js";
export { DictationSettingsMenu as AmbientSettingsMenu } from "./components/settings-menu.js";
export { DictationDeviceSelector as AmbientDeviceSelector } from "./components/device-selector.js";
export { DictationLanguageSelector as AmbientLanguageSelector } from "./components/language-selector.js";
export { DictationKeybindingSelector as AmbientKeybindingSelector } from "./components/keybinding-selector.js";
export { AmbientVirtualModeSelector } from "./components/ambient-virtual-mode-selector.js";

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
