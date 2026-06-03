import { DeviceSelectorBase } from "@corti/core-web/components/device-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("dictation-device-selector")
export class DictationDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-device-selector": DictationDeviceSelector;
  }
}
