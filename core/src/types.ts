export type RecordingSocketInboundMessage = { type: string };

export type RecordingState =
  | "initializing"
  | "recording"
  | "stopping"
  | "stopped";

export type Keybinding = string;

export type ConfigurableSettings =
  | "device"
  | "language"
  | "keybinding"
  | "virtualMode";

export type ProxyOptions = {
  url: string;
  protocols?: string[];
  queryParameters?: Record<string, string>;
};
