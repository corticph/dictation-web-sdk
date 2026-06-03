import { LanguageSelectorBase } from "@core/components/language-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("ambient-language-selector")
export class AmbientLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-language-selector": AmbientLanguageSelector;
  }
}
