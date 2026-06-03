import { customElement } from "lit/decorators.js";
import { AudioVisualiserBase } from "../base/audio-visualiser-base.js";

@customElement("dictation-audio-visualiser")
export class DictationAudioVisualiser extends AudioVisualiserBase {}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-audio-visualiser": DictationAudioVisualiser;
  }
}
