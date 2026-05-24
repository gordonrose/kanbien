# Primitive Layer

## What It Is For

The primitive layer defines the smallest reusable structural or behavioral building block needed by the UI family.

A primitive may be a button, icon button, tooltip, panel shell, field row, menu trigger, drawer shell, or similar low-level piece.

Primitives consume tokens but must not invent product-specific composition.

## Input

The input is a signed or accepted behavior rule and any existing primitive inventory.

The layer also needs the target primitive name, the state set it must support, and the consumers or patterns that are expected to need it.

## Output

The output is a primitive definition with a narrow responsibility, allowed states, required accessibility behavior, and public consumption boundary.

If implementation is in scope later, the primitive should expose a small public seam rather than asking consumers to copy markup.

## Evaluation For 99% No-Rework Confidence

Check that the primitive is smaller than a pattern and does not contain product workflow logic.

Check that it consumes existing tokens or declares the need for a token instead of hard-coding visual decisions.

Check that it has a named public boundary.

Check that it defines state and accessibility behavior without relying on demo-page examples.

Check that consumers cannot reasonably mistake the primitive for a page-local helper.

