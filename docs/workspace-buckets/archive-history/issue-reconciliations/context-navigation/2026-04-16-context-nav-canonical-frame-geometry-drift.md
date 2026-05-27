# Context-Nav Canonical Frame Geometry Drift

## Symptom

The `/design-system/components/context-nav` canonical render page showed two
linked visual defects inside the render frame:

- the embedded `top-nav` and `sub-nav` did not respond to the frame width using
  their governed behaviors
- the `context-nav` rail and preview content rendered behind the bottom of the
  embedded header stack instead of starting below it

## Root Cause

The canonical frame was not using the real header families honestly.

- the embedded `top-nav` was only a styled copy block with the `.top-nav` class
- the embedded `sub-nav` markup lacked the governed overflow and compact
  behavior seams
- the rail/content offset logic was still driven by the outer page shell rather
  than by the embedded preview shell's own header stack

## Why The Loop Missed It

- route tests only verified that `top-nav`, `sub-nav`, and `context-nav`
  existed on the page
- earlier checks did not inspect the inner canonical frame geometry
- the preview shell looked close enough at a glance to hide the fact that it
  was not the real families running inside the frame

## Correction

The canonical frame now uses actual `top-nav` and `sub-nav` primitives inside
the preview shell, and the rail/content top offset is measured from the inner
header stack instead of the outer page shell.

Browser-backed coverage was added so the canonical frame must prove that:

- the rail and content start below the embedded header stack
- a narrow preview width forces the embedded header into its mobile behavior
