import { LanguageSelectorBase } from "@core/components/language-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("ambient-language-selector")
export class AmbientLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-language-selector": AmbientLanguageSelector;
  }
}
