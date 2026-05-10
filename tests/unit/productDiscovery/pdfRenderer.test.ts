import { describe, expect, it } from "vitest";
import {
  renderProductDiscoveryPacketHtml,
  renderProductDiscoveryPacketPdf,
} from "../../../src/lib/productDiscovery/pdfRenderer";

describe("Product Discovery PDF renderer", () => {
  it("renders packet markdown into structured HTML before PDF generation", () => {
    const html = renderProductDiscoveryPacketHtml(`# Product Discovery Packet: Example

## Status

- Discovery status:
  \`ready-for-technical-steering\`

| Actor | Outcome |
| --- | --- |
| Root builder | Download packet |
`);

    expect(html).toContain("<h1>Product Discovery Packet: Example</h1>");
    expect(html).toContain("<h2>Status</h2>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<code>ready-for-technical-steering</code>");
    expect(html).toContain("<table>");
    expect(html).toContain("<th>Actor</th>");
    expect(html).not.toContain("# Product Discovery Packet");
    expect(html).not.toContain("| --- |");
  });

  it("prints the rendered packet HTML to valid PDF bytes", async () => {
    const pdf = await renderProductDiscoveryPacketPdf(`# Product Discovery Packet: Example

## Status

- Discovery status:
  \`ready-for-technical-steering\`

## Product Intent

The requester needs a readable packet export.
`);
    const pdfHeader = pdf.subarray(0, 8).toString("utf8");
    const pdfText = pdf.toString("latin1");

    expect(pdfHeader).toBe("%PDF-1.4");
    expect(pdf.length).toBeGreaterThan(5_000);
    expect(pdfText).toContain("/Type /Catalog");
    expect(pdfText).toContain("%%EOF");
  });
});
