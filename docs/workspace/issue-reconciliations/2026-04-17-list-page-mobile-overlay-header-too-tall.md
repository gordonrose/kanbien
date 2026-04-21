# List Page Mobile Overlay Header Too Tall

## Symptom

When the `List Page` template collapsed into its mobile overlay drawer posture, the header consumed far too much vertical space. The close affordance dropped into the same lower action flow as `Edit` and `Share`, which made the header feel stretched and wasteful.

## Root Cause

The parent template still used the older generic mobile detail-header rule that stacked the entire header vertically. Even after the signed-off `ListDetailSplitLayout` canonical got the improved mobile posture, the parent `List Page` route had not been brought into parity.

## Why The Loop Missed It

The parent mobile checks covered focus trapping, layering, and overlay semantics, but they did not verify the internal posture of the mobile drawer header itself.

## Prevention Added

- updated the parent mobile drawer header to match the signed-off compact posture
- pinned the close affordance to the top-right corner while allowing `Edit` and `Share` to sit below the copy block
- added a parent-level regression that checks this mobile header geometry directly
