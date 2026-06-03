import { customElement } from "lit/decorators.js";
import { LanguageSelectorBase } from "../base/language-selector-base.js";

@customElement("dictation-language-selector")
export class DictationLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-language-selector": DictationLanguageSelector;
  }
}
