import { customElement } from "lit/decorators.js";
import { LanguageSelectorBase } from "../base/language-selector-base.js";

@customElement("ambient-language-selector")
export class AmbientLanguageSelector extends LanguageSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-language-selector": AmbientLanguageSelector;
  }
}
