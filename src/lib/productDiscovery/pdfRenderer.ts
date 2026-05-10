import { chromium } from "@playwright/test";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function isTableSeparator(line: string): boolean {
  return /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function splitTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(lines: string[]): string {
  const rows = lines.filter((line) => !isTableSeparator(line)).map(splitTableCells);
  const [header, ...body] = rows;
  return `
    <table>
      ${header ? `<thead><tr>${header.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join("")}</tr></thead>` : ""}
      <tbody>
        ${body.map((row) => `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderMarkdownBody(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let table: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) {
      return;
    }
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushBullets() {
    if (bullets.length === 0) {
      return;
    }
    html.push(`<ul>${bullets.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
    bullets = [];
  }

  function flushTable() {
    if (table.length === 0) {
      return;
    }
    html.push(renderTable(table));
    table = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushBullets();
      flushTable();
      continue;
    }

    if (trimmed.startsWith("|")) {
      flushParagraph();
      flushBullets();
      table.push(trimmed);
      continue;
    }

    flushTable();

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushBullets();
      html.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushBullets();
      html.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();
      bullets.push(trimmed.replace(/^-\s+/, ""));
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      flushParagraph();
      bullets.push(trimmed.replace(/^-\s+/, ""));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushBullets();
  flushTable();
  return html.join("\n");
}

export function renderProductDiscoveryPacketHtml(markdown: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Product Discovery Packet</title>
    <style>
      @page {
        margin: 20mm 17mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #172033;
        font: 13px/1.5 Arial, Helvetica, sans-serif;
      }

      h1 {
        margin: 0 0 18px;
        padding-bottom: 12px;
        border-bottom: 2px solid #0f766e;
        color: #0f172a;
        font-size: 24px;
        line-height: 1.2;
      }

      h2 {
        break-after: avoid;
        margin: 22px 0 8px;
        color: #0f766e;
        font-size: 16px;
        line-height: 1.25;
      }

      p {
        margin: 0 0 8px;
      }

      ul {
        margin: 0 0 10px 18px;
        padding: 0;
      }

      li {
        margin: 2px 0;
      }

      code {
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #f8fafc;
        color: #334155;
        padding: 1px 4px;
        font-family: "Courier New", monospace;
        font-size: 11px;
      }

      table {
        width: 100%;
        margin: 8px 0 14px;
        border-collapse: collapse;
        break-inside: avoid;
        font-size: 11px;
      }

      th,
      td {
        border: 1px solid #cbd5e1;
        padding: 6px 7px;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: #ecfdf5;
        color: #134e4a;
        font-weight: 700;
      }

      tr:nth-child(even) td {
        background: #f8fafc;
      }
    </style>
  </head>
  <body>
    ${renderMarkdownBody(markdown)}
  </body>
</html>`;
}

export async function renderProductDiscoveryPacketPdf(markdown: string): Promise<Buffer> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(renderProductDiscoveryPacketHtml(markdown), { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
