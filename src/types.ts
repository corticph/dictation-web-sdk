export type RecordingState =
  | 'initializing'
  | 'recording'
  | 'stopping'
  | 'stopped';

export interface ServerConfig {
  environment: string;
  tenant: string;
  accessToken: string;
}
