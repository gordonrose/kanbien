import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("floatingTabStatusDrop", () => {
  it("keeps status-drop targeting and row movement in the status-drop seam", () => {
    const headerSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabHeader.mjs"),
      "utf8",
    );
    const statusDropSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabStatusDrop.mjs"),
      "utf8",
    );

    expect(headerSource).toContain("createFloatingTabStatusDropController");
    expect(headerSource).toContain("moveFloatingTabRowToStatus");
    expect(headerSource).not.toContain("header.addEventListener(\"dragover\"");
    expect(headerSource).not.toContain("header.addEventListener(\"drop\"");

    expect(statusDropSource).toContain("clearFloatingTabStatusDropTargets");
    expect(statusDropSource).toContain("moveFloatingTabRowToStatus");
    expect(statusDropSource).toContain("createFloatingTabStatusDropController");
    expect(statusDropSource).toContain("dataset.floatingTabDropTarget = \"status\"");
    expect(statusDropSource).toContain("setTabCount(activeLabel, -1)");
    expect(statusDropSource).toContain("setTabCount(targetLabel, 1)");
    expect(statusDropSource).toContain("categoryRows[targetLabel].push");
    expect(statusDropSource).toContain("onMoved");
  });
});
