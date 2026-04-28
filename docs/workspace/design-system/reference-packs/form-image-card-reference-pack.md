# Form Image Card Reference Pack

## Scope

`FormImageCard` is reviewed as a child seam inside the signed-off
`Form Template` parent.

Current review surface:

- `/design-system/components/form-image-card`
- `/design-system/canonical-renderings/form-image-card`
- `/design-system/templates/form`

## Reference Set

| ID | Route | Circumstance | Purpose | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `FICR-HOST-001` | `/design-system/templates/form` | Desktop parent form baseline | Proves the square thumbnail, text stack, and image edit affordance compose inside the parent form grid. | covered-by-test | The test verifies left media / right copy ordering, square media geometry, and hidden edit affordance at rest. |
| `FICR-HOST-002` | `/design-system/templates/form` | Pointer hover over image slot | Proves the edit action appears over the image target rather than elsewhere in the card. | covered-by-test | The test hovers the media slot and checks visible edit affordance. |
| `FICR-HOST-003` | `/design-system/templates/form` | Keyboard focus on edit action | Proves the hover-only affordance remains reachable for keyboard users. | covered-by-test | The test focuses the edit button and checks the affordance remains visible. |
| `FICR-HOST-004` | `/design-system/templates/form?mobile=true` | Constrained parent form review | Proves each variant stays readable without horizontal overflow. | covered-by-test | The test compares every card box to the viewport width and verifies square media geometry. |
| `FICR-HOST-005` | `/design-system/templates/form` | Image-only variant | Proves a picture-only card renders the media affordance without an empty copy column. | covered-by-test | The test checks the image-only variant has no `.form-image-card-copy` node. |
| `FICR-HOST-006` | `/design-system/templates/form` | Name-only variant | Proves a compact identity card can render a name next to the square image without secondary metadata. | covered-by-test | The test checks the name-only variant contains the name and omits email-style metadata. |
| `FICR-HOST-007` | `/design-system/templates/form` | Full identity variant | Proves the full card can render name, email, and job title next to the square image. | covered-by-test | The test checks all three identity text lines are present. |
| `FICR-CAN-000` | `/design-system/canonical-renderings/form-image-card` | Dedicated canonical launcher | Proves the reusable child seam has a launcher that targets dedicated render routes. | covered-by-test | The test checks launcher hrefs use `/design-system/canonical-renderings/form-image-card/<ref>`. |
| `FICR-001` | `/design-system/canonical-renderings/form-image-card/FICR-001` | Dedicated image-only render | Proves the picture-only state renders through `renderFormImageCard()` on the component surface. | covered-by-test | The test checks the generated route surface, variant, square media, and absence of copy. |
| `FICR-002` | `/design-system/canonical-renderings/form-image-card/FICR-002` | Dedicated name-only render | Proves the name-only state renders through `renderFormImageCard()` on the component surface. | covered-by-test | The test checks the generated route surface, name copy, square media, and metadata omission. |
| `FICR-003` | `/design-system/canonical-renderings/form-image-card/FICR-003` | Dedicated full identity render | Proves the name/email/job-title state renders through `renderFormImageCard()` on the component surface. | covered-by-test | The test checks all full identity lines and image-scoped edit affordance behavior. |
| `FICR-004` | `/design-system/canonical-renderings/form-image-card/FICR-004` | Mobile dedicated render | Proves the full identity card stays bounded in the dedicated mobile review lane. | covered-by-test | The test checks viewport containment and square media in the narrow canonical lane. |
| `FICR-005` | `/design-system/canonical-renderings/form-image-card/FICR-005` | RTL dedicated render | Proves direction is scoped to the specimen and the card remains readable in RTL. | covered-by-test | The test checks the preview shell direction and rendered card. |
| `FICR-006` | `/design-system/canonical-renderings/form-image-card/FICR-006` | Dark-theme dedicated render | Proves theme is scoped to the specimen frame and keeps text readable. | covered-by-test | The test checks `data-theme-scope="dark"` and rendered full identity content. |
| `FICR-007` | `/design-system/canonical-renderings/form-image-card/FICR-007` | Magnified dedicated render | Proves magnification is scoped to the specimen shell and the card remains bounded. | covered-by-test | The test checks `--ui-scale` and square media geometry. |

## Adoption Boundary

This reference pack does not approve backend asset behavior, upload transport,
image processing, crop tools, public delivery, or durable alt-text semantics.
Those decisions belong to the consuming feature and any required asset-consumer
decision record.

## Sign-Off

- Reference pack reviewed:
  2026-04-28
- Status:
  approved for the reusable `FormImageCard` child seam
