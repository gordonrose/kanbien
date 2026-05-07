import { createKanbanColumnController } from "./kanbanColumnSeam.mjs";

const controller = createKanbanColumnController({
  managerHost: document.getElementById("kanban-column-manager-field"),
  board: document.getElementById("kanban-board"),
  archiveCallout: document.getElementById("kanban-archive-callout"),
  archiveDismiss: document.getElementById("kanban-archive-dismiss"),
  liveRegion: document.getElementById("kanban-live-region"),
  workspace: document.querySelector(".kanban-workspace"),
  strainButtons: Array.from(document.querySelectorAll("[data-kanban-strain]")),
});

controller.initialize();
