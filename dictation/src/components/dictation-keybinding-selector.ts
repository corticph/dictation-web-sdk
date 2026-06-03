import { KeybindingSelectorBase } from "@corti/core-web/components/keybinding-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends KeybindingSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
