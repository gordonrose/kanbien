import { renderTokenSpecPage } from "../../../../shared/renderers/renderTokenSpecPage.mjs";
import { linkTextStyleTokenSpec } from "../proofs/linkTextStyle.tokens.mjs";

const root = document.querySelector("[data-token-spec-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Token spec page root not found.");
}

renderTokenSpecPage(root, linkTextStyleTokenSpec);
