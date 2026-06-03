import { customElement } from "lit/decorators.js";
import { KeybindingSelectorBase } from "../base/keybinding-selector-base.js";

@customElement("ambient-keybinding-selector")
export class AmbientKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-keybinding-selector": AmbientKeybindingSelector;
  }
}
