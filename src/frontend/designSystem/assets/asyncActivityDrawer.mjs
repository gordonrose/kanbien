function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function clampProgress(value) {
  const progress = Number(value);
  if (!Number.isFinite(progress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(progress)));
}

function formatCount(value) {
  const count = Number(value);
  if (!Number.isFinite(count)) {
    return "0";
  }
  return new Intl.NumberFormat("en-US").format(count);
}

const statusIconPaths = {
  running:
    "M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 0 0-7.75 6M6.35 17.65A7.95 7.95 0 0 0 12 20a8 8 0 0 0 7.75-6M4 10h4V6M20 14h-4v4",
  waiting: "M12 6v6l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  error: "M12 7v6M12 17h.01M21 19 12 4 3 19z",
  complete: "m5 12.5 4.2 4L19 7",
};

const utilityIconPaths = {
  retry: "M4 4v6h6M20 20v-6h-6M20 9a7 7 0 0 0-12.1-3.9L4 10M4 15a7 7 0 0 0 12.1 3.9L20 14",
  download: "M12 4v9m0 0 3.5-3.5M12 13 8.5 9.5M5 19h14",
};

export const asyncActivityDrawerDemoJobs = [
  {
    id: "tenant-record-import-running",
    state: "running",
    title: "Import tenant records",
    kicker: "Queued 09:42",
    progress: 62,
  },
  {
    id: "role-matrix-waiting",
    state: "waiting",
    title: "Generate role matrix",
    kicker: "Queued 09:44",
    progress: 18,
  },
  {
    id: "customer-segments-error",
    state: "error",
    title: "Sync customer segments",
    kicker: "Error 09:48",
    progress: 46,
    errorDetail: "Network timeout",
    retry: {
      label: "Retry sync customer segments",
    },
  },
  {
    id: "tenant-record-import-complete",
    state: "complete",
    title: "Tenant record import",
    kicker: "Completed 09:51",
    result: {
      successful: 1204,
      failed: 7,
    },
    report: {
      href: "data:text/csv;charset=utf-8,status,count%0Asuccessful,1204%0Afailed,7%0A",
      download: "tenant-record-import-results.csv",
      label: "Download tenant record import results CSV",
    },
  },
];

export const asyncActivityDrawerCanonicalRefs = [
  {
    ref: "AADR-001",
    title: "Mixed shell queue",
    jobs: asyncActivityDrawerDemoJobs,
    note: "Shows running, waiting, retryable error, and completed report states together.",
  },
  {
    ref: "AADR-002",
    title: "Running job",
    jobs: [asyncActivityDrawerDemoJobs[0]],
    note: "Confirms active progress presentation and running status semantics.",
  },
  {
    ref: "AADR-003",
    title: "Waiting job",
    jobs: [asyncActivityDrawerDemoJobs[1]],
    note: "Confirms queued work remains visible without implying completion.",
  },
  {
    ref: "AADR-004",
    title: "Retryable error",
    jobs: [asyncActivityDrawerDemoJobs[2]],
    note: "Confirms stopped progress, error detail, and retry affordance.",
  },
  {
    ref: "AADR-005",
    title: "Complete with report",
    jobs: [asyncActivityDrawerDemoJobs[3]],
    note: "Confirms successful and failed result counts plus optional CSV report download.",
  },
];

export function getAsyncActivityDrawerCanonicalRef(refId = "AADR-001") {
  return asyncActivityDrawerCanonicalRefs.find((entry) => entry.ref === refId) ?? asyncActivityDrawerCanonicalRefs[0];
}

function normalizeJob(job) {
  const state = ["running", "waiting", "error", "complete"].includes(job?.state) ? job.state : "waiting";
  return {
    id: String(job?.id ?? `${state}-${job?.title ?? "job"}`),
    state,
    title: String(job?.title ?? "Background job"),
    kicker: String(job?.kicker ?? state),
    progress: clampProgress(job?.progress),
    errorDetail: String(job?.errorDetail ?? ""),
    retry: job?.retry ?? null,
    result: job?.result ?? null,
    report: job?.report ?? null,
  };
}

function renderSvg(path) {
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${escapeHtml(path)}" /></svg>`;
}

function renderProgress(job) {
  const label = job.state === "error"
    ? `${job.title} stopped at ${job.progress} percent`
    : `${job.title} ${job.progress} percent complete`;
  const className = job.state === "error" ? "async-job-progress async-job-progress-error" : "async-job-progress";
  return `
    <div class="${className}" aria-label="${escapeHtml(label)}">
      <span style="width: ${job.progress}%"></span>
    </div>
  `;
}

function renderErrorDetail(job) {
  if (job.state !== "error") {
    return "";
  }

  const retryLabel = job.retry?.label ?? `Retry ${job.title.toLowerCase()}`;
  return `
    <div class="async-job-error-row">
      <span class="async-job-result-icon async-job-result-icon-failed" role="img" aria-label="Error detail">
        ${renderSvg("M12 8v5M12 16h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z")}
      </span>
      <span class="async-job-error-detail">${escapeHtml(job.errorDetail || "Retryable error")}</span>
    </div>
    <button
      class="async-job-retry tooltip-anchor"
      type="button"
      data-tooltip="Retry job"
      data-async-activity-retry="${escapeHtml(job.id)}"
      aria-label="${escapeHtml(retryLabel)}"
    >
      <span class="icon-button-glyph" aria-hidden="true">${renderSvg(utilityIconPaths.retry)}</span>
    </button>
  `;
}

