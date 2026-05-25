# Primitive Layer

## What It Is For

The primitive layer defines the smallest reusable structural or behavioral building block needed by the UI family.

A primitive may be a button, icon button, tooltip, panel shell, field row, menu trigger, drawer shell, or similar low-level piece.

Primitives consume tokens but must not invent product-specific composition.

## Input

The input is a signed or accepted behavior rule, any existing primitive inventory, and the signed token decisions the primitive must consume.

The layer also needs the target primitive name, the state set it must support, and the consumers or patterns that are expected to need it.

## Output

The output is a primitive definition with a narrow responsibility, allowed states, required accessibility behavior, and public consumption boundary.

If implementation is in scope later, the primitive should expose a small public seam rather than asking consumers to copy markup.

## Evaluation For 99% No-Rework Confidence

Check that the primitive is smaller than a pattern and does not contain product workflow logic.

Check that it consumes existing signed tokens instead of hard-coding visual decisions.

Check that any missing required token blocks primitive work and routes back to the token layer.

Check that it has a named public boundary.

Check that it defines state and accessibility behavior without relying on demo-page examples.

Check that consumers cannot reasonably mistake the primitive for a page-local helper.
