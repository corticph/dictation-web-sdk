export type RecordingState =
  | 'initializing'
  | 'recording'
  | 'stopping'
  | 'stopped';

export interface ServerConfig {
  environment: string;
  tenant: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  refreshAccessToken?: (refreshToken?: string) => Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken?: string;
    refreshExpiresIn?: number;
  }>;
}
