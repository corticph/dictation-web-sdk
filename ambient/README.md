# @corti/ambient-web

[![Published on npm](https://img.shields.io/npm/v/@corti/ambient-web.svg?logo=npm)](https://www.npmjs.com/package/@corti/ambient-web)
[![License: MIT](https://img.shields.io/npm/l/%40corti%2Fambient-web)](https://opensource.org/licenses/MIT)
[![Get Support on Discord](https://img.shields.io/badge/Discord-Get%20Support-5865F2.svg?logo=discord&logoColor=fff)](https://discord.com/invite/zXeXHgnZXX)

Web components for real-time, multi-speaker ambient streaming on the Corti Streams API.

- **All-in-one:** `<corti-ambient>` — recording button, settings (device, language, virtual mode by default), keyboard shortcuts, and theming
- **Modular:** `<ambient-root>` plus `<ambient-recording-button>`, `<ambient-settings-menu>`, and selectors for custom layouts

> **Note:** OAuth 2.0 authentication is not handled by this library. The client must provide an authorization token or token refresh function while using the component. Each ambient session also requires an `interactionId`.

For single-speaker dictation with voice commands, use [@corti/dictation-web](https://www.npmjs.com/package/@corti/dictation-web) instead.

## Installation

```bash
npm i @corti/ambient-web
# yarn add @corti/ambient-web
# pnpm add @corti/ambient-web
```

```js
import "@corti/ambient-web";
// or: import { CortiAmbient } from "@corti/ambient-web";
```

CDN (quick try only):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@corti/ambient-web/dist/bundle.js"></script>
```

## Quick start

```html
<corti-ambient
  id="ambient"
  interactionId="<your-interaction-id>"
></corti-ambient>

<script type="module">
  import "@corti/ambient-web";

  const ambientEl = document.getElementById("ambient");

  ambientEl.addEventListener("ready", () => {
    ambientEl.accessToken = "<your-access-token>";
  });

  ambientEl.addEventListener("transcript", (e) => {
    for (const segment of e.detail.data) {
      console.log(segment.transcript);
    }
  });
</script>
```

## Virtual mode

Include `virtualMode` in `settingsEnabled` to show the Virtual mode toggle in the settings menu (included by default on `<corti-ambient>`). Add `keybinding` to expose shortcut configuration in settings:

```html
<corti-ambient
  interactionId="<your-interaction-id>"
  settingsEnabled="device,language,virtualMode"
></corti-ambient>
```

When enabled, the browser prompts for tab/window/application audio; that stream is mixed with the microphone (mic left channel, shared audio right).

## Modular layout

```html
<ambient-root id="ambientRoot" interactionId="<your-interaction-id>">
  <ambient-recording-button></ambient-recording-button>
  <ambient-settings-menu settingsEnabled="device,language,keybinding,virtualMode"></ambient-settings-menu>
</ambient-root>

<script type="module">
  import "@corti/ambient-web";

  const root = document.getElementById("ambientRoot");
  root.addEventListener("ready", () => {
    root.accessToken = "<your-access-token>";
  });
</script>
```

| Component | Role |
| --- | --- |
| `<ambient-root>` | Context provider (auth, config, interaction ID, virtual mode) |
| `<ambient-recording-button>` | Start/stop with audio visualization |
| `<ambient-settings-menu>` | Device, language, keybinding, and virtual mode UI |
| `<ambient-device-selector>` | Device dropdown |
| `<ambient-language-selector>` | Language dropdown |
| `<ambient-keybinding-selector>` | Push-to-talk / toggle-to-talk keys |
| `<ambient-virtual-mode-selector>` | Virtual mode toggle |

## Keybindings

Defaults: **Enter** (toggle-to-talk), **Space** (push-to-talk). Key names (`event.key`) and codes (`event.code`) are supported. Shortcuts are ignored while focus is in inputs. If both modes use the same key, toggle-to-talk wins.

Configure on `<corti-ambient>` or `<ambient-root>`:

```html
<corti-ambient toggleToTalkKeybinding="Enter" pushToTalkKeybinding="Space"></corti-ambient>
```

## Documentation

- [Ambient Web Component (full guide)](https://docs.corti.ai/sdk/ambient/overview)
- [API reference](https://docs.corti.ai/sdk/ambient/reference)
- [Authentication](https://docs.corti.ai/sdk/ambient/authentication)
- [Styling](https://docs.corti.ai/sdk/ambient/styling)
- [Proxy setup](https://docs.corti.ai/sdk/ambient/proxy)
- [Examples](https://github.com/corticph/corti-examples/tree/main/ambient)

## Repository

Source and issue tracking: [github.com/corticph/dictation-web](https://github.com/corticph/dictation-web)
