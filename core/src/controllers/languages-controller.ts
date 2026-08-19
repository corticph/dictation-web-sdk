import { type Corti, type CortiAuth, CortiClient } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { errorEvent, languagesChangedEvent } from "../utils/events.js";
import {
  getLanguagesByRegion,
  getPreferredDefaultLanguage,
  languageCodesFromList,
} from "../utils/languages.js";

interface LanguagesControllerHost extends ReactiveControllerHost {
  localName: string;
  region?: string;
  tenantName?: string;
  dispatchEvent(event: CustomEvent): boolean;
  requestUpdate(): void;
  _accessToken?: string;
  _analytics?: Record<string, string>;
  _authConfig?: CortiAuth.AuthTokenDerivable;
  _languages?: Corti.TranscribeSupportedLanguage[];
  _selectedLanguage?: Corti.TranscribeSupportedLanguage;
}

/**
 * Controller that manages automatic language loading.
 * Prefers GET /languages when auth is available. Falls back to the region list
 * only when the request is skipped (no auth) or fails. An empty API list is kept.
 */
export class LanguagesController implements ReactiveController {
  host: LanguagesControllerHost;
  #autoLoadedLanguages: boolean = false;
  #loadingLanguages: boolean = false;
  #previousRegion?: string;
  #initialized: boolean = false;

  constructor(host: LanguagesControllerHost) {
    this.host = host;
    host.addController(this);
  }

  initialize(): void {
    this.#initialized = true;

    if (this.host._languages === undefined) {
      this.#loadLanguages();
    }
  }

  hostUpdate(): void {
    // Only react to updates after initialization
    if (!this.#initialized) {
      return;
    }

    // When region changes, reload languages if they were auto-loaded
    if (
      (this.#previousRegion !== this.host.region &&
        this.#autoLoadedLanguages) ||
      this.host._languages === undefined
    ) {
      this.#loadLanguages();
    }

    this.#previousRegion = this.host.region;
  }

  async #loadLanguages(): Promise<void> {
    if (this.#loadingLanguages) {
      return;
    }

    this.#loadingLanguages = true;

    try {
      let languages: Corti.TranscribeSupportedLanguage[] | undefined;

      try {
        languages = await this.#languagesFromApi();
      } catch (error) {
        this.host.dispatchEvent(
          errorEvent(
            `Failed to load languages from API, using region defaults: ${
              error instanceof Error ? error.message : String(error)
            }`,
          ),
        );
      }

      languages ??= getLanguagesByRegion(this.host.region).languages;

      this.#autoLoadedLanguages = true;
      this.host._languages = languages;

      const previousLanguage = this.host._selectedLanguage;
      const selectedLanguage =
        previousLanguage && languages.includes(previousLanguage)
          ? previousLanguage
          : getPreferredDefaultLanguage(languages);

      this.host._selectedLanguage = selectedLanguage;
      this.host.requestUpdate();
      this.host.dispatchEvent(
        languagesChangedEvent(languages, selectedLanguage),
      );
    } catch (error) {
      this.host.dispatchEvent(errorEvent(error));
    } finally {
      this.#loadingLanguages = false;
    }
  }

  async #languagesFromApi(): Promise<
    Corti.TranscribeSupportedLanguage[] | undefined
  > {
    if (!this.host._authConfig && !this.host._accessToken) {
      return;
    }

    const endpoint = this.#languagesListEndpoint();

    if (!endpoint) {
      return;
    }

    const auth: CortiAuth.AuthTokenDerivable = this.host._authConfig || {
      accessToken: this.host._accessToken || "",
      refreshAccessToken: () => ({
        accessToken: this.host._accessToken || "",
      }),
    };

    const client = new CortiClient({
      analytics: this.host._analytics,
      auth,
      environment: this.host.region,
      tenantName: this.host.tenantName,
    });

    const result = await client.languages.list({ endpoint });

    return languageCodesFromList(result.languages);
  }

  #languagesListEndpoint(): Corti.LanguagesListRequestEndpoint | undefined {
    if (this.host.localName === "ambient-root") {
      return "streams";
    }

    if (this.host.localName === "dictation-root") {
      return "transcribe";
    }

    return undefined;
  }

  /**
   * Clear the auto-loaded flag (when languages are set externally)
   */
  clearAutoLoadedFlag(): void {
    this.#autoLoadedLanguages = false;
  }
}
