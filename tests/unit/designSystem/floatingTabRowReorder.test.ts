import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("floatingTabRowReorder", () => {
  it("keeps row-reorder mechanics in the extracted controller seam", () => {
    const headerSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabHeader.mjs"),
      "utf8",
    );
    const reorderSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabRowReorder.mjs"),
      "utf8",
    );

    expect(headerSource).toContain("createFloatingTabRowReorderController");
    expect(headerSource).not.toContain("function ensureListDropMarker");
    expect(headerSource).not.toContain("function clearListDropMarker");
    expect(headerSource).not.toContain("list.addEventListener(\"dragstart\"");
    expect(headerSource).toContain("createFloatingTabStatusDropController");

    expect(reorderSource).toContain("createDragPreview");
    expect(reorderSource).toContain("createDropMarker");
    expect(reorderSource).toContain("label: \"Drop here\"");
    expect(reorderSource).toContain("dataTransfer?.setData(\"application/x-floating-tab-row\"");
    expect(reorderSource).toContain("dropMarker.contains(event.target)");
    expect(reorderSource).toContain("dataset.dropTarget");
    expect(reorderSource).toContain("onRowsReordered");
  });
});
