import { consume } from "@lit/context";
import {
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { recordingStateContext } from "../contexts/mixins/recording-state-context.js";
import ButtonStyles from "../styles/buttons.js";
import CalloutStyles from "../styles/callout.js";
import SettingsMenuStyles from "../styles/settings-menu.js";
import type { ConfigurableSettings, RecordingState } from "../types.js";
import { commaSeparatedConverter } from "../utils/converters.js";

import "../icons/icons.js";

export abstract class SettingsMenuBase extends LitElement {
  protected abstract _renderDeviceSelector(
    isRecording: boolean,
  ): TemplateResult | typeof nothing;

  protected abstract _renderLanguageSelector(
    isRecording: boolean,
  ): TemplateResult | typeof nothing;

  protected abstract _renderKeybindingSelector(
    isRecording: boolean,
  ): TemplateResult | typeof nothing;

  protected _renderVirtualModeSelector(
    _isRecording: boolean,
  ): TemplateResult | typeof nothing {
    return nothing;
  }

  @consume({ context: recordingStateContext, subscribe: true })
  @state()
  _recordingState: RecordingState = "stopped";

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  static styles: CSSResultGroup = [
    SettingsMenuStyles,
    ButtonStyles,
    CalloutStyles,
  ];

  render() {
    if (this.settingsEnabled?.length === 0) {
      return nothing;
    }

    const isRecording = this._recordingState === "recording";
    const showDeviceSelector = this.settingsEnabled.includes("device");
    const showLanguageSelector = this.settingsEnabled.includes("language");
    const showKeybinding = this.settingsEnabled.includes("keybinding");
    const showVirtualMode = this.settingsEnabled.includes("virtualMode");

    return html`
      <div class="mic-selector">
        <button id="settings-popover-button" popovertarget="settings-popover">
          <icon-settings />
        </button>
        <div id="settings-popover" popover>
          <div class="settings-wrapper">
            ${
              isRecording
                ? html`
                  <div class="callout warn">
                    Recording is in progress. Stop recording to change settings.
                  </div>
                `
                : nothing
            }
            ${showDeviceSelector ? this._renderDeviceSelector(isRecording) : nothing}
            ${showLanguageSelector ? this._renderLanguageSelector(isRecording) : nothing}
            ${showKeybinding ? this._renderKeybindingSelector(isRecording) : nothing}
            ${showVirtualMode ? this._renderVirtualModeSelector(isRecording) : nothing}
          </div>
        </div>
      </div>
    `;
  }
}
