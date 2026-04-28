# Form Image Card Behavior Lock

## Scope

`FormImageCard` is a form-parent child seam for compact image relationship
review inside configuration forms.

Source surfaces:

- `/design-system/templates/form`
- `/design-system/assets/formControls.mjs`
- `src/frontend/designSystem/assets/styles.css`

## Locked Behavior

| ID | Rule | Rationale | Status |
| --- | --- | --- | --- |
| `FIC-BL-001` | The card must keep a stable square thumbnail slot and, when copy is present, an adjacent text stack on desktop and constrained form reviews. | Image relationships need to be scannable without turning the form into a media gallery or changing the crop contract between variants. | approved |
| `FIC-BL-002` | The media slot must support a placeholder state when no image is available. | Forms frequently start before an image has been selected or persisted. | approved |
| `FIC-BL-003` | The edit affordance must appear over the image area on hover and keyboard focus, not as a separate always-visible form action. | The image-specific action should stay attached to the image target while keeping the card compact. | approved |
| `FIC-BL-004` | The component must remain transport- and asset-policy-neutral. | Upload, read, storage, alt-text validation, scanning, and durable asset relationship semantics remain feature-owned. | approved |
| `FIC-BL-005` | The component must support three copy-density variants: image only, image plus name, and image plus name/email/job title. | Parent forms need the same media affordance for compact avatar, lightweight identity, and full identity review rows. | approved |
| `FIC-BL-006` | The image-only variant must not render an empty copy column. | A picture-only card should stay compact and avoid creating misleading blank form content. | approved |
| `FIC-BL-007` | Name, email, and job-title text must wrap inside the card without widening the parent form. | Identity metadata can contain long names or addresses and must remain readable inside constrained form layouts. | approved |

## Feature Adoption

Features may render the card with `renderFormImageCard()` for governed
form-family adoption. The component owns visual composition and the local edit
trigger location only. Feature consumers own any drawer, modal, upload, crop,
alt-text, authorization, persistence, and asset lifecycle behavior behind the
edit action.

## Sign-Off

- Behavior lock reviewed:
  2026-04-28
- Human sign-off:
  accepted in the form-template review on 2026-04-28
- Dedicated render surface:
  `/design-system/components/form-image-card`
- Canonical launcher:
  `/design-system/canonical-renderings/form-image-card`
