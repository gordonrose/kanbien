# The Design-System Lesson I Had To Learn The Annoying Way

Draft saved from the 41-front-end harness work on May 27, 2026.

## Draft

I have been building a design-system harness for my SaaS platform with AI
assistance.

The goal sounds straightforward: define tokens, primitives, patterns, and
eventually templates so the app can be assembled from governed, reusable UI
decisions instead of one-off page code.

But this week I hit a more interesting lesson:

The hard part is not building the UI.

The hard part is making it impossible to build the UI in the wrong place.

## The Mistake

We were working toward an `entity_management_page` template. To get there
properly, we needed to build the lower layers first:

1. behavior rules
2. tokens
3. primitives
4. patterns
5. later component/template/app adoption layers

The process was supposed to prevent shortcuts. A primitive should not invent
styling. A pattern should not reinvent primitive behavior. A token should not
define component structure. A route should not become the source of truth just
because it renders something convincing.

And yet, even with those rules written down, mistakes still slipped through.

A panel header was rendered directly inside a pattern instead of being defined
as a primitive. A current-state marker appeared before its token was properly
signed. Supporting text needed a typography token. A tooltip appeared even when
text was not actually truncated. Scroll behavior was difficult to review
because the render page did not make the difference between mobile page scroll
and internal panel scroll obvious. A scrollbar skin leaked in from global CSS
even though no scrollbar token existed.

None of these were huge bugs in isolation.

That was exactly the problem.

They were small enough to feel harmless.

## The Real Failure Was Layer Drift

The first instinct is to say, "fix the CSS."

But that would miss the real issue.

The issue was that lower-layer decisions were being made by higher layers.

For example, a header inside an index navigation panel sounds like pattern
work. It appears inside a composed pattern, after all.

But the header had its own stable behavior:

- fixed height
- min and max height
- sticky top behavior
- title truncation
- add-action alignment
- separator border

That is not just pattern composition. That is a primitive contract supported
by token values.

The pattern should only say:

> I compose an index-nav panel header, a list, and optional add behavior.

It should not quietly decide what a header is.

That distinction matters because a future design system may change how the
header looks, but it must not change what the header does.

## Rendered Proof Is Not The Same As Governed Proof

Another lesson: a page rendering correctly is not enough.

A design-system proof page has to explain what it proves.

If a token depends on another token, the render page should show:

- the source token
- the source value
- the formula or mapping
- the final rendered value
- a proof-only way to change the source value and see the result

If a pattern has responsive scroll behavior, the render page should show who
owns scrolling in each mode.

If a control exists on the proof page, changing it should visibly change
something or prove that behavior is preserved under pressure.

Otherwise, the proof is decoration.

It may look like a review surface, but it is not actually helping the reviewer
catch drift.

## The Harness Had Rules, But Not Enough Friction

The frustrating part is that many of the rules already existed in the harness.

The evals said things like:

- do not skip primitives
- do not invent visual values
- do not copy route-local markup
- consume signed tokens
- use the narrowest behavior rule
- verify rendered behavior

But the process still allowed the assistant to jump into implementation
without first producing a decision ledger.

That is the missing piece.

Before implementation, every observed affordance should be classified:

| Observed decision | Owning layer | Existing seam | Action |
| --- | --- | --- | --- |
| header fixed height | token + primitive | missing | create token/primitive |
| add icon button | primitive | exists/missing | consume or create |
| scrollbar skin | token/primitive if custom | missing | browser-native or block |
| secondary list alignment | pattern | pattern seam | fix pattern layout |

This kind of ledger changes the work.

It forces the question:

> Am I solving this in the layer that owns the decision?

Without that, the harness depends too much on intent. And intent is not enough
when AI can produce plausible code quickly.

## The Bigger AI Lesson

This is one of the central lessons of building with AI.

AI is very good at making local progress. It can patch the CSS. It can add a
component. It can make the screenshot look better.

But durable progress requires knowing whether that patch belongs there at all.

The more powerful the assistant becomes, the more important the harness
becomes.

Not because the assistant is bad, but because it is fast.

Speed makes weak boundaries expensive.

If a human slowly hand-writes the wrong abstraction, they may notice the
discomfort along the way. If AI generates it instantly, the mistake arrives
fully formed and visually convincing.

That is why the design-system harness is becoming less like documentation and
more like a governance system.

It needs to stop work, not just describe work.

## What I Believe Differently Now

I used to think the layer model was mainly about organizing design-system
assets.

Tokens over here. Primitives over there. Patterns after that.

Now I think the layer model is really about controlling where decisions are
allowed to happen.

A token is not just a value. It is permission for downstream layers to use
that value.

A primitive is not just reusable markup. It is a promise that behavior and
accessibility stay stable across design systems.

A pattern is not just a composed layout. It is a contract that says which
primitives are being combined and what composition behavior belongs to the
group.

A render page is not just a preview. It is evidence.

And an eval is not just a checklist. It is supposed to be hostile enough to
catch the exact mistakes a helpful assistant would otherwise make.

## The Next Improvement

The next change to the harness is clear.

Before Layer 2, 3, or 4 implementation begins, the harness needs a required
preflight:

1. inventory the source material
2. list every observed visual, behavioral, accessibility, and interaction
   decision
3. assign each decision to a layer
4. name the owning seam if it exists
5. block if the seam is missing
6. only then implement

That is the difference between a design system that renders and a design system
that governs.

And that distinction is becoming one of the most important parts of building
this platform with AI.

The goal is not to stop AI from moving quickly.

The goal is to make sure that when it moves quickly, it moves inside
boundaries that preserve the system.
