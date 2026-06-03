import { LanguageSelectorBase } from "@corti/core-web/components/language-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("dictation-language-selector")
export class DictationLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-language-selector": DictationLanguageSelector;
  }
}
