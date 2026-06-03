import { customElement } from "lit/decorators.js";
import { DeviceSelectorBase } from "../base/device-selector-base.js";

@customElement("ambient-device-selector")
export class AmbientDeviceSelector extends DeviceSelectorBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-device-selector": AmbientDeviceSelector;
  }
}
