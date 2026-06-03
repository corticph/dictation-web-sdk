import { customElement } from "lit/decorators.js";
import { KeybindingInputBase } from "../base/keybinding-input-base.js";

@customElement("dictation-keybinding-input")
export class DictationKeybindingInput extends KeybindingInputBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-input": DictationKeybindingInput;
  }
}
