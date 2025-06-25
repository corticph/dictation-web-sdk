import { DictationConfig } from './types.js';

export const LANGUAGES_SUPPORTED = ['en', 'en-GB', 'da', 'de', 'fr', 'de-CH', 'sv', 'es', 'it', 'nl', 'no', 'pt'];
export const DEFAULT_DICTATION_CONFIG: DictationConfig = {
  primaryLanguage: 'en',
  interimResults: true,
  spokenPunctuation: true,
  automaticPunctuation: true,
};