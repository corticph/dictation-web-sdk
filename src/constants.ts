import { DictationConfig } from './types.js';

export const LANGUAGES_SUPPORTED = ['en', 'da'];
export const DEFAULT_DICTATION_CONFIG: DictationConfig = {
  primaryLanguage: 'en',
  interimResults: true,
  spokenPunctuation: true,
  automaticPunctuation: true,
  model: 'others',
  commands: [
    {
      id: 'delete',
      phrases: ['delete that'],
    },
    {
      id: 'insert_template',
      phrases: [
        'insert my <template_name> template',
        'insert <template_name> template',
      ],
      variables: [
        {
          key: 'template_name',
          type: 'enum',
          enum: ['new', 'existing'],
        },
      ],
    },
  ],
};
