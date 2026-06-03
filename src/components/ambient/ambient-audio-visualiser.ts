import { customElement } from "lit/decorators.js";
import { AudioVisualiserBase } from "../base/audio-visualiser-base.js";

@customElement("ambient-audio-visualiser")
export class AmbientAudioVisualiser extends AudioVisualiserBase {}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-audio-visualiser": AmbientAudioVisualiser;
  }
}
