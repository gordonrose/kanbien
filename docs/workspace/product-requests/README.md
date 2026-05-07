# Product Requests

This directory holds workspace Product Requests.

A Product Request is a thin parent summary for a requested body of work. It
links Product Discovery, Technical Steering, Story Breakdown, Task Breakdown,
Loop Runs, evidence, and PRs without replacing those artifacts.

Use `docs/templates/product-request-template.md` when creating a new Product
Request. New requests should use the folder shape by default.

Requests use folders when the work needs a clear end-to-end hierarchy:

```text
docs/workspace/product-requests/<request-slug>/
  request.md
  discovery.md
  steering.md
  epics/
    EPIC-001-<epic-slug>/
      epic.md
      stories/
        S-001-<story-slug>/
          story.md
          task-breakdown.md
          tasks/
            T-S001-01-<task-slug>.md
```

Keep each layer honest: the folder shows containment, but each artifact still
owns its normal decisions and validation gates.

Folder requests must include an `## Epic Index` in `request.md`. The index is
the human summary of the request's epics, and the validator checks that every
listed epic exists and every `epics/EPIC-*` folder is listed.

Validate the whole workspace with:

```sh
npm run product-request:validate -- --all
```
