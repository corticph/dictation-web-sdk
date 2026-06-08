import { KeybindingSelectorBase } from "@core/components/keybinding-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("ambient-keybinding-selector")
export class AmbientKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-keybinding-selector": AmbientKeybindingSelector;
  }
}
