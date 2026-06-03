import { customElement } from "lit/decorators.js";
import { KeybindingSelectorBase } from "../base/keybinding-selector-base.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
