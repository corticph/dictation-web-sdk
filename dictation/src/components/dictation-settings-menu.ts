import { SettingsMenuBase } from "@core/components/settings-menu-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";
import type { TemplateResult } from "lit";
import { html } from "lit";

import "./dictation-device-selector.js";
import "./dictation-keybinding-selector.js";
import "./dictation-language-selector.js";

@safeCustomElement("dictation-settings-menu")
export class DictationSettingsMenu extends SettingsMenuBase {
  protected _renderDeviceSelector(isRecording: boolean): TemplateResult {
    return html`<dictation-device-selector
      ?disabled=${isRecording}
    ></dictation-device-selector>`;
  }

  protected _renderLanguageSelector(isRecording: boolean): TemplateResult {
    return html`<dictation-language-selector
      ?disabled=${isRecording}
    ></dictation-language-selector>`;
  }

  protected _renderKeybindingSelector(isRecording: boolean): TemplateResult {
    return html`<dictation-keybinding-selector
      ?disabled=${isRecording}
    ></dictation-keybinding-selector>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-settings-menu": DictationSettingsMenu;
  }
}
