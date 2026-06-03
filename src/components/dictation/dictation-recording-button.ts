import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import type { TemplateResult } from "lit";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { DEFAULT_DICTATION_CONFIG } from "../../constants.js";
import { dictationConfigContext } from "../../contexts/dictation-context.js";
import {
  DictationController,
  type TranscribeMessage,
} from "../../controllers/dictation-controller.js";
import { RecordingButtonBase } from "../base/recording-button-base.js";

import "./dictation-audio-visualiser.js";

@customElement("dictation-recording-button")
export class DictationRecordingButton extends RecordingButtonBase<
  Corti.TranscribeConfig,
  TranscribeMessage
> {
  protected _renderAudioVisualiser(isRecording: boolean): TemplateResult {
    return html`<dictation-audio-visualiser
      .level=${this._audioLevel}
      ?active=${isRecording}
    ></dictation-audio-visualiser>`;
  }

  @consume({ context: dictationConfigContext, subscribe: true })
  @state()
  protected _dictationConfig?: Corti.TranscribeConfig;

  protected _socketController = new DictationController(this);

  protected _getConnectConfig(): Corti.TranscribeConfig {
    return this._dictationConfig ?? DEFAULT_DICTATION_CONFIG;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-recording-button": DictationRecordingButton;
  }
}
