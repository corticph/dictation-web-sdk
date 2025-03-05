# Corti Dictation SDK

## Overview

The **Corti Dictation SDK** is a web component that enables real-time speech-to-text dictation using Corti's Dictation API. It provides a simple interface for capturing audio, streaming it to the API, and handling transcripts.

> **Note:** OAuth 2.0 authentication is not handled by this SDK. The client must provide an API key or authorization token before using the component.

## Installation

Include the SDK in your project by importing the JavaScript module:

```html
npm i @corti/dictation-web
```

Alternatively, use a CDN to start quickly (not recommended).

```html
<script
  src="https://cdn.jsdelivr.net/npm/@corti/dictation-web/dist/bundle.min.js"
  preload
  type="module"
></script>
```

## Usage

### Demo

🚀 [Hosted Demo](https://codepen.io/hccullen/pen/OPJmxQR)

### Basic Example

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script
      src="https://cdn.jsdelivr.net/npm/@corti/dictation-web/dist/bundle.min.js"
      preload
      type="module"
    ></script>
    <corti-dictation authToken="xyz"></corti-dictation>
    <textarea
      id="transcript"
      placeholder="Transcript will appear here..."
    ></textarea>

    <script>
      const dictationEl = document.getElementById('transcript');
      // Listen for events
      dictationEl.addEventListener('transcript', e => {
        document.getElementById('transcript').value += e.detail.data.text + ' ';
      });
    </script>
  </body>
</html>
```

## API Reference

### Properties

| Property          | Type   | Description                                          |
| ----------------- | ------ | ---------------------------------------------------- |
| `devices`         | Array  | List of available recording devices.                 |
| `recordingState`  | String | Current state of recording (`stopped`, `recording`). |
| `dictationConfig` | Object | Configuration settings for dictation.                |
| `authToken`       | String | Authentication token from OAuth server               |

### Methods

| Method              | Description                |
| ------------------- | -------------------------- |
| `toggleRecording()` | Starts or stops recording. |

### Events

| Event                      | Description                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `recording-state-changed`  | Fired when the recording state changes. `detail.state` contains the new state.                |
| `recording-device-changed` | Fired when the user switches recording devices. `detail.deviceId` contains the new device ID. |
| `transcript`               | Fired when a new transcript is received. `detail.data.text` contains the transcribed text.    |
| `audio-level-changed`      | Fired when the input audio level changes. `detail.audioLevel` contains the new level.         |
| `error`      | Fired on error. `detail` contains the full error.         |

## Authentication

This SDK does not handle OAuth 2.0 authentication. The client must provide an API key or access token as a string in `authToken`.

## Notes

- Works in modern browsers that support Web Components and MediaRecorder API.
- Supports dark and light mode based on browser preference.

## License

This SDK is not licensed.

## Support

For issues or questions, contact **Corti Support** at [support@corti.ai](mailto:support@corti.ai).
