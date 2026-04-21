# List Detail Split Layout Mobile Header Control Posture

## Symptom

In the mobile overlay canonical, the close affordance no longer stayed in the top-right corner. It dropped into the same lower action row as `Edit` and `Share`, even though the dismissal control should remain visually anchored while the secondary actions are free to move below the header copy.

## Root Cause

The mobile overlay header treated all three controls as one undifferentiated stacked action cluster. That removed the spatial distinction between the close affordance and the secondary actions.

## Why The Loop Missed It

The mobile overlay checks covered shell layering and overlay positioning, but they did not verify the internal control posture of the mobile header.

## Prevention Added

- changed the mobile overlay header controls to a small grid that pins the close affordance to the top-right position
- allowed `Edit` and `Share` to occupy the lower row beneath the header copy block
- added a regression that checks the close control stays top-right while the secondary actions sit below the copy block
