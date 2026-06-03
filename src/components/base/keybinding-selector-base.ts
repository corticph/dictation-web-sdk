import { consume } from "@lit/context";
import { html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  pushToTalkKeybindingContext,
  toggleToTalkKeybindingContext,
} from "../../contexts/mixins/keybindings-context.js";
import KeybindingSelectorStyles from "../../styles/keybinding-selector.js";

export abstract class KeybindingSelectorBase extends LitElement {
  protected abstract _renderKeybindingInputs(): TemplateResult;

  @consume({ context: pushToTalkKeybindingContext, subscribe: true })
  @state()
  _pushToTalkKeybinding?: string | null;

  @consume({ context: toggleToTalkKeybindingContext, subscribe: true })
  @state()
  _toggleToTalkKeybinding?: string | null;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = KeybindingSelectorStyles;

  render() {
    return html`
      <div class="settings-group">
        ${this._renderKeybindingInputs()}
        ${
          (this._toggleToTalkKeybinding || this._pushToTalkKeybinding) &&
          html`<p class="keybinding-help">
            ${html`Press ${[this._toggleToTalkKeybinding, this._pushToTalkKeybinding].join(" or ")} to start/stop recording`}
          </p>`
        }
      </div>
    `;
  }
}
