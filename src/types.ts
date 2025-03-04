export type RecordingState = 'initializing' | 'recording' | 'stopping' | 'stopped';

export interface DictationConfig {
    primaryLanguage: string;
    interimResults: boolean;
    spokenPunctuation: boolean;
    automaticPunctuation: boolean;
    model: string;
    commands?: Command[];
}

export type PartialDictationConfig = Partial<DictationConfig>;


export interface Command {
    command: string;
    action: string;
    keywords: string[];
}

export interface ServerConfig {
    environment?: string;
    tenant?: string;
    token?: string;
}