# Token Type Templates

Layer 2 TokenDefinitionArtifacts must use one template file from this folder.

Each token type has its own file named `<token-type>.md`.

Each file defines four things:

- `outputGeneration`: how a TokenDefinitionArtifact becomes a system token page and
  system proof module.
- `reusableCodeSeam`: what the generated/shared seam must export and who may
  consume it.
- `pageStructure`: which sections and preview renderer the token page must
  render.
- `variantSchema`: which fields each variant must carry for this token type.

The token-type template does not contain approved token values. A real Layer 2
TokenDefinitionArtifact supplies those values in its `tokenDefinitionV1.variants` array.
The generator or human implementer combines:

- this token-type template
- the shared base variant contract below
- the concrete `tokenDefinitionV1` block in the TokenDefinitionArtifact

That combined contract is enough to create:

- the page under `/design-system/<system-key>/tokens/<pageKey>`
- the page file under `src/frontend/designSystem/systems/<system-key>/tokens/<pageKey>/`
- the reusable system proof module under `src/frontend/designSystem/systems/<system-key>/tokens/proofs/`
- the shared renderer call that turns variants into preview cards, metadata,
  use-case instructions, restrictions, and evidence sections

Do not invent a new token type in an artifact. Add or revise a token-type file
first when a new token type is genuinely needed.

## Shared Variant Contract

Every token type inherits this base shape:

```json
{
  "schema": "kanbien.designSystem.tokenTypeBaseVariantContract.v1",
  "baseRequiredFields": [
    "id",
    "tokenName",
    "value",
    "preview",
    "metadata",
    "useCaseInstructions"
  ],
  "previewRequiredFields": [
    "kind",
    "sample",
    "background",
    "foreground"
  ],
  "metadataRequiredFields": [
    "role",
    "theme",
    "state",
    "accessibility"
  ],
  "useCaseInstructionRequiredFields": [
    "allowedUse",
    "forbiddenUse"
  ]
}
```

## Current Token Type Files

- `background-color.md`
- `border-color.md`
- `border-radius.md`
- `border-width.md`
- `breakpoint.md`
- `color-palette.md`
- `container-width.md`
- `density.md`
- `disabled-state.md`
- `elevation-shadow.md`
- `error-state.md`
- `focus-ring.md`
- `font-size.md`
- `font-weight.md`
- `gap.md`
- `icon-size.md`
- `letter-spacing.md`
- `line-height.md`
- `loading-state.md`
- `margin.md`
- `minimum-target-size.md`
- `motion-duration.md`
- `motion-easing.md`
- `opacity.md`
- `outline.md`
- `padding.md`
- `semantic-color.md`
- `sizing.md`
- `spacing.md`
- `success-state.md`
- `surface.md`
- `text-color.md`
- `theme.md`
- `typography-family.md`
- `warning-state.md`
- `z-index-layering.md`
