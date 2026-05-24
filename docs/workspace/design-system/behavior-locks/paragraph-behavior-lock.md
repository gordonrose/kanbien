# Paragraph Behavior Lock

## Scope

`Paragraph` is the reusable typography token seam for paragraph and label-scale
text.

## Behavior Contract

- `PAR-001`: Paragraph token definitions are rendered from
  `tokenParagraphModel.mjs`.
- `PAR-002`: `paragraph.main` uses the approved main paragraph size, line
  height, weight, and normal ink.
- `PAR-003`: `paragraph.mainLarge` and `paragraph.mainExtraLarge` provide larger
  paragraph emphasis without becoming headers.
- `PAR-004`: `paragraph.mainMinor` provides the approved smaller supporting
  paragraph scale.
- `PAR-005`: `paragraph.label` uses uppercase compact label treatment.
- `PAR-006`: Normal, dark, and desert ink variants are shown for every paragraph
  definition.
- `PAR-007`: Warning, success, and error ink variants are shown for paragraph
  definitions where status text is approved.
- `PAR-008`: Paragraph token previews must expose token name, size, line height,
  weight, and ink variables.
- `PAR-009`: Paragraph tokens do not define layout, card anatomy, or heading
  hierarchy.

## Adoption Rule

App text that matches these paragraph roles must consume the paragraph token
class or equivalent semantic variable instead of route-local font styling.
