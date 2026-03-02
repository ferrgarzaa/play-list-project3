/**
 * Copyright 2026 ferrgarzaa
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

class PlayListArrow extends LitElement {
  static get properties() {
    return {
      direction: { type: String },
      label: { type: String },
      disabled: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return css`
      button {
        padding: 5px 10px;
        border: 1px solid black;
        background: white;
        cursor: pointer;
      }
      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
  }

  constructor() {
    super();
    this.direction = "left";
    this.label = "Arrow";
    this.disabled = false;
  }

  render() {
    const symbol = this.direction === "right" ? ">" : "<";
    return html`<button ?disabled=${this.disabled} aria-label=${this.label}>${symbol}</button>`;
  }
}
customElements.define("play-list-arrow", PlayListArrow);

class PlayListDots extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
      activeIndex: { type: Number, attribute: "active-index" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
      button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid black;
        margin: 0 5px;
        background: white;
        cursor: pointer;
      }
      button[aria-current="true"] {
        background: black;
      }
    `;
  }

  constructor() {
    super();
    this.count = 0;
    this.activeIndex = 0;
  }

  _dotClick(i) {
    const ev = new CustomEvent("play-list-index-changed", {
      bubbles: true,
      composed: true,
      detail: { index: i },
    });
    this.dispatchEvent(ev);
  }

  render() {
    const dots = [];
    for (let i = 0; i < this.count; i++) {
      const isActive = i === this.activeIndex;
      dots.push(html`
        <button
          @click=${() => this._dotClick(i)}
          aria-label=${`Go to slide ${i + 1}`}
          aria-current=${isActive ? "true" : "false"}
        ></button>
      `);
    }
    return html`${dots}`;
  }
}
customElements.define("play-list-dots", PlayListDots);

class PlayListSlide extends LitElement {
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
        padding: 20px;
        box-sizing: border-box;
      }

      .card {
        border: 1px solid black;
        padding: 15px;
      }

      .top {
        font-weight: bold;
      }

      .second {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .content {
        margin-top: 10px;
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
customElements.define("play-list-slide", PlayListSlide);

export class PlayListProject3 extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-project3";
  }

  static get properties() {
    return {
      ...super.properties,
      index: { type: Number, reflect: true },
      _count: { type: Number, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: 10px;
        }

        .frame {
          border: 1px solid black;
          background: white;
        }

        .track {
          display: flex;
          transition: transform 0.2s;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .dotsWrap {
          flex: 1;
          text-align: center;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.index = 0;
    this._count = 0;
  }

  firstUpdated() {
    this._syncSlides();
    const observer = new MutationObserver(() => this._syncSlides());
    observer.observe(this, { childList: true });
    this._observer = observer;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) this._observer.disconnect();
  }

  _syncSlides() {
    const slides = this.querySelectorAll("play-list-slide");
    this._count = slides.length;

    if (this._count > 0) {
      if (this.index < 0) this.index = 0;
      if (this.index > this._count - 1) this.index = this._count - 1;
    } else {
      this.index = 0;
    }
    this.requestUpdate();
  }

  _prev() {
    if (this._count === 0) return;
    this.index = (this.index - 1 + this._count) % this._count;
  }

  _next() {
    if (this._count === 0) return;
    this.index = (this.index + 1) % this._count;
  }

  _onDotChange(e) {
    const newIndex = Number(e.detail.index);
    if (!Number.isNaN(newIndex)) this.index = newIndex;
  }

  render() {
    const translateX = `translateX(-${this.index * 100}%)`;
    return html`
      <div class="frame">
        <div class="track" style="transform:${translateX}">
          <slot></slot>
        </div>

        <div class="controls" @play-list-index-changed=${this._onDotChange}>
          <play-list-arrow direction="left" label="Previous slide" @click=${this._prev}></play-list-arrow>

          <div class="dotsWrap">
            <play-list-dots .count=${this._count} .activeIndex=${this.index}></play-list-dots>
          </div>

          <play-list-arrow direction="right" label="Next slide" @click=${this._next}></play-list-arrow>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject3.tag, PlayListProject3);