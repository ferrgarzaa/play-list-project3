import { LitElement, html, css } from "lit";

export class PlayListSlide extends LitElement {
  static get tag() {
    return "play-list-slide";
  }

  static get properties() {
    return {
      topHeading: { type: String, attribute: "top-heading" },
      secondHeading: { type: String, attribute: "second-heading" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        min-width: 100%;
        box-sizing: border-box;
        padding: var(--ddd-spacing-4, 16px);
      }

      .card {
        border: var(--ddd-border-sm, 1px solid black);
        border-radius: var(--ddd-radius-lg, 16px);
        background: white;
        padding: var(--ddd-spacing-4, 16px);
        min-height: 300px;
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-2, 8px);
        box-sizing: border-box;
      }

      .top {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .second {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.2;
      }

      .content {
        margin-top: var(--ddd-spacing-2, 8px);
        flex: 1;
        overflow-y: auto;
      }
    `;
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
  }

  render() {
    return html`
      <div class="card">
        <div class="top">${this.topHeading}</div>
        <div class="second">${this.secondHeading}</div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);