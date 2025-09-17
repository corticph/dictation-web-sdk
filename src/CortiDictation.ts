import { type Corti } from '@corti/sdk';

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

import type { RecordingState, ServerConfig } from './types.js';
import { DEFAULT_DICTATION_CONFIG, LANGUAGES_SUPPORTED } from './constants.js';
import CalloutStyles from './styles/callout.js';
import { decodeToken } from './utils.js';

export class CortiDictation extends LitElement {
  static styles = [ButtonStyles, ThemeStyles, ComponentStyles, CalloutStyles];

  @property({ type: Object })
  dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG;

  @property({ type: Array })
  languagesSupported: Corti.TranscribeSupportedLanguage[] = LANGUAGES_SUPPORTED;

  @property({ type: Boolean })
  debug_displayAudio: boolean = false;

  @state()
  private _serverConfig: ServerConfig | undefined;

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
      'command',
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

  public setAccessToken(token: string) {
    try {
      const decoded = decodeToken(token);
      this._serverConfig = decoded;
      return decoded;
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  public async setAuthConfig(
    config: Corti.BearerOptions,
  ): Promise<ServerConfig> {
    try {
      const initialToken =
        'accessToken' in config
          ? { accessToken: config.accessToken, refreshToken: config.refreshToken }
          : await config.refreshAccessToken();

      if (
        !initialToken?.accessToken ||
        typeof initialToken.accessToken !== 'string'
      ) {
        throw new Error('Access token is required and must be a string');
      }

      // Remove all the parsing and just pass parameters when we implement token decoding on the SDK side
      const decoded = decodeToken(initialToken.accessToken);
      const refreshDecoded = initialToken.refreshToken
        ? decodeToken(initialToken.refreshToken)
        : undefined;

      if (!decoded) {
        throw new Error('Invalid token format');
      }

      this._serverConfig = {
        environment: decoded.environment,
        tenant: decoded.tenant,
        accessToken: initialToken.accessToken,
        expiresAt: decoded.expiresAt,
        refreshToken: config.refreshToken,
        refreshExpiresAt: refreshDecoded?.expiresAt,
        refreshAccessToken: async (refreshToken?: string) => {
          try {
            if (!config.refreshAccessToken) {
              return {
                accessToken: this._serverConfig?.accessToken || 'no_token',
                expiresIn: Infinity,
                refreshToken,
              };
            }

            const response = await config.refreshAccessToken(refreshToken);
            const decoded = decodeToken(response.accessToken);
            const refreshDecoded = response.refreshToken
              ? decodeToken(response.refreshToken)
              : undefined;

            if (this._serverConfig) {
              this._serverConfig.accessToken = response.accessToken;
              this._serverConfig.expiresAt = decoded?.expiresAt;
              this._serverConfig.refreshExpiresAt = refreshDecoded?.expiresAt;
              this._serverConfig.refreshToken = response.refreshToken;
            }

            return response;
          } catch (e) {
            throw new Error('Error when refreshing access token');
          }
        },
      };

      return this._serverConfig;
    } catch (e) {
      throw new Error('Invalid token');
    }
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
    if (!this._serverConfig) return;
    if (this._recordingState === 'recording') {
      await this.recorderManager.stopRecording();
      await this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        serverConfig: this._serverConfig,
      });
    }
  }

  public setPrimaryLanguage(language: string) {
    if (LANGUAGES_SUPPORTED.includes(language)) {
      this.dictationConfig = {
        ...this.dictationConfig,
        primaryLanguage: language,
      };

      // If recording is in progress, restart to apply the language change
      if (this._serverConfig && this._recordingState === 'recording') {
        this.recorderManager.stopRecording();
        this.recorderManager.startRecording({
          dictationConfig: this.dictationConfig,
          serverConfig: this._serverConfig,
          debug_displayAudio: this.debug_displayAudio,
        });
      }
    }
  }

  _toggleRecording() {
    if (!this._serverConfig) return;
    if (this._recordingState === 'recording') {
      this.recorderManager.stopRecording();
    } else if (this._recordingState === 'stopped') {
      this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        serverConfig: this._serverConfig,
        debug_displayAudio: this.debug_displayAudio,
      });
    }
  }

  // Handle device change events if needed
  async _onRecordingDevicesChanged(event: Event) {
    const customEvent = event as CustomEvent;
    this.setRecordingDevice(customEvent.detail.selectedDevice);
  }

  // Handle language change events
  _onLanguageChanged(event: Event) {
    const customEvent = event as CustomEvent;
    const language = customEvent.detail.language;
    if (language) {
      this.setPrimaryLanguage(language);
    }
  }

  render() {
    if (!this._serverConfig) {
      return html` <div style="display: none"></div> `;
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
            ? html` <icon-loading-spinner></icon-loading-spinner>`
            : isRecording
              ? html` <icon-recording></icon-recording>`
              : html` <icon-mic-on></icon-mic-on>`}
          <audio-visualiser
            .level=${this._audioLevel}
            .active=${isRecording}
          ></audio-visualiser>
        </button>

        <settings-menu
          .selectedDevice=${this._selectedDevice}
          .selectedLanguage=${this.dictationConfig.primaryLanguage}
          ?settingsDisabled=${this._recordingState !== 'stopped'}
          @recording-devices-changed=${this._onRecordingDevicesChanged}
          @language-changed=${this._onLanguageChanged}
        ></settings-menu>
      </div>
    `;
  }
}

export default CortiDictation;
