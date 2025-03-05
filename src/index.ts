// corti-dictation.ts
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { RecorderManager } from './RecorderManager';
import './components/settings-menu';
import './components/audio-visualiser';
import './icons/icons';
import ThemeStyles from './styles/theme';
import ButtonStyles from './styles/buttons';
import ComponentStyles from './styles/ComponentStyles';

import { DictationConfig, ServerConfig } from './types';
import { DEFAULT_DICTATION_CONFIG } from './constants';
import CalloutStyles from './styles/callout';

export class CortiDictation extends LitElement {
  static styles = [ButtonStyles, ThemeStyles, ComponentStyles, CalloutStyles];

  @property({ type: Array })
  devices: MediaDeviceInfo[] = [];

  @property({ type: String, reflect: true })
  recordingState = 'stopped';

  @property({ type: Object })
  dictationConfig: DictationConfig = DEFAULT_DICTATION_CONFIG;

  @property({ type: Object })
  serverConfig: ServerConfig = {};

  @state()
  private _audioLevel = 0;

  private recorderManager = new RecorderManager();

  async connectedCallback() {
    super.connectedCallback();
    await this.recorderManager.initialize();
    this.devices = this.recorderManager.devices;

    // Map event names to any extra handling logic
    const eventHandlers: Record<string, (e: CustomEvent) => void> = {
      'recording-state-changed': e => {
        this.recordingState = e.detail.state;
      },
      'audio-level-changed': e => {
        this._audioLevel = e.detail.audioLevel;
        this.requestUpdate();
      },
    };

    const eventsToRelay = [
      'recording-state-changed',
      'audio-level-changed',
      'error',
      'transcript',
    ];

    eventsToRelay.forEach(eventName => {
      this.recorderManager.addEventListener(eventName, (e: Event) => {
        const customEvent = e as CustomEvent;
        // Perform any additional handling if defined
        if (eventHandlers[eventName]) {
          eventHandlers[eventName](customEvent);
        }
        // Re-dispatch the event from the component
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: customEvent.detail,
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }

  public toggleRecording() {
    this._toggleRecording();
  }

  _toggleRecording() {
    if (this.recordingState === 'recording') {
      this.recorderManager.stopRecording();
    } else if (this.recordingState === 'stopped') {
      this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        serverConfig: this.serverConfig,
      });
    }
  }

  // Handle device change events if needed
  async _onRecordingDeviceChanged(event: Event) {
    const customEvent = event as CustomEvent;
    this.recorderManager.selectedDevice = customEvent.detail.deviceId;
    if (this.recordingState === 'recording') {
      await this.recorderManager.stopRecording();
      await this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        serverConfig: this.serverConfig,
      });
    }
  }

  render() {
    const isConfigured =
      this.serverConfig &&
      this.serverConfig.token &&
      this.serverConfig.environment &&
      this.serverConfig.tenant;
    if (!isConfigured) {
      return html`
        <div class="wrapper">
          <div class="callout red tiny">
            Please configure the server settings in the parent component.
          </div>
        </div>
      `;
    }

    const isLoading =
      this.recordingState === 'initializing' ||
      this.recordingState === 'stopping';
    const isRecording = this.recordingState === 'recording';
    return html`
      <div class="wrapper">
        <button
          @click=${this._toggleRecording}
          class=${isRecording ? 'red' : 'accent'}
        >
          ${isLoading
            ? html`<icon-loading-spinner></icon-loading-spinner>`
            : isRecording
              ? html`<icon-recording></icon-recording>`
              : html`<icon-mic-on></icon-mic-on>`}
          <audio-visualiser
            .level=${this._audioLevel}
            .active=${isRecording}
          ></audio-visualiser>
        </button>

        <settings-menu
          .devices=${this.devices}
          .selectedDevice=${this.recorderManager.selectedDevice}
          ?settingsDisabled=${this.recordingState !== 'stopped'}
          @recording-device-changed=${this._onRecordingDeviceChanged}
        ></settings-menu>
      </div>
    `;
  }
}

export default CortiDictation;
