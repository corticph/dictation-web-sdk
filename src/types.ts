export type RecordingState =
  | 'initializing'
  | 'recording'
  | 'stopping'
  | 'stopped';

interface CommandVariable {
  key: string;
  type: 'enum' | 'string';
  enum?: string[];
}

export interface Command {
  id: string;
  phrases: string[];
  variables?: CommandVariable[];
}

export interface DictationConfig {
  primaryLanguage: string;
  interimResults: boolean;
  spokenPunctuation: boolean;
  automaticPunctuation: boolean;
  model?: string;
  commands?: Command[];
}

export type PartialDictationConfig = Partial<DictationConfig>;

export interface ServerConfig {
  environment: string;
  tenant: string;
  accessToken: string;
}
