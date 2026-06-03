import { consume } from "@lit/context";
import { html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  pushToTalkKeybindingContext,
  toggleToTalkKeybindingContext,
} from "../../contexts/mixins/keybindings-context.js";
import KeybindingSelectorStyles from "../../styles/keybinding-selector.js";
import "../internal/speech-keybinding-input.js";

export class KeybindingSelectorBase extends LitElement {
  @consume({ context: pushToTalkKeybindingContext, subscribe: true })
  @state()
  _pushToTalkKeybinding?: string | null;

  @consume({ context: toggleToTalkKeybindingContext, subscribe: true })
  @state()
  _toggleToTalkKeybinding?: string | null;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = KeybindingSelectorStyles;

  protected _renderKeybindingInputs(): TemplateResult {
    return html`
      <speech-keybinding-input
        keybindingType="toggle-to-talk"
        ?disabled=${this.disabled}
      ></speech-keybinding-input>
      <speech-keybinding-input
        keybindingType="push-to-talk"
        ?disabled=${this.disabled}
      ></speech-keybinding-input>
    `;
  }

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
