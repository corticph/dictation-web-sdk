import { LitElement, html, css} from 'lit-element';
import { property, customElement } from 'lit/decorators.js';

@customElement('audio-visualiser')
export class AudioVisualiser extends LitElement {
  @property({ type: Number }) level = 0; // expects a value from 0 to 100
  @property({ type: Boolean }) active = true;

  static styles = css`
  :host {
    height: 100%;
  }
    .container {
      display: flex;
      width: 8px;
      flex-direction: column-reverse; /* Bottom-up stacking */
      height: 100%;
      gap: 1px;
      opacity: 0.5;
      &.active {
       opacity: 1 
      }
    }
    .segment {
      flex: 1;
      background-color: var(--action-accent-text-color);
      transition: background-color 0.25s;
      border-radius: 1px;
      opacity: 0.5;
    }
    .segment.active {
      opacity: 1;
    }
  `;

  render() {
    // Each segment represents 20%. Using Math.ceil to fill segments optimistically.
    const activeSegments = Math.round(this.level * 5);
    const segments = [];
    for (let i = 0; i < 5; i++) {
      segments.push(html`
        <div class="segment ${i < activeSegments ? 'active' : ''}"></div>
      `);
    }
    return html`
      <div class="container ${this.active ? 'active' : ''}">
        ${segments}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'audio-visualiser': AudioVisualiser;
  }
}
