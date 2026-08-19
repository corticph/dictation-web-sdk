import { analyticsContext } from "@core/contexts/mixins/analytics-context.js";
import { RootContext } from "@core/contexts/root-context.js";
import { speechAnalytics } from "@core/utils/analytics.js";
import { safeCustomElement } from "@core/utils/custom-elements.js";
import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import type { PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { WEB_COMPONENT_NAME, WEB_COMPONENT_VERSION } from "../version.js";

export const dictationConfigContext = createContext<
  Corti.TranscribeConfig | undefined
>(Symbol("dictationConfig"));
export const debugDisplayAudioContext = createContext<boolean | undefined>(
  Symbol("debugDisplayAudio"),
);
@safeCustomElement("dictation-root")
export class DictationRoot extends RootContext {
  @provide({ context: analyticsContext })
  @state()
  _analytics = speechAnalytics(WEB_COMPONENT_NAME, WEB_COMPONENT_VERSION);
  // ─────────────────────────────────────────────────────────────────────────────
  // Properties
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Published package version. `0.0.0-dev` in local builds.
   */
  get version(): string {
    return WEB_COMPONENT_VERSION;
  }

  @provide({ context: dictationConfigContext })
  @property({ attribute: false, type: Object })
  dictationConfig?: Corti.TranscribeConfig;

  @provide({ context: debugDisplayAudioContext })
  @property({ attribute: "debug-display-audio", type: Boolean })
  debug_displayAudio?: boolean;

  // ─────────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────────

  constructor() {
    super();

    this.addEventListener("languages-changed", (e: Event) => {
      const event = e as CustomEvent;
      const selectedLanguage = event.detail.selectedLanguage as
        | Corti.TranscribeSupportedLanguage
        | undefined;

      this.dictationConfig = {
        ...this.dictationConfig,
        primaryLanguage: selectedLanguage ?? "en",
      };
    });
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("analytics")) {
      this._analytics = speechAnalytics(
        WEB_COMPONENT_NAME,
        WEB_COMPONENT_VERSION,
        this.analytics,
      );
    }

    if (!changedProperties.has("dictationConfig")) {
      return;
    }

    this._selectedLanguage = this.dictationConfig?.primaryLanguage;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-root": DictationRoot;
  }
}
