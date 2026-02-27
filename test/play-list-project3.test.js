import { html, fixture, expect } from '@open-wc/testing';
import "../play-list-project3.js";

describe("PlayListProject3 test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <play-list-project3
        title="title"
      ></play-list-project3>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
