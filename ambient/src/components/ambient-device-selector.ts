import { DeviceSelectorBase } from "@core/components/device-selector-base.js";
import { customElement } from "lit/decorators.js";

@customElement("ambient-device-selector")
export class AmbientDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-device-selector": AmbientDeviceSelector;
  }
}
