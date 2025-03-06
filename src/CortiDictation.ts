// corti-dictation.ts
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { RecorderManager } from './RecorderManager.js';
import './components/settings-menu.js';
import './components/audio-visualiser.js';
import './icons/icons.js';
import ThemeStyles from './styles/theme.js';
import ButtonStyles from './styles/buttons.js';
import ComponentStyles from './styles/ComponentStyles.js';

import type { DictationConfig, RecordingState } from './types.js.js';
import { DEFAULT_DICTATION_CONFIG } from './constants.js.js';
import CalloutStyles from './styles/callout.js.js';

export class CortiDictation extends LitElement {
  static styles = [ButtonStyles, ThemeStyles, ComponentStyles, CalloutStyles];

  @property({ type: Object })
  dictationConfig: DictationConfig = DEFAULT_DICTATION_CONFIG;

  @property({ type: String })
  authToken: string | undefined;

  @state()
  private _audioLevel: number = 0;

  @state()
  private _recordingState: RecordingState = 'stopped';

  @state()
  private _selectedDevice: MediaDeviceInfo | undefined;

  @state()
  private _devices: MediaDeviceInfo[] = [];

  private recorderManager = new RecorderManager();

  async connectedCallback() {
    super.connectedCallback();
    const devices = await this.recorderManager.initialize();
    if (devices.selectedDevice) {
      this._selectedDevice = this.recorderManager.selectedDevice;
      this._devices = this.recorderManager.devices;
      this.dispatchEvent(new CustomEvent('ready'));
    }

    // Map event names to any extra handling logic
    const eventHandlers: Record<string, (e: CustomEvent) => void> = {
      'recording-state-changed': e => {
        this._recordingState = e.detail.state;
      },
      'devices-changed': () => {
        this._devices = [...this.recorderManager.devices];
        this.requestUpdate();
      },
      'audio-level-changed': e => {
        this._audioLevel = e.detail.audioLevel;
        this.requestUpdate();
      },
    };

    const eventsToRelay = [
      'recording-state-changed',
      'recording-devices-changed',
      'audio-level-changed',
      'error',
      'transcript',
      'ready',
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

  public get selectedDevice(): MediaDeviceInfo | null {
    return this.recorderManager.selectedDevice || null;
  }

  public get recordingState(): RecordingState {
    return this._recordingState;
  }

  public get devices(): MediaDeviceInfo[] {
    return this._devices;
  }

  public async setRecordingDevice(device: MediaDeviceInfo) {
    this.recorderManager.selectedDevice = device;
    this._selectedDevice = device;
    if (!this.authToken) return;
    if (this._recordingState === 'recording') {
      await this.recorderManager.stopRecording();
      await this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        authToken: this.authToken,
      });
    }
  }

  _toggleRecording() {
    if (!this.authToken) return;
    if (this._recordingState === 'recording') {
      this.recorderManager.stopRecording();
    } else if (this._recordingState === 'stopped') {
      this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        authToken: this.authToken,
      });
    }
  }

  // Handle device change events if needed
  async _onRecordingDevicesChanged(event: Event) {
    const customEvent = event as CustomEvent;
    this.setRecordingDevice(customEvent.detail.selectedDevice);
  }

  render() {
    const isConfigured = this.authToken;
    if (!isConfigured) {
      return html`
        <div class="wrapper">
          <div class="callout red small">No Auth Token</div>
        </div>
      `;
    }

    const isLoading =
      this._recordingState === 'initializing' ||
      this._recordingState === 'stopping';
    const isRecording = this._recordingState === 'recording';
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
          .selectedDevice=${this._selectedDevice}
          ?settingsDisabled=${this._recordingState !== 'stopped'}
          @recording-devices-changed=${this._onRecordingDevicesChanged}
        ></settings-menu>
      </div>
    `;
  }
}

export default CortiDictation;
