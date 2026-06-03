import { customElement } from "lit/decorators.js";
import { KeybindingInputBase } from "../base/keybinding-input-base.js";

@customElement("ambient-keybinding-input")
export class AmbientKeybindingInput extends KeybindingInputBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-keybinding-input": AmbientKeybindingInput;
  }
}
