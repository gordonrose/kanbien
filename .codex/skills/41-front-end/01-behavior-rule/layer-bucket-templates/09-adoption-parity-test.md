# Layer 9 Adoption Parity Test Behavior Bucket

Use this bucket when the ask is to prove app usage has not drifted from the governed seam.

## Recognition Test

The ask is meant to catch copied markup, copied controller logic, local CSS, dishonest fixtures, or visual divergence after app adoption.

## Information Needed

- Completed app adoption
- Component seam contract
- Canonical scenarios
- App route
- Served or representative data shape
- Frontend test helpers
- Likely drift shortcuts

## Things That Do Not Belong

New adoption work, new component seam behavior, demo route creation, broad unrelated frontend tests, mocks that add production-invented fallback behavior.

## Behavior Rule Output Needed

Record the parity-test ask as a later-layer dependency or next step. Name missing information as a blocker. Do not define test commands, assertions, or parity implementation inside the behavior rule.
