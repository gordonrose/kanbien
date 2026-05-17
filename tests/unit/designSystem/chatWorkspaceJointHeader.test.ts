import { describe, expect, it } from "vitest";

import {
  renderChatWorkspaceJointHeader,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceJointHeader.mjs";

const layers = [
  { key: "discovery", label: "Discovery" },
  { key: "design", label: "Design" },
  { key: "delivery", label: "Delivery" },
];

describe("chatWorkspaceJointHeader", () => {
  it("renders the collapsed build-work title and expansion action", () => {
    const html = renderChatWorkspaceJointHeader({
      workspaceExpanded: false,
      expansionEnabled: true,
      activeLayer: layers[0],
      layers,
    });

    expect(html).toContain("Layer 1");
    expect(html).toContain("Build work panel");
    expect(html).toContain("data-chat-workspace-toggle");
    expect(html).toContain("Expand workspace");
    expect(html).toContain("data-chat-workspace-close");
    expect(html).not.toContain("data-chat-workspace-layer-trigger");
  });

  it("renders the expanded layer selector and selected layer option", () => {
    const html = renderChatWorkspaceJointHeader({
      workspaceExpanded: true,
      expansionEnabled: true,
      layerDrawerOpen: true,
      activeLayer: layers[1],
      layers,
    });

    expect(html).toContain("data-chat-workspace-layer-trigger");
    expect(html).toContain("Design");
    expect(html).toContain('data-chat-workspace-layer-option="design"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain("Collapse workspace");
    expect(html).toContain("is-open");
    expect(html).not.toContain("Build work panel");
  });

  it("omits the workspace toggle when expansion is disabled", () => {
    const html = renderChatWorkspaceJointHeader({
      workspaceExpanded: false,
      expansionEnabled: false,
      activeLayer: layers[0],
      layers,
    });

    expect(html).not.toContain("data-chat-workspace-toggle");
    expect(html).toContain("data-chat-workspace-close");
  });
});
