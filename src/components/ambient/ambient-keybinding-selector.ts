import type { TemplateResult } from "lit";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { KeybindingSelectorBase } from "../base/keybinding-selector-base.js";

import "./ambient-keybinding-input.js";

@customElement("ambient-keybinding-selector")
export class AmbientKeybindingSelector extends KeybindingSelectorBase {
  protected _renderKeybindingInputs(): TemplateResult {
    return html`
      <ambient-keybinding-input
        keybindingType="toggle-to-talk"
        ?disabled=${this.disabled}
      ></ambient-keybinding-input>
      <ambient-keybinding-input
        keybindingType="push-to-talk"
        ?disabled=${this.disabled}
      ></ambient-keybinding-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-keybinding-selector": AmbientKeybindingSelector;
  }
}
