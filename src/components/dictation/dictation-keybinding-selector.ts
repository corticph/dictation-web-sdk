import type { TemplateResult } from "lit";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { KeybindingSelectorBase } from "../base/keybinding-selector-base.js";

import "./dictation-keybinding-input.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends KeybindingSelectorBase {
  protected _renderKeybindingInputs(): TemplateResult {
    return html`
      <dictation-keybinding-input
        keybindingType="toggle-to-talk"
        ?disabled=${this.disabled}
      ></dictation-keybinding-input>
      <dictation-keybinding-input
        keybindingType="push-to-talk"
        ?disabled=${this.disabled}
      ></dictation-keybinding-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
