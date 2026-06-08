import { DeviceSelectorBase } from "@core/components/device-selector-base.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";

@safeCustomElement("ambient-device-selector")
export class AmbientDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-device-selector": AmbientDeviceSelector;
  }
}
