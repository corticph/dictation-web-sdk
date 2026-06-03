import { RecordingButtonBase } from "@corti/core-web/components/recording-button-base.js";
import { errorEvent } from "@corti/core-web/utils/events.js";
import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { customElement, state } from "lit/decorators.js";
import { DEFAULT_AMBIENT_CONFIG } from "../constants.js";
import {
  ambientConfigContext,
  interactionIdContext,
  virtualModeContext,
} from "../contexts/ambient-context.js";
import {
  AmbientController,
  type AmbientStreamSessionConfig,
  type StreamAmbientMessage,
} from "../controllers/ambient-controller.js";

const interactionIdRequiredError = () =>
  new Error(
    "interactionId is required. Set interactionId on corti-ambient or ambient-root.",
  );

@customElement("ambient-recording-button")
export class AmbientRecordingButton extends RecordingButtonBase<
  AmbientStreamSessionConfig,
  StreamAmbientMessage
> {
  @consume({ context: virtualModeContext, subscribe: true })
  @state()
  override _virtualMode?: boolean;

  @consume({ context: ambientConfigContext, subscribe: true })
  @state()
  private _ambientConfig?: Corti.StreamConfig;

  @consume({ context: interactionIdContext, subscribe: true })
  @state()
  private _interactionId?: string;

  protected _socketController = new AmbientController(this);

  public override startRecording(): void {
    if (!this.#trimmedInteractionId()) {
      this.dispatchEvent(errorEvent(interactionIdRequiredError()));
      return;
    }

    super.startRecording();
  }

  public override async openConnection(): Promise<void> {
    if (!this.#trimmedInteractionId()) {
      this.dispatchEvent(errorEvent(interactionIdRequiredError()));
      return;
    }

    await super.openConnection();
  }

  protected _getConnectConfig(): AmbientStreamSessionConfig {
    const interactionId = this.#trimmedInteractionId();

    if (!interactionId) {
      throw interactionIdRequiredError();
    }

    return {
      configuration: this._ambientConfig ?? DEFAULT_AMBIENT_CONFIG,
      interactionId,
    };
  }

  #trimmedInteractionId(): string | undefined {
    return this._interactionId?.trim();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-recording-button": AmbientRecordingButton;
  }
}
