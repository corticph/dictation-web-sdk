import { LanguageSelectorBase } from "@core/components/language-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("dictation-language-selector")
export class DictationLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-language-selector": DictationLanguageSelector;
  }
}
