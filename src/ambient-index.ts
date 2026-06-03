export { AmbientDeviceSelector } from "./components/ambient/ambient-device-selector.js";
export { AmbientKeybindingSelector } from "./components/ambient/ambient-keybinding-selector.js";
export { AmbientLanguageSelector } from "./components/ambient/ambient-language-selector.js";
export { AmbientRecordingButton } from "./components/ambient/ambient-recording-button.js";
export { AmbientSettingsMenu } from "./components/ambient/ambient-settings-menu.js";
export { AmbientVirtualModeSelector } from "./components/ambient/ambient-virtual-mode-selector.js";
export {
  CortiAmbient as default,
  CortiAmbient,
} from "./components/ambient/corti-ambient.js";
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
