// mic-selector.ts
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import ButtonStyles from '../styles/buttons.js';
import SelectStyles from '../styles/select.js';
import { LANGUAGES_SUPPORTED } from '../constants.js';
import { getAudioDevices, getLanguageName } from '../utils.js';
import CalloutStyles from '../styles/callout.js';

@customElement('settings-menu')
export class SettingsMenu extends LitElement {
  @property({ type: String })
  selectedDevice: MediaDeviceInfo | undefined;

  @property({ type: String })
  selectedLanguage: string = '';

  @property({ type: Boolean })
  settingsDisabled: boolean = false;

  @state()
  private _devices: MediaDeviceInfo[] = [];

  constructor() {
    super();
    navigator.mediaDevices.addEventListener(
      'devicechange',
      this.handleDevicesChange.bind(this),
    );
  }

  // on load, get the available devices
  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    const deviceResponse = await getAudioDevices();
    this._devices = deviceResponse.devices;
  }

  private async handleDevicesChange() {
    const deviceResponse = await getAudioDevices();
    this._devices = deviceResponse.devices;
  }

  static styles: CSSResultGroup = [
    css`
      :host {
        display: block;
        font-family: var(--component-font-family);
      }
      /* Retain the anchor-name styling for this component */
      #settings-popover-button {
        anchor-name: --settings_popover_btn;
      }
      [popover] {
        margin: 0;
        padding: 16px;
        border: 0;
        background: var(--card-background);
        border: 1px solid var(--card-border-color);
        border-radius: var(--card-border-radius);
        box-shadow: var(--card-box-shadow);
        z-index: 1000;
        max-width: 260px;
        width: 100%;
        min-width: 200px;
        position-anchor: --settings_popover_btn;
        position-area: bottom span-right;
        position-visibility: always;
        position-try-fallbacks: flip-inline;
        overflow-x: hidden;
      }
      .settings-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    `,
    ButtonStyles,
    SelectStyles,
    CalloutStyles,
  ];

  private _selectDevice(deviceId: string): void {
    // Find the device object
    const device = this._devices.find(d => d.deviceId === deviceId);
    if (!device) {
      return;
    }
    this.selectedDevice = device;
    this.dispatchEvent(
      new CustomEvent('recording-devices-changed', {
        detail: {
          devices: this._devices,
          selectedDevice: device,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <div class="mic-selector">
        <button id="settings-popover-button" popovertarget="settings-popover">
          <icon-settings></icon-settings>
        </button>
        <div id="settings-popover" popover>
          <div class="settings-wrapper">
            ${this.settingsDisabled
              ? html`
                  <div class="callout warn">
                    Recording is in progress. Stop recording to change settings.
                  </div>
                `
              : ''}
            <div class="form-group">
              <label id="device-select-label" for="device-select">
                Recording Device
              </label>
              <select
                id="device-select"
                aria-labelledby="device-select-label"
                @change=${(e: Event) => {
                  this._selectDevice((e.target as HTMLSelectElement).value);
                }}
                ?disabled=${this.settingsDisabled}
              >
                ${this._devices.map(
                  device => html`
                    <option
                      value=${device.deviceId}
                      ?selected=${this.selectedDevice === device}
                    >
                      ${device.label || 'Unknown Device'}
                    </option>
                  `,
                )}
              </select>
            </div>
            <div class="form-group">
              <label id="language-select-label" for="language-select">
                Dictation Language
              </label>
              <select
                id="language-select"
                aria-labelledby="language-select-label"
                @change=${(e: Event) => {
                  this._selectDevice((e.target as HTMLSelectElement).value);
                }}
                ?disabled=${this.settingsDisabled}
              >
                ${LANGUAGES_SUPPORTED.map(
                  language => html`
                    <option
                      value=${language}
                      ?selected=${this.selectedLanguage === language}
                    >
                      ${getLanguageName(language)}
                    </option>
                  `,
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-menu': SettingsMenu;
  }
}
