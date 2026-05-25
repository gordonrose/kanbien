# WCAG 2.2 AA Default

WCAG 2.2 Level AA compliance is a non-negotiable default for every governed front-end harness output.

The baseline source is the W3C "How to Meet WCAG (Quick Reference)" for WCAG 2.2:

- https://www.w3.org/WAI/WCAG22/quickref/

This repo policy summarizes how that baseline applies to `41-front-end` harness work.

It is not a replacement for the W3C standard.

When this policy and the W3C source disagree, use the W3C source as the tie-breaker.

## Default Rule

A front-end layer may not pass if it introduces, preserves, or defers a WCAG 2.2 A or AA violation without an explicit approved exception.

The layer that introduces an accessibility-relevant decision owns the proof for that decision.

Later layers own preservation of that proof.

The app must not break accessibility by wrapping, restyling, reordering, hiding, or partially reimplementing a governed seam.

## Required WCAG 2.2 A And AA Coverage Areas

Every governed front-end artifact must account for the applicable WCAG 2.2 A and AA success criteria in these areas.

### Perceivable

Non-text content must have equivalent text alternatives unless it is truly decorative.

Audio, video, captions, audio descriptions, and media alternatives must be handled when media is introduced.

Information, relationships, sequence, and instructions must not depend only on visual layout.

Content must support portrait and landscape unless a specific orientation is essential.

Input purpose must be identifiable where user data collection applies.

Color must not be the only way information, state, or action is communicated.

Text and meaningful visual elements must meet the required contrast expectations.

Text must resize and reflow without loss of content or function.

Images of text are not allowed for normal UI text.

Text spacing changes must not break content or functionality.

Hover and focus content must be dismissible, hoverable, and persistent when the success criterion applies.

### Operable

All functionality must be available from a keyboard unless the underlying action cannot be performed by keyboard.

Keyboard focus must not become trapped.

Character key shortcuts must be avoidable, remappable, or active only on focus when the success criterion applies.

Time limits, auto-updating content, moving content, and interruptions must provide the required controls.

Content must not flash in a way that violates seizure and physical reaction criteria.

Interaction-triggered animation must respect reduced-motion expectations where the success criterion applies.

Pages and major surfaces must support bypass, title, focus order, link purpose, headings, labels, and visible focus.

Focused controls must not be obscured at the minimum WCAG 2.2 AA level.

Pointer gestures must have non-path alternatives when required.

Pointer cancellation must be safe.

Visible labels and accessible names must agree where label-in-name applies.

Motion actuation must have a non-motion alternative when required.

Dragging movements must have a non-dragging alternative when required.

Targets must meet WCAG 2.2 AA minimum target-size requirements or a valid exception.

### Understandable

The page language must be declared.

Changes on focus or input must not create unexpected context changes.

Repeated navigation and repeated components must remain consistent.

Help mechanisms must be consistent when they exist across pages.

Errors must be identified in text.

Inputs must have labels or instructions.

Error suggestions must be provided when known and safe.

Legal, financial, data-modifying, and other covered submissions must include the required error-prevention behavior.

Previously entered information must not be required again when redundant entry applies, unless an exception is valid.

Authentication flows must not depend on cognitive-function tests unless an allowed alternative exists.

### Robust

Names, roles, and values must be programmatically determinable for controls and stateful UI.

Status messages must be programmatically determinable without moving focus when the success criterion applies.

Use semantic HTML before ARIA where semantic HTML can express the behavior.

ARIA must not be used to hide broken semantics or invent behavior that is not implemented.

## Layer Ownership Defaults

The behavior-rule layer owns the plain-language accessibility promise for the UI family.

The token layer owns contrast, focus visibility, color-independent meaning, text sizing, spacing effects, and motion defaults introduced by tokens.

The primitive layer owns roles, keyboard operation, focus behavior, accessible names, disabled behavior, and target-size expectations for primitives, while consuming signed token decisions.

The pattern-contract layer owns structure, landmarks, headings, slots, field relationships, state announcements, error handling, and accessibility responsibilities across composed pieces.

The component-seam layer owns making the accessible path the default API.

The demo-page layer owns honest rendered examples that use the actual seam.

The canonical-scenarios layer owns stable coverage for accessibility-risk states and dimensions.

The first-app-adoption layer owns preserving accessibility when real app data and route context consume the seam.

The adoption-parity-test layer owns hostile checks against app drift from the accessible seam.

The artifact-index-update layer owns recording accessibility evidence and approved exceptions.

## Evidence Defaults

Accessibility evidence should identify the criteria or coverage areas being tested.

Evidence should distinguish automated checks from manual review.

Automated checks may include axe, semantic queries, keyboard traversal, focus-visible checks, contrast tooling, and DOM-state assertions.

Manual review is still required for meaningful names, understandable instructions, logical focus order, usable error recovery, content meaning, and cases tooling cannot prove.

Evidence must use representative data and must not rely on convenience mocks that hide production accessibility risk.
