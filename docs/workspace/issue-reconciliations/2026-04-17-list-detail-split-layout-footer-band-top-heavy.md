# List Detail Split Layout Footer Band Top-Heavy

## Symptom

On `LDSL-002`, the `Previous` and `Next` footer controls still looked vertically off even after the button boxes themselves were aligned.

## Root Cause

The first fix restored shared button structure, but the split-layout preview still kept bottom panel padding outside the footer box. That meant the nav row could be centered inside the footer itself while still reading too high in the larger divider-to-panel-bottom region the eye perceives as the footer area.

## Why The Loop Missed It

The regression only checked button-to-button alignment. It did not check whether the nav row was vertically centered within the footer container, so a top-heavy footer band could still pass.

## Prevention Added

- moved the lower breathing room from panel padding into the footer so the control row centers within the full visible footer region
- tightened the regression to compare the nav row against the region from the footer divider to the panel bottom, not only the footer box
