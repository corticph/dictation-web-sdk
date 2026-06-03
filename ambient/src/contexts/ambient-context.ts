import { RootContext } from "@core/contexts/root-context.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";
import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import type { PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { DEFAULT_AMBIENT_CONFIG } from "../constants.js";

export const ambientConfigContext = createContext<
  Corti.StreamConfig | undefined
>(Symbol("ambientConfig"));

export const interactionIdContext = createContext<string | undefined>(
  Symbol("interactionId"),
);

export const virtualModeContext = createContext<boolean>(Symbol("virtualMode"));

@safeCustomElement("ambient-root")
export class AmbientRoot extends RootContext {
  @provide({ context: ambientConfigContext })
  @property({ attribute: false, type: Object })
  ambientConfig: Corti.StreamConfig = DEFAULT_AMBIENT_CONFIG;

  @provide({ context: interactionIdContext })
  @property({ type: String })
  interactionId?: string;

  @provide({ context: virtualModeContext })
  @property({ attribute: "virtualMode", type: Boolean })
  virtualMode: boolean = false;

  constructor() {
    super();

    this.addEventListener("virtual-mode-changed", (e: Event) => {
      const event = e as CustomEvent<{ enabled: boolean }>;
      this.virtualMode = event.detail.enabled;
      // Set multichannel transcription for virtual mode
      const base = this.ambientConfig ?? DEFAULT_AMBIENT_CONFIG;

      if (event.detail.enabled) {
        this.ambientConfig = {
          ...base,
          transcription: {
            ...base.transcription,
            isDiarization: false,
            isMultichannel: true,
            participants: [
              { channel: 0, role: "doctor" },
              { channel: 1, role: "patient" },
            ],
          },
        };
      } else {
        this.ambientConfig = {
          ...base,
          transcription: {
            ...base.transcription,
            isDiarization: true,
            isMultichannel: false,
            participants: [],
          },
        };
      }
    });

    this.addEventListener("languages-changed", (e: Event) => {
      const event = e as CustomEvent;

      const lang = (event.detail.selectedLanguage ??
        "en") as Corti.TranscribeSupportedLanguage;
      const base = this.ambientConfig ?? DEFAULT_AMBIENT_CONFIG;

      this.ambientConfig = {
        ...base,
        mode: {
          ...base.mode,
          outputLocale: lang,
        },
        transcription: {
          ...base.transcription,
          primaryLanguage: lang,
        },
      };
    });
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("ambientConfig")) {
      return;
    }

    this._selectedLanguage =
      this.ambientConfig?.transcription?.primaryLanguage ?? "en";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-root": AmbientRoot;
  }
}
