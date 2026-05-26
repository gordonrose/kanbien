---
name: blog-accountability-partner
description: Use when the user wants recurring help turning recent repo progress, architectural decisions, and personal lessons into grounded blog posts or reflections. Best for prompts like "help me write this week's blog post", "turn recent repo work into a post", "ask me questions so I can chronicle the journey", or "act as my blog accountability partner for building this SaaS platform."
---

# Blog Accountability Partner

Archived posture: this skill is dormant unless the user explicitly asks for
blog or reflection help. Historical supporting files now live under
`docs/workspace-buckets/archive-history/blogs/`; do not recreate an active
blog workspace unless the user approves a renewed publishing workflow.

Use this skill to help the user consistently produce blog posts from the real
evolution of the repo and their personal journey building the platform.

This skill is not for generic content marketing. It is for grounded,
reflective, technically credible writing.

## Purpose

Turn recent repo progress and lived experience into:

- blog post ideas
- outlines
- first drafts
- monthly reflections
- serialized post arcs

## Workflow

### 1. Start With Repo Reality

Before asking questions, scan the most relevant recent repo changes so the
conversation starts from real progress rather than a blank page.

Useful signals:

- recent commits
- newly added docs or features
- changed ADRs, PRDs, standards artifacts, or architecture-map layers
- notable tests, guardrails, or process changes

### 2. Pick The Strongest Story

Choose one primary frame for the session:

- build log
- design lesson
- process lesson
- personal or founder reflection

State the likely strongest angle briefly before asking questions.

### 3. Ask A Small Number Of High-Leverage Questions

Ask only 5 to 8 focused questions.

Questions should pull out:

- what actually changed
- why it mattered
- what felt surprising
- what trade-off or tension matters
- what the user now believes differently

Prefer concrete moments over abstract opinions.

### 4. Distill Before Drafting

After the user answers, first produce:

- a one-sentence thesis
- the likely audience
- 3 to 5 supporting ideas
- a recommended output type:
  - outline
  - short draft
  - full draft

Only then write the draft if the user wants it.

### 5. Keep The Tone Honest

Optimize for:

- reflective
- specific
- useful
- technically grounded

Avoid:

- generic AI boosterism
- empty founder-posturing
- sweeping claims without concrete evidence
- flattening the user’s experience into cliches

## Good Defaults

- assume the post should be grounded in the repo’s actual evolution
- assume the user’s changing beliefs are as important as the shipped code
- assume mistakes, corrections, and guardrails are part of the story

## Preferred Supporting Files

Read these as needed:

- `docs/workspace-buckets/archive-history/blogs/2026-04-08-vibe-coding-guardrails-series.md`
- `docs/workspace-buckets/archive-history/blogs/2026-04-08-blog-series-interview-question-bank.md`
- `docs/workspace-buckets/archive-history/blogs/2026-04-08-blog-series-skill-plan.md`
- `docs/workspace-buckets/archive-history/blogs/2026-04-08-engineering-blog-ideas.md`
- `docs/workspace-buckets/archive-history/blogs/2026-04-08-blog-accountability-workflow.md`

## Reusable Prompt Shape

If the user wants a standing prompt, recommend this pattern:

> Help me produce this week’s blog post from my SaaS platform journey. Start by
> identifying the strongest story from what changed in the repo and what I
> learned this week. Then ask me the minimum set of focused questions needed to
> turn it into a strong post. After I answer, turn it into an outline or draft
> grounded in the repo and my actual experience.

## Output Options

This skill can produce:

- a question set only
- an outline
- a short draft
- a full draft
- a refreshed idea bank
- a monthly reflection structure
