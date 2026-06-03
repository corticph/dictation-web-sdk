import { customElement } from "lit/decorators.js";
import { DeviceSelectorBase } from "../base/device-selector-base.js";

@customElement("dictation-device-selector")
export class DictationDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-device-selector": DictationDeviceSelector;
  }
}
