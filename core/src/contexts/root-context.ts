import { type CSSResultGroup, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import ComponentStyles from "../styles/component-styles.js";
import { AuthContextMixin } from "./mixins/auth-context.js";
import { DevicesContextMixin } from "./mixins/devices-context.js";
import { KeybindingsContextMixin } from "./mixins/keybindings-context.js";
import { LanguagesContextMixin } from "./mixins/languages-context.js";
import { ProxyContextMixin } from "./mixins/proxy-context.js";
import { RecordingStateContextMixin } from "./mixins/recording-state-context.js";

export class RootContext extends DevicesContextMixin(
  RecordingStateContextMixin(
    KeybindingsContextMixin(
      LanguagesContextMixin(AuthContextMixin(ProxyContextMixin(LitElement))),
    ),
  ),
) {
  @property({ type: Boolean })
  noWrapper: boolean = false;

  /**
   * Extra keys on `x-corti-analytics`. `web_component` and
   * `web_component_version` are reserved by the component.
   */
  @property({ attribute: false, type: Object })
  analytics?: Record<string, string>;

  static styles: CSSResultGroup = [ComponentStyles];

  render() {
    if (this.noWrapper) {
      return html`<slot></slot>`;
    }

    return html`<div class="wrapper">
      <slot></slot>
    </div>`;
  }
}
