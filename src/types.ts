import { type Corti } from '@corti/sdk';

export type RecordingState =
  | 'initializing'
  | 'recording'
  | 'stopping'
  | 'stopped';

export type ServerConfig = {
  environment: string;
  tenant: string;
  expiresAt?: number;
  refreshExpiresAt?: number;
} & Corti.BearerOptions;
