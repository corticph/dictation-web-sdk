import { Corti } from '@corti/sdk';

export const LANGUAGES_SUPPORTED: Corti.TranscribeSupportedLanguage[] = [
  'en',
  'en-GB',
  'da',
  'de',
  'fr',
  'sv',
  'nl',
  'no',
];
export const DEFAULT_DICTATION_CONFIG: Corti.TranscribeConfig = {
  primaryLanguage: 'en',
  spokenPunctuation: true,
  automaticPunctuation: true,
};
