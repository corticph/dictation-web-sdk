import { Corti } from '@corti/sdk';

export const LANGUAGES_SUPPORTED: Corti.TranscribeSupportedLanguage[] = [
  'en',
  'en-GB',
  'da',
  'de',
  'fr',
  'sv',
];
export const DEFAULT_DICTATION_CONFIG: Corti.TranscribeConfig = {
  primaryLanguage: 'en',
  interimResults: true,
  spokenPunctuation: true,
  automaticPunctuation: true,
};
