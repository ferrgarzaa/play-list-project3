/**
 * Copyright 2026 ferrgarzaa
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./play-list-slide.js";

export class PlayListProject3 extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-project3";
  }

  static get properties() {
    return {
      ...super.properties,
      index: { type: Number, reflect: true },
      slides: { type: Array, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          padding: var(--ddd-spacing-3, 12px);
        }

        .frame {
          border: var(--ddd-border-md, 2px solid black);
          border-radius: var(--ddd-radius-xl, 20px);
          background: white;
          padding: var(--ddd-spacing-3, 12px);
        }

        .viewport {
          overflow: hidden;
          width: 100%;
        }

        .track {
          display: flex;
          width: 100%;
          transition: transform 0.3s ease;
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-3, 12px);
        }

        .arrow {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: var(--ddd-border-sm, 1px solid black);
          background: white;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .dotsWrap {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: var(--ddd-spacing-2, 8px);
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: var(--ddd-border-sm, 1px solid black);
          background: white;
          cursor: pointer;
        }

        .dot[aria-current="true"] {
          background: black;
        }

        @media (max-width: 640px) {
          .arrow {
            width: 40px;
            height: 40px;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.index = 0;
    this.slides = [];
    this._observer = null;
  }

  firstUpdated() {
    this._syncSlides();
    this._observer = new MutationObserver(() => this._syncSlides());
    this._observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
    super.disconnectedCallback();
  }

  _syncSlides() {
    this.slides = [...this.querySelectorAll("play-list-slide")];

    if (this.slides.length === 0) {
      this.index = 0;
      return;
    }

    if (this.index < 0) this.index = 0;
    if (this.index > this.slides.length - 1) this.index = this.slides.length - 1;
  }

  _prev() {
    if (!this.slides.length) return;
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
  }

  _next() {
    if (!this.slides.length) return;
    this.index = (this.index + 1) % this.slides.length;
  }

  _goToSlide(i) {
    this.index = i;
  }

  render() {
    const translateX = `translateX(-${this.index * 100}%)`;

    return html`
      <div class="frame">
        <div class="viewport">
          <div class="track" style="transform: ${translateX};">
            <slot></slot>
          </div>
        </div>

        <div class="controls">
          <button class="arrow" @click=${this._prev} aria-label="Previous slide">
            &#8592;
          </button>

          <div class="dotsWrap">
            ${this.slides.map(
              (_, i) => html`
                <button
                  class="dot"
                  @click=${() => this._goToSlide(i)}
                  aria-label=${`Go to slide ${i + 1}`}
                  aria-current=${i === this.index ? "true" : "false"}
                ></button>
              `,
            )}
          </div>

          <button class="arrow" @click=${this._next} aria-label="Next slide">
            &#8594;
          </button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject3.tag, PlayListProject3);