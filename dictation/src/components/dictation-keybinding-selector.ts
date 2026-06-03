import { KeybindingSelectorBase } from "@core/components/keybinding-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
