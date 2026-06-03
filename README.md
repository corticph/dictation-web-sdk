# Corti Speech Web Components

Lit-based web components for Corti speech APIs. Published as two npm packages from this monorepo:

| Package | Use case | Primary element |
| --- | --- | --- |
| [@corti/dictation-web](https://www.npmjs.com/package/@corti/dictation-web) | Real-time single-speaker dictation (Transcribe) | `<corti-dictation>` |
| [@corti/ambient-web](https://www.npmjs.com/package/@corti/ambient-web) | Real-time multi-speaker ambient streaming (Streams) | `<corti-ambient>` |

Package readmes: [dictation/README.md](./dictation/README.md), [ambient/README.md](./ambient/README.md).

[![Dictation on npm](https://img.shields.io/npm/v/@corti/dictation-web.svg?logo=npm&label=dictation)](https://www.npmjs.com/package/@corti/dictation-web)
[![Ambient on npm](https://img.shields.io/npm/v/@corti/ambient-web.svg?logo=npm&label=ambient)](https://www.npmjs.com/package/@corti/ambient-web)
[![License: MIT](https://img.shields.io/npm/l/%40corti%2Fdictation-web)](https://opensource.org/licenses/MIT)
[![Get Support on Discord](https://img.shields.io/badge/Discord-Get%20Support-5865F2.svg?logo=discord&logoColor=fff)](https://discord.com/invite/zXeXHgnZXX)

## Overview

Both packages share the same architecture:

1. **Opinionated component** — drop-in UI (`<corti-dictation>` or `<corti-ambient>`)
2. **Modular components** — compose your own layout under `<dictation-root>` or `<ambient-root>`

> **Note:** OAuth 2.0 authentication is not handled by this library. The client must provide an authorization token or token refresh function while using the component. Ambient streaming also requires an `interactionId`.

## Documentation

Product documentation (install, API, auth, styling) lives on [docs.corti.ai](https://docs.corti.ai):

- [Dictation Web Component](https://docs.corti.ai/sdk/dictation/overview)
- [Ambient Web Component](https://docs.corti.ai/sdk/ambient/overview)
