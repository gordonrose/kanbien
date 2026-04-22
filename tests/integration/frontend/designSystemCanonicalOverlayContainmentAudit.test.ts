import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
  "utf8",
);

describe("design-system canonical overlay containment audit", () => {
  it("pins date-picker and time-picker canonical mobile overlays to the local preview frame", () => {
    expect(styles).toContain(`#date-picker-preview-frame,
#time-picker-preview-frame {`);

    expect(styles).toContain(`#date-picker-preview-shell[data-form-mobile-view="true"] .form-date-menu:not(.hidden),
#date-picker-preview-shell[data-form-mobile-view="true"] .form-time-menu:not(.hidden),
#time-picker-preview-shell[data-form-mobile-view="true"] .form-time-menu:not(.hidden) {
  position: absolute !important;
  inset: 0.75rem !important;`);
  });

  it("keeps canonical mobile picker cards as local clipping containers", () => {
    expect(styles).toContain(`#date-picker-preview-shell[data-form-mobile-view="true"] .form-page-card,
#time-picker-preview-shell[data-form-mobile-view="true"] .form-page-card {
  position: relative;
  overflow: hidden;`);
  });

  it("forces canonical mobile date-picker lanes to collapse from render state instead of outer viewport width", () => {
    expect(styles).toContain(`#date-picker-preview-shell[data-form-mobile-view="true"] .form-date-jump-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));`);

    expect(styles).toContain(`#date-picker-preview-shell[data-form-mobile-view="true"] .form-date-months,
#date-picker-preview-shell[data-form-mobile-view="true"] .form-date-time-grid,
#date-picker-preview-shell[data-form-mobile-view="true"] .form-time-columns,
#time-picker-preview-shell[data-form-mobile-view="true"] .form-time-columns {
  grid-template-columns: 1fr;`);
  });
});
