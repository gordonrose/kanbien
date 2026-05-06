# Product Requests

This directory holds workspace Product Request cover sheets.

A Product Request is a thin parent summary for a requested body of work. It
links Product Discovery, Technical Steering, Story Breakdown, Task Breakdown,
Loop Runs, evidence, and PRs without replacing those artifacts.

Use `docs/templates/product-request-template.md` when creating a new Product
Request.

Requests may also be organized as folders when the work needs a clear
end-to-end hierarchy:

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
