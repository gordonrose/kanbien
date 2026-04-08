import type { RedactionRule, SanitizedContent } from "./types";

export function sanitizeNotificationContent(input: {
  subject: string;
  bodyText: string;
  redactions?: RedactionRule[];
}): SanitizedContent {
  let sanitizedBodyText = input.bodyText;
  let containsRedactedVerificationLink = false;
  let containsRedactedResetLink = false;

  for (const redaction of input.redactions ?? []) {
    if (!redaction.rawValue) {
      continue;
    }
    sanitizedBodyText = sanitizedBodyText.split(redaction.rawValue).join(redaction.placeholder);
    if (redaction.placeholder === "[VERIFICATION LINK]") {
      containsRedactedVerificationLink = true;
    }
    if (redaction.placeholder === "[RESET LINK]") {
      containsRedactedResetLink = true;
    }
  }

  return {
    subject: input.subject.trim(),
    bodyText: sanitizedBodyText.trim(),
    containsRedactedVerificationLink,
    containsRedactedResetLink,
  };
}
