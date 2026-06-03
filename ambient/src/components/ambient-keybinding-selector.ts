import { KeybindingSelectorBase } from "@corti/core-web/components/keybinding-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("ambient-keybinding-selector")
export class AmbientKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-keybinding-selector": AmbientKeybindingSelector;
  }
}
