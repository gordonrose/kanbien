import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getChatWorkspaceEntityItemCount,
  getChatWorkspaceStatusItems,
  toChatWorkspaceEntityCategoryMetadata,
  toChatWorkspaceEntityStatusCategories,
  toChatWorkspaceEntityStatusRows,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceEntityHost.mjs";

const questions = { key: "questions", label: "Questions" };
const productDiscoveryPackage = { key: "product-discovery-package", label: "Product Discovery Package" };

type StatusCategoryTuple = [string, string, string, boolean];

interface StatusItem {
  label: string;
  count: number;
}

describe("chatWorkspaceEntityHost", () => {
  it("adapts entity statuses into floating-tab categories without duplicate labels", () => {
    const categories = toChatWorkspaceEntityStatusCategories([questions]);
    const questionCategories = categories.questions as StatusCategoryTuple[];
    const labels = questionCategories.map(([label]) => label);

    expect(labels).toEqual(["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"]);
    expect(new Set(labels).size).toBe(labels.length);
    expect(questionCategories.find(([label]) => label === "Blocked")?.[3]).toBe(true);
    expect(questionCategories.find(([label]) => label === "Queued")?.[3]).toBe(false);
  });

  it("keeps selector counts equal to status-card counts", () => {
    const statusItems = getChatWorkspaceStatusItems(productDiscoveryPackage) as StatusItem[];
    const countFromItems = statusItems.reduce((total, item) => total + item.count, 0);

    expect(statusItems.map((item) => item.label)).toEqual(["Draft", "In Refinement", "Ready for Review", "Done"]);
    expect(getChatWorkspaceEntityItemCount(productDiscoveryPackage)).toBe(countFromItems);
    expect(countFromItems).toBe(13);
  });

  it("builds list rows and category metadata for the floating tab host", () => {
    const rows = toChatWorkspaceEntityStatusRows([questions]);
    const metadata = toChatWorkspaceEntityCategoryMetadata([questions]);

    expect(metadata.questions).toEqual(["Questions", "Build entity"]);
    expect(rows.questions.Queued).toHaveLength(3);
    expect(rows.questions.Queued[0]).toEqual([
      "QU-001 - Questions queued item",
      "Queued",
      "Workspace preview",
    ]);
  });

  it("keeps floating-tab host rendering in the entity host seam", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const hostSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceEntityHost.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("renderChatWorkspaceEntityHost");
    expect(patternSource).toContain("refreshChatWorkspaceEntityHostLayout");
    expect(patternSource).not.toContain("renderFloatingTabHeader");
    expect(patternSource).not.toContain("mountFloatingTabHeader");
    expect(hostSource).toContain("renderFloatingTabHeader");
    expect(hostSource).toContain("mountFloatingTabHeader");
    expect(hostSource).toContain("chat-workspace-entity");
  });
});
