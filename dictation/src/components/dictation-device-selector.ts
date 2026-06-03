import { DeviceSelectorBase } from "@core/components/device-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("dictation-device-selector")
export class DictationDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-device-selector": DictationDeviceSelector;
  }
}
