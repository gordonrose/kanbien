import { describe, expect, it } from "vitest";
import { verifySvgIsSafe } from "../../../src/features/assets/domain/svgSanitizer";

describe("asset SVG sanitizer", () => {
  it("TC-ASSETS-UNIT-005 accepts a simple SVG logo payload", () => {
    const result = verifySvgIsSafe(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M1 1h8v8H1z"/></svg>`),
    );

    expect(result).toEqual({ ok: true });
  });

  it("TC-ASSETS-SEC-006 rejects active SVG constructs before readiness", () => {
    const cases = [
      [`<svg><script>alert(1)</script></svg>`, "script_element"],
      [`<svg><path onclick="alert(1)" d="M0 0"/></svg>`, "event_handler_attribute"],
      [`<svg><foreignObject><body>bad</body></foreignObject></svg>`, "foreign_object"],
      [`<svg><image href="https://example.test/a.png"/></svg>`, "external_or_unsafe_reference"],
      [`<svg><path fill="url(javascript:alert(1))"/></svg>`, "unsafe_url"],
      [`<!DOCTYPE svg><svg></svg>`, "doctype_or_entity"],
    ] as const;

    for (const [payload, reason] of cases) {
      expect(verifySvgIsSafe(Buffer.from(payload))).toEqual({ ok: false, reason });
    }
  });
});
