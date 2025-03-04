# Corti Dictation SDK

## Overview
The **Corti Dictation SDK** is a web component that enables real-time speech-to-text dictation using Corti's Dictation API. It provides a simple interface for capturing audio, streaming it to the API, and handling transcripts.

> **Note:** OAuth 2.0 authentication is not handled by this SDK. The client must provide an API key or authorization token before using the component.

---

## Installation

Include the SDK in your project by importing the JavaScript module:

```html
<script type="module" src="path-to/corti-dictation.js"></script>
```

---

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <corti-dictation></corti-dictation>
  <textarea id="transcript" placeholder="Transcript will appear here..."></textarea>

  <script type="module">
    import './path-to/corti-dictation.js';

    const dictationEl = document.querySelector('corti-dictation');
    
    // Provide server configuration
    dictationEl.serverConfig = {
      environment: "dev-weu",
      tenant: "copsdev",
      token: "your-api-token"
    };
    
    // Listen for events
    dictationEl.addEventListener('transcript', (e) => {
      document.getElementById('transcript').value += e.detail.data.text + ' ';
    });
  </script>
</body>
</html>
```

---

## API Reference

### Properties

| Property         | Type    | Description |
|-----------------|---------|-------------|
| `devices`       | Array   | List of available recording devices. |
| `recordingState` | String  | Current state of recording (`stopped`, `recording`). |
| `dictationConfig` | Object | Configuration settings for dictation. |
| `serverConfig`  | Object  | Server authentication and API settings. Must include `environment`, `tenant`, and `token`. |

### Methods

| Method              | Description |
|---------------------|-------------|
| `toggleRecording()` | Starts or stops recording. |

### Events

| Event                      | Description |
|----------------------------|-------------|
| `recording-state-changed`  | Fired when the recording state changes. `detail.state` contains the new state. |
| `recording-device-changed` | Fired when the user switches recording devices. `detail.deviceId` contains the new device ID. |
| `transcript`               | Fired when a new transcript is received. `detail.data.text` contains the transcribed text. |
| `audio-level-changed`      | Fired when the input audio level changes. `detail.audioLevel` contains the new level. |

---

## Authentication

This SDK does not handle OAuth 2.0 authentication. The client must provide an API key or access token in `serverConfig.token`.

Example:
```js
dictationEl.serverConfig = {
  environment: "prod-eu",
  tenant: "your-tenant-id",
  token: "your-api-key"
};
```

---

## Notes
- Ensure the provided API token is valid.
- The component requires microphone access permissions.
- Works in modern browsers that support Web Components and MediaRecorder API.

---

## License
This SDK is not licensed.

---

## Developer Guide
See [Developer Setup](docs/DEV_README.md) for installation and development details.

---

## Support
For issues or questions, contact **Corti Support** at [support@corti.ai](mailto:support@corti.ai).

