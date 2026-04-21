# Unapproved Top-Level Context-Nav IA

## Symptom

Top-level `/design-system` index pages were given new `context-nav`
destinations such as:

- `Components`
- `Canonicals`
- `Patterns`

Those destinations were added without explicit human approval of the
information architecture for those pages.

## Root Cause

The recently added page-shell rule was interpreted too mechanically:

- "every page should have a `context-nav`"

That got turned into:

- "choose some reasonable `context-nav` destinations so the page satisfies the
  rule"

That second step was not approved and should not have been inferred.

## Why The Loop Missed It

- the route tests only checked for the presence of the shell trio
- the page-shell rule did not explicitly distinguish
  component presence from IA approval
- recent feedback had already established that `context-nav` destinations must
  not be invented without checking first, but that principle was not carried
  into the new page-shell wording strongly enough

## Correction

Replaced the unapproved multi-item top-level `context-nav` menus with the safer
approved fallback:

- keep the real `context-nav`
- show only one item
- that item is the current page

## Rule Tightening

The page-shell docs now say:

- use the real shell trio on all pages
- if broader page-level `context-nav` destinations are undecided, use only the
  current page as the single approved fallback item
- do not invent placeholder or "reasonable" extra IA just to satisfy the shell
  rule

## Test Follow-Up

The route test now distinguishes:

- every page must render the shell trio
- top-level index pages without approved multi-item IA must still render the
  real `context-nav` in the single-current-page fallback state
