import { mountFloatingTabHeader, renderFloatingTabHeader } from "./floatingTabHeader.mjs";

const workspace = document.querySelector("#floating-tab-workspace");

if (workspace instanceof HTMLElement) {
  workspace.innerHTML = renderFloatingTabHeader();
  mountFloatingTabHeader({ root: workspace });
}
