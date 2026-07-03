## Release 0.8.0

## Overview

`@corti/dictation-web` and `@corti/ambient-web` now depend on stable `@corti/sdk@4.0.0`. Ambient default and virtual-mode stream configuration uses the SDK v4 `diarize` field instead of the removed `isDiarization` option.

## ❗ Breaking changes

- **SDK v4 required**: Both packages now depend on `@corti/sdk@4.0.0`. Upgrade your app’s SDK dependency when upgrading these components.
  - **Migration**: Bump `@corti/sdk` to `4.0.0` (or newer) alongside `@corti/dictation-web` / `@corti/ambient-web`.
  - **Example**:
    - Before: `"@corti/sdk": "3.0.0", "@corti/ambient-web": "0.7.0"`
    - After: `"@corti/sdk": "4.0.0", "@corti/ambient-web": "0.8.0"`

- **Ambient `isDiarization` removed**: Default ambient config and virtual-mode toggling now set `transcription.diarize` per SDK v4.
  - **Migration**: If you pass a custom `ambientConfig` (or merge into `Corti.StreamConfig`), rename `transcription.isDiarization` to `transcription.diarize`.
  - **Example**:
    - Before: `transcription: { isDiarization: true, primaryLanguage: "en" }`
    - After: `transcription: { diarize: true, primaryLanguage: "en" }`

## Changes

- chore(ambient): use `transcription.diarize` in `DEFAULT_AMBIENT_CONFIG` and virtual-mode config helper.
- chore(deps): bump `@corti/sdk` from `3.0.0` to `4.0.0` in `@corti/dictation-web` and `@corti/ambient-web`.
