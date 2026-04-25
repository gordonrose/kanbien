export interface SvgSanitizerResult {
  ok: boolean;
  reason?: string;
}

const UNSAFE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /<\s*script[\s>]/i, reason: "script_element" },
  { pattern: /\son[a-z]+\s*=/i, reason: "event_handler_attribute" },
  { pattern: /<\s*foreignObject[\s>]/i, reason: "foreign_object" },
  { pattern: /<\s*(iframe|object|embed|html|body|link|meta)[\s>]/i, reason: "embedded_html" },
  { pattern: /(?:href|xlink:href|src)\s*=\s*["']\s*(?:https?:|\/\/|data:|javascript:)/i, reason: "external_or_unsafe_reference" },
  { pattern: /url\(\s*["']?\s*(?:https?:|\/\/|data:|javascript:)/i, reason: "unsafe_url" },
  { pattern: /@import/i, reason: "remote_import" },
  { pattern: /<\s*style[\s>][\s\S]*?(?:https?:|\/\/|@font-face|@import)/i, reason: "remote_style_or_font" },
];

export function verifySvgIsSafe(buffer: Buffer): SvgSanitizerResult {
  const text = buffer.toString("utf8");

  if (!/<\s*svg[\s>]/i.test(text)) {
    return { ok: false, reason: "missing_svg_root" };
  }

  if (/<!ENTITY/i.test(text) || /<!DOCTYPE/i.test(text)) {
    return { ok: false, reason: "doctype_or_entity" };
  }

  for (const rule of UNSAFE_PATTERNS) {
    if (rule.pattern.test(text)) {
      return { ok: false, reason: rule.reason };
    }
  }

  return { ok: true };
}
