import { SettingsMenuBase } from "@corti/core-web/components/settings-menu-base.js";
import type { TemplateResult } from "lit";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

import "./ambient-device-selector.js";
import "./ambient-keybinding-selector.js";
import "./ambient-language-selector.js";
import "./ambient-virtual-mode-selector.js";

@customElement("ambient-settings-menu")
export class AmbientSettingsMenu extends SettingsMenuBase {
  protected _renderDeviceSelector(isRecording: boolean): TemplateResult {
    return html`<ambient-device-selector
      ?disabled=${isRecording}
    ></ambient-device-selector>`;
  }

  protected _renderLanguageSelector(isRecording: boolean): TemplateResult {
    return html`<ambient-language-selector
      ?disabled=${isRecording}
    ></ambient-language-selector>`;
  }

  protected _renderKeybindingSelector(isRecording: boolean): TemplateResult {
    return html`<ambient-keybinding-selector
      ?disabled=${isRecording}
    ></ambient-keybinding-selector>`;
  }

  protected override _renderVirtualModeSelector(
    isRecording: boolean,
  ): TemplateResult {
    return html`<ambient-virtual-mode-selector
      ?disabled=${isRecording}
    ></ambient-virtual-mode-selector>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-settings-menu": AmbientSettingsMenu;
  }
}
