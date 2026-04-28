import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
  "utf8",
);

describe("design-system typography theme audit", () => {
  it("pins shared form-page headings to theme-owned ink tokens", () => {
    expect(styles).toContain(`.form-page-title {
  margin: 0;
  color: var(--ink);`);

    expect(styles).toContain(`.form-page-section-heading .top-nav-preview-eyebrow,
.form-page-section-heading .form-page-section-title {
  margin: 0;
  color: var(--ink-soft);`);

    expect(styles).toContain(`.form-page-section-title,
.form-choice-legend {
  margin: 0;
  color: var(--ink);`);
  });

  it("pins preview-stage headings to theme-owned ink tokens", () => {
    expect(styles).toContain(`.top-nav-preview-intro h1,
.top-nav-preview-controls h2,
.top-nav-preview-stage-header h2,
.top-nav-preview-body-card h3 {
  margin: 0;
  color: var(--ink);`);
  });

  it("pins preview eyebrows and supporting copy to the soft ink token", () => {
    expect(styles).toContain(`.top-nav-preview-eyebrow {
  margin: 0 0 0.45rem;
  color: var(--ink-soft);`);

    expect(styles).toContain(`.form-page-section-copy {
  max-width: 28rem;
  margin: 0;
  color: var(--ink-soft);`);
  });
});
