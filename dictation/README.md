# @corti/dictation-web

[![Published on npm](https://img.shields.io/npm/v/@corti/dictation-web.svg?logo=npm)](https://www.npmjs.com/package/@corti/dictation-web)
[![License: MIT](https://img.shields.io/npm/l/%40corti%2Fdictation-web)](https://opensource.org/licenses/MIT)
[![Get Support on Discord](https://img.shields.io/badge/Discord-Get%20Support-5865F2.svg?logo=discord&logoColor=fff)](https://discord.com/invite/zXeXHgnZXX)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue.svg?logo=rocket&logoColor=fff)](https://codepen.io/hccullen/pen/OPJmxQR)

Web components for real-time, single-speaker dictation on the Corti Transcribe API.

- **All-in-one:** `<corti-dictation>` — recording button, settings, keyboard shortcuts, and theming
- **Modular:** `<dictation-root>` plus `<dictation-recording-button>`, `<dictation-settings-menu>`, and selectors for custom layouts

> **Note:** OAuth 2.0 authentication is not handled by this library. The client must provide an authorization token or token refresh function while using the component.

For multi-speaker ambient streaming, use [@corti/ambient-web](https://www.npmjs.com/package/@corti/ambient-web) instead.

## Installation

```bash
npm i @corti/dictation-web
# yarn add @corti/dictation-web
# pnpm add @corti/dictation-web
```

```js
import "@corti/dictation-web";
// or: import { CortiDictation } from "@corti/dictation-web";
```

CDN (quick try only):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@corti/dictation-web/dist/bundle.js"></script>
```

## Quick start

```html
<corti-dictation id="dictation"></corti-dictation>
<textarea id="transcript" placeholder="Transcript will appear here..."></textarea>

<script type="module">
  import "@corti/dictation-web";

  const dictationEl = document.getElementById("dictation");
  const transcriptEl = document.getElementById("transcript");

  dictationEl.addEventListener("ready", () => {
    dictationEl.accessToken = "<your-access-token>";
  });

  dictationEl.addEventListener("transcript", (e) => {
    if (e.detail.data.isFinal) {
      transcriptEl.value += `${e.detail.data.text} `;
    }
  });
</script>
```

## Modular layout

```html
<dictation-root id="dictationRoot">
  <dictation-recording-button></dictation-recording-button>
  <dictation-settings-menu settingsEnabled="device,language,keybinding"></dictation-settings-menu>
</dictation-root>

<script type="module">
  import "@corti/dictation-web";

  const root = document.getElementById("dictationRoot");
  root.addEventListener("ready", () => {
    root.accessToken = "<your-access-token>";
  });
</script>
```

Modular components require `<dictation-root>` as a parent. They share state through Lit context.

| Component | Role |
| --- | --- |
| `<dictation-root>` | Context provider (auth, config, devices, keybindings) |
| `<dictation-recording-button>` | Start/stop with audio visualization |
| `<dictation-settings-menu>` | Device, language, and keybinding UI |
| `<dictation-device-selector>` | Device dropdown |
| `<dictation-language-selector>` | Language dropdown |
| `<dictation-keybinding-selector>` | Push-to-talk / toggle-to-talk keys |

## Keybindings

Defaults: **Enter** (toggle-to-talk), **Space** (push-to-talk). Key names (`event.key`) and codes (`event.code`) are supported. Shortcuts are ignored while focus is in inputs. If both modes use the same key, toggle-to-talk wins.

Configure on `<corti-dictation>` or `<dictation-root>`:

```html
<corti-dictation toggleToTalkKeybinding="`" pushToTalkKeybinding="Space"></corti-dictation>
```

## Documentation

- [Dictation Web Component (full guide)](https://docs.corti.ai/sdk/dictation/overview)
- [API reference](https://docs.corti.ai/sdk/dictation/reference)
- [Authentication](https://docs.corti.ai/sdk/dictation/authentication)
- [Styling](https://docs.corti.ai/sdk/dictation/styling)
- [Proxy setup](https://docs.corti.ai/sdk/dictation/proxy)
- [Examples](https://github.com/corticph/corti-examples/tree/main/dictation)

## Repository

Source and issue tracking: [github.com/corticph/dictation-web](https://github.com/corticph/dictation-web)
