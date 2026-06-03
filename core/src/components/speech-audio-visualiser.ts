import { html, LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-elements.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import AudioVisualiserStyles from "../styles/audio-visualiser.js";
import { normalizeToRange } from "../utils/validation.js";

@safeCustomElement("speech-audio-visualiser")
export class SpeechAudioVisualiser extends LitElement {
  @property({ type: Number })
  level: number = 0;

  @property({ type: Boolean })
  active: boolean = false;

  @property({ type: Number })
  segmentCount: number = 5;

  static styles = AudioVisualiserStyles;

  willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("level")) {
      this.level = normalizeToRange(this.level);
    }
  }

  render() {
    const activeSegments = Math.round(this.level * this.segmentCount);
    const segments = map(
      range(this.segmentCount),
      (i) =>
        html`<div class=${classMap({
          active: i < activeSegments,
          segment: true,
        })} />`,
    );

    return html`
      <div class=${classMap({
        active: this.active,
        container: true,
      })}>
        ${segments}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "speech-audio-visualiser": SpeechAudioVisualiser;
  }
}