function renderResult(job) {
  if (job.state !== "complete") {
    return "";
  }

  const successful = formatCount(job.result?.successful);
  const failed = formatCount(job.result?.failed);
  const report = job.report;
  const reportMarkup = report?.href
    ? `
      <a
        class="async-job-download tooltip-anchor"
        data-tooltip="Download report"
        data-async-activity-report="${escapeHtml(job.id)}"
        href="${escapeHtml(report.href)}"
        download="${escapeHtml(report.download ?? "async-activity-report.csv")}"
        aria-label="${escapeHtml(report.label ?? `Download ${job.title} report`)}"
      >
        <span class="icon-button-glyph" aria-hidden="true">${renderSvg(utilityIconPaths.download)}</span>
      </a>
    `
    : "";

  return `
    <div class="async-job-result-grid" aria-label="${escapeHtml(job.title)} results">
      <div class="async-job-result tooltip-anchor" data-tooltip="Successful records" tabindex="0">
        <span class="async-job-result-icon async-job-result-icon-success" role="img" aria-label="Successful records">
          ${renderSvg(statusIconPaths.complete)}
        </span>
        <span class="async-job-result-value">${successful}</span>
      </div>
      <div class="async-job-result async-job-result-failed tooltip-anchor" data-tooltip="Failed records" tabindex="0">
        <span class="async-job-result-icon async-job-result-icon-failed" role="img" aria-label="Failed records">
          ${renderSvg(statusIconPaths.error)}
        </span>
        <span class="async-job-result-value">${failed}</span>
      </div>
    </div>
    ${reportMarkup}
  `;
}

function renderJobCard(jobInput) {
  const job = normalizeJob(jobInput);
  const statusLabel = job.state.charAt(0).toUpperCase() + job.state.slice(1);
  const cardClasses = [
    "async-job-card",
    job.state === "error" ? "async-job-card-error" : "",
    job.state === "complete" ? "async-job-card-complete" : "",
  ].filter(Boolean).join(" ");
  const statusClasses = [
    "async-job-status",
    job.state !== "running" ? `async-job-status-${job.state}` : "",
    "tooltip-anchor",
  ].filter(Boolean).join(" ");

  return `
    <article class="${cardClasses}" role="listitem" data-async-activity-job="${escapeHtml(job.id)}" data-async-activity-state="${escapeHtml(job.state)}">
      <div class="async-job-card-header">
        <div>
          <p class="async-job-kicker">${escapeHtml(job.kicker)}</p>
          <h3>${escapeHtml(job.title)}</h3>
        </div>
        <span class="${statusClasses}" data-tooltip="${escapeHtml(statusLabel)}" role="img" aria-label="${escapeHtml(statusLabel)}" tabindex="0">
          ${renderSvg(statusIconPaths[job.state])}
        </span>
      </div>
      ${job.state === "complete" ? "" : renderProgress(job)}
      ${renderErrorDetail(job)}
      ${renderResult(job)}
    </article>
  `;
}

export function renderAsyncActivityDrawer(root, { jobs = asyncActivityDrawerDemoJobs, title = "Background Jobs" } = {}) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  root.classList.add("side-panel", "async-activity-drawer");
  root.setAttribute("aria-labelledby", "async-activity-title");
  root.innerHTML = `
    <div class="side-panel-header">
      <div>
        <p class="drawer-eyebrow">Activity</p>
        <h2 id="async-activity-title">${escapeHtml(title)}</h2>
      </div>
      <button
        id="async-activity-close"
        class="icon-button"
        type="button"
        data-async-activity-close
        aria-label="Close background jobs"
      >
        <span class="icon-button-glyph" aria-hidden="true">${renderSvg("M6 6 18 18M18 6 6 18")}</span>
      </button>
    </div>
    <div class="async-job-list" role="list" aria-label="Background job progress">
      ${jobs.map((job) => renderJobCard(job)).join("")}
    </div>
  `;
  root.dataset.asyncActivityDrawerMounted = "true";
  return root;
}

export function createAsyncActivityDrawerController(
  root,
  {
    launcher,
    jobs = asyncActivityDrawerDemoJobs,
    title,
    initiallyOpen = false,
    onRetry,
    onReport,
  } = {},
) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  renderAsyncActivityDrawer(root, { jobs, title });

  const closeButton = root.querySelector("[data-async-activity-close]");
  let returnFocusTarget = null;

  function setOpen(open, { restoreFocus = true } = {}) {
    launcher?.setAttribute("aria-expanded", String(open));
    root.classList.toggle("hidden", !open);
    root.setAttribute("aria-hidden", String(!open));

    if (open) {
      returnFocusTarget = launcher instanceof HTMLElement ? launcher : null;
      window.requestAnimationFrame(() => {
        closeButton?.focus();
      });
      return;
    }

    if (restoreFocus && returnFocusTarget instanceof HTMLElement) {
      returnFocusTarget.focus();
    }
  }

  function isOpen() {
    return launcher?.getAttribute("aria-expanded") === "true" || !root.classList.contains("hidden");
  }

  closeButton?.addEventListener("click", () => setOpen(false));

  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const retryButton = target?.closest("[data-async-activity-retry]");
    const reportLink = target?.closest("[data-async-activity-report]");

    if (retryButton instanceof HTMLElement && typeof onRetry === "function") {
      onRetry(retryButton.dataset.asyncActivityRetry ?? "");
    }

    if (reportLink instanceof HTMLElement && typeof onReport === "function") {
      onReport(reportLink.dataset.asyncActivityReport ?? "");
    }
  });

  setOpen(initiallyOpen, { restoreFocus: false });

  return {
    isOpen,
    render(nextJobs = jobs) {
      renderAsyncActivityDrawer(root, { jobs: nextJobs, title });
    },
    setOpen,
  };
}
