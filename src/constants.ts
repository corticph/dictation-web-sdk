import { DictationConfig } from './types.js';

export const LANGUAGES_SUPPORTED = ['en', 'da'];
export const DEFAULT_DICTATION_CONFIG: DictationConfig = {
  primaryLanguage: 'en',
  interimResults: true,
  spokenPunctuation: true,
  automaticPunctuation: true,
  model: 'others',
};
