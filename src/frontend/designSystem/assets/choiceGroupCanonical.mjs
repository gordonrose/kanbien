const previewFrame = document.getElementById("choice-group-preview-frame");
const previewShell = document.getElementById("choice-group-preview-shell");
const canonicalMatchList = document.getElementById("choice-group-canonical-match-list");
const canonicalCircumstances = document.getElementById("choice-group-canonical-circumstances");
const canonicalSummary = document.getElementById("choice-group-preview-summary");
const canonicalCurrent = document.getElementById("choice-group-canonical-current");
const canonicalPrev = document.getElementById("choice-group-canonical-prev");
const canonicalNext = document.getElementById("choice-group-canonical-next");
const canonicalMetaState = document.getElementById("choice-group-meta-state");
const canonicalMetaViewport = document.getElementById("choice-group-meta-viewport");
const canonicalMetaNotes = document.getElementById("choice-group-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const launcherLink = document.querySelector('a[href="/design-system/canonicals/choice-group"]');

const baseGroupCopy = {
  radio: {
    legend: "Radio buttons",
    error: "Choose a delivery mode.",
    rows: [
      {
        title: "Scheduled",
        body: "Launch on the chosen date and keep timing predictable.",
      },
      {
        title: "Manual release",
        body: "Prepare everything now and publish after a final review.",
      },
    ],
  },
  checkbox: {
    legend: "Checkboxes",
    error: "Select at least one channel.",
    rows: [
      {
        title: "Email digest",
        body: "Primary outbound summary for admins and owners.",
      },
      {
        title: "In-app banner",
        body: "Reinforces the message once users land in the workspace.",
      },
      {
        title: "SMS escalation",
        body: "Reserved for urgent reminders and exceptions only.",
      },
    ],
  },
  shared: {
    legend: "Checkboxes with shared statement",
    statementTitle: "Before publishing this campaign, confirm the release checklist items below.",
    statementBody: "These boxes sit beneath one shared statement instead of repeating the whole sentence per option.",
    error: "Check all required acknowledgement items before publishing.",
    rows: [
      {
        title: "Copy approved",
        body: "Marketing and support have signed off the final message.",
      },
      {
        title: "Fallback path verified",
        body: "Rollback and pause instructions are visible to the release owner.",
      },
      {
        title: "Analytics ready",
        body: "Open, click, and conversion dashboards are prepared for launch review.",
      },
    ],
  },
};

const longCopyOverride = {
  radio: {
    rows: [
      {
        title: "Scheduled rollout with monitored launch window and customer-readiness sequencing",
        body: "Launch on the chosen date, keep timing predictable across regions, and preserve a deliberate review window for support staffing, comms monitoring, and rapid rollback coordination if early signal quality degrades.",
      },
      {
        title: "Manual release with final operator checkpoint and release-owner signoff",
        body: "Prepare everything now, hold the publish action until the final release review is complete, and keep the operator-visible fallback instructions readable without collapsing the control-to-copy relationship.",
      },
    ],
  },
  checkbox: {
    rows: [
      {
        title: "Email digest for workspace administrators and accountable rollout owners",
        body: "Primary outbound summary for admins and owners, including the staged release summary, escalation path, and the short operational reminders needed during the first 24 hours after launch.",
      },
      {
        title: "In-app banner with clear tenant-facing follow-up context and support handoff copy",
        body: "Reinforces the message once users land in the workspace and keeps the context readable even when the supporting description runs longer than the baseline component copy.",
      },
      {
        title: "SMS escalation reserved for exception workflows and narrow urgent reminders",
        body: "Reserved for urgent reminders, exceptions, and carefully scoped incidents where the smaller control column must still stay aligned with a much longer explanatory description.",
      },
    ],
  },
  shared: {
    statementTitle: "Before publishing this campaign, confirm the release checklist items below and keep the release-owner acknowledgement readable even when the lead statement grows beyond the compact baseline example.",
    statementBody: "These boxes still sit beneath one shared statement, but this stress state intentionally lengthens both the lead copy and row descriptions so narrow mobile review can catch wrapping or alignment regressions.",
    rows: [
      {
        title: "Copy approved by marketing, support, and the tenant-education review lane",
        body: "Marketing and support have signed off the final message, the support macros are updated, and the tenant-facing announcement remains readable without clipping on smaller widths.",
      },
      {
        title: "Fallback and pause path verified with operator-visible recovery instructions",
        body: "Rollback and pause instructions are visible to the release owner, and the supporting description stays wrapped cleanly instead of colliding with the checkbox column.",
      },
      {
        title: "Analytics and launch review dashboards ready for same-day follow-up",
        body: "Open, click, conversion, and acknowledgement dashboards are prepared for launch review, and the longer descriptive copy still reads as one coherent row.",
      },
    ],
  },
};

const localizedArabicOverride = {
  radio: {
    legend: "أزرار الاختيار",
    error: "اختر وضع الإرسال.",
    rows: [
      {
        title: "إرسال مجدول",
        body: "ابدأ في التاريخ المحدد مع إبقاء توقيت الإطلاق واضحاً ويمكن مراجعته.",
      },
      {
        title: "إصدار يدوي",
        body: "جهز كل شيء الآن ثم انشر بعد اكتمال المراجعة النهائية لفريق الإطلاق.",
      },
    ],
  },
  checkbox: {
    legend: "مربعات الاختيار",
    error: "اختر قناة واحدة على الأقل.",
    rows: [
      {
        title: "ملخص البريد الإلكتروني",
        body: "الملخص الرئيسي للمشرفين ومالكي الإطلاق داخل مساحة العمل.",
      },
      {
        title: "لافتة داخل التطبيق",
        body: "تعزز الرسالة بعد وصول المستخدمين إلى مساحة العمل وتحافظ على وضوح السياق.",
      },
      {
        title: "تصعيد الرسائل النصية",
        body: "مخصص للتنبيهات العاجلة والاستثناءات فقط.",
      },
    ],
  },
  shared: {
    legend: "مربعات اختيار مع بيان مشترك",
    statementTitle: "قبل نشر هذه الحملة، أكد عناصر قائمة التحقق التالية الخاصة بالإطلاق.",
    statementBody: "تظهر هذه المربعات تحت بيان مشترك واحد بدلاً من تكرار الجملة نفسها داخل كل صف.",
    error: "أكمل جميع عناصر الإقرار المطلوبة قبل النشر.",
    rows: [
      {
        title: "اعتماد النسخة",
        body: "وافق فريقا التسويق والدعم على الرسالة النهائية.",
      },
      {
        title: "التحقق من مسار التراجع",
        body: "تعليمات الإيقاف أو التراجع ظاهرة بوضوح لمالك الإطلاق.",
      },
      {
        title: "التحليلات جاهزة",
        body: "لوحات المتابعة الخاصة بالفتح والنقر والتحويل جاهزة لمراجعة يوم الإطلاق.",
      },
    ],
  },
};

const statePayloads = {
  "radio-baseline": {
    visibleGroups: ["radio"],
    errorMode: false,
    mobile: false,
    stateLabel: "Radio-group baseline",
    note: "Single-select grouped-choice review isolates the fieldset shell, legend, and row anatomy without the rest of the parent page.",
  },
  "checkbox-baseline": {
    visibleGroups: ["checkbox"],
    errorMode: false,
    mobile: false,
    stateLabel: "Standard checkbox-group baseline",
    note: "Multi-select grouped-choice review keeps the same child shell without flattening it into unrelated standalone boxes.",
  },
  "shared-statement": {
    visibleGroups: ["shared"],
    errorMode: false,
    mobile: false,
    stateLabel: "Shared-statement checkbox baseline",
    note: "The lead statement remains distinct from the row stack while the child seam avoids treating host-wide grid span as its API.",
  },
  "error-review": {
    visibleGroups: ["radio", "checkbox", "shared"],
    errorMode: true,
    mobile: false,
    stateLabel: "Inline group-error review",
    note: "All grouped-choice variants surface local inline errors at the fieldset boundary rather than shifting validation elsewhere.",
  },
  "dark-errors": {
    visibleGroups: ["radio", "checkbox", "shared"],
    errorMode: true,
    mobile: false,
    stateLabel: "Dark-theme grouped-choice readability review",
    note: "Dark theme keeps legend, statement, row, and error surfaces distinct while the child seam remains reviewable in one place.",
  },
  "rtl-review": {
    visibleGroups: ["radio", "checkbox", "shared"],
    errorMode: false,
    mobile: false,
    stateLabel: "RTL grouped-choice row mirroring review",
    note: "Directionality is scoped to the child render so control placement and row scanning can be reviewed without flipping the entire shell.",
  },
  "long-copy-mobile": {
    visibleGroups: ["radio", "checkbox", "shared"],
    errorMode: false,
    mobile: true,
    copyOverride: longCopyOverride,
    stateLabel: "Narrow mobile long-copy wrapping review",
    note: "Long labels and descriptions deliberately stress the row structure on narrow mobile review to catch overlap or clipping before sign-off.",
  },
  "localized-rtl-mobile": {
    visibleGroups: ["radio", "checkbox", "shared"],
    errorMode: false,
    mobile: true,
    copyOverride: localizedArabicOverride,
    stateLabel: "Localized Arabic RTL grouped-choice review",
    note: "Localized Arabic copy and RTL placement are reviewed directly on the child surface rather than inferred from the parent route.",
  },
};

const canonicalStates = [
  {
    refId: "CGR-001",
    label: "Radio-group baseline",
    route: "/design-system/components/choice-group?ref=CGR-001&width=520&state=radio-baseline&theme=normal&dir=ltr&zoom=0",
    width: 520,
    state: "radio-baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
  },
  {
    refId: "CGR-002",
    label: "Standard checkbox-group baseline",
    route: "/design-system/components/choice-group?ref=CGR-002&width=520&state=checkbox-baseline&theme=normal&dir=ltr&zoom=0",
    width: 520,
    state: "checkbox-baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
  },
  {
    refId: "CGR-003",
    label: "Shared-statement checkbox baseline",
    route: "/design-system/components/choice-group?ref=CGR-003&width=720&state=shared-statement&theme=normal&dir=ltr&zoom=0",
    width: 720,
    state: "shared-statement",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Expanded field lane",
  },
  {
    refId: "CGR-004",
    label: "Inline group-error review for all grouped-choice variants",
    route: "/design-system/components/choice-group?ref=CGR-004&width=940&state=error-review&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "error-review",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-group review lane",
  },
  {
    refId: "CGR-006",
    label: "Dark-theme grouped-choice readability review",
    route: "/design-system/components/choice-group?ref=CGR-006&width=940&state=dark-errors&theme=dark&dir=ltr&zoom=0",
    width: 940,
    state: "dark-errors",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Three-group review lane",
  },
  {
    refId: "CGR-007",
    label: "RTL grouped-choice row mirroring review",
    route: "/design-system/components/choice-group?ref=CGR-007&width=940&state=rtl-review&theme=normal&dir=rtl&zoom=0",
    width: 940,
    state: "rtl-review",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-group review lane",
  },
  {
    refId: "CGR-010",
    label: "Narrow mobile long-copy wrapping review",
    route: "/design-system/components/choice-group?ref=CGR-010&width=390&state=long-copy-mobile&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "long-copy-mobile",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile stress lane",
  },
  {
    refId: "CGR-011",
    label: "Localized Arabic RTL grouped-choice review",
    route: "/design-system/components/choice-group?ref=CGR-011&width=390&state=localized-rtl-mobile&theme=normal&dir=rtl&zoom=0",
    width: 390,
    state: "localized-rtl-mobile",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile RTL stress lane",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedChoiceGroupReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/choice-group\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedChoiceGroupRoute() {
  return getGeneratedChoiceGroupReferenceId() !== null;
}

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(360, Math.min(parsed, 1180));
}

function normalizeDir(value) {
  return value === "rtl" ? "rtl" : "ltr";
}

function normalizeZoom(value) {
  return value === "100" ? 100 : 0;
}

function normalizeTheme(value) {
  return value === "dark" || value === "desert" ? value : "normal";
}

function getGroup(groupKey) {
  if (!(previewShell instanceof HTMLElement)) {
    return null;
  }

  return previewShell.querySelector(`[data-choice-group-key="${groupKey}"]`);
}

function mergeGroupCopy(groupKey, override = {}) {
  const base = baseGroupCopy[groupKey];
  return {
    ...base,
    ...override,
    rows: override.rows ?? base.rows,
  };
}

function applyGroupCopy(groupNode, content) {
  if (!(groupNode instanceof HTMLElement)) {
    return;
  }

  const legend = groupNode.querySelector(".form-choice-legend");
  const error = groupNode.querySelector(".form-group-error");
  const rows = Array.from(groupNode.querySelectorAll(".form-choice-row"));

  if (legend instanceof HTMLElement) {
    legend.textContent = content.legend;
  }

  if (error instanceof HTMLElement) {
    error.textContent = content.error;
  }

  const statement = groupNode.querySelector(".form-choice-statement");
  if (statement instanceof HTMLElement) {
    const statementTitle = statement.querySelector("strong");
    const statementBody = statement.querySelector("span");

    if (statementTitle instanceof HTMLElement) {
      statementTitle.textContent = content.statementTitle ?? "";
    }

    if (statementBody instanceof HTMLElement) {
      statementBody.textContent = content.statementBody ?? "";
    }
  }

  rows.forEach((row, index) => {
    const title = row.querySelector("strong");
    const body = row.querySelector("span span");
    const rowContent = content.rows[index];

    if (!(rowContent && title instanceof HTMLElement && body instanceof HTMLElement)) {
      return;
    }

    title.textContent = rowContent.title;
    body.textContent = rowContent.body;
  });
}

function resetCopy(override = {}) {
  for (const groupKey of ["radio", "checkbox", "shared"]) {
    const groupNode = getGroup(groupKey);
    const groupCopy = mergeGroupCopy(groupKey, override[groupKey]);
    applyGroupCopy(groupNode, groupCopy);
  }
}

function setVisibleGroups(visibleGroups) {
  if (previewShell instanceof HTMLElement) {
    previewShell.dataset.visibleGroupCount = String(visibleGroups.length);
  }

  for (const groupKey of ["radio", "checkbox", "shared"]) {
    const groupNode = getGroup(groupKey);
    if (groupNode instanceof HTMLElement) {
      groupNode.classList.toggle("hidden", !visibleGroups.includes(groupKey));
    }
  }
}

function updateStepper(currentIndex) {
  if (!(canonicalCurrent instanceof HTMLElement) || !(canonicalPrev instanceof HTMLAnchorElement) || !(canonicalNext instanceof HTMLAnchorElement)) {
    return;
  }

  const currentState = canonicalStates[currentIndex];
  const previousState = canonicalStates[currentIndex - 1];
  const nextState = canonicalStates[currentIndex + 1];

  canonicalCurrent.textContent = `${currentState.refId} - ${currentState.label}`;

  if (previousState) {
    canonicalPrev.href = previousState.route;
    canonicalPrev.setAttribute("aria-disabled", "false");
  } else {
    canonicalPrev.href = "#";
    canonicalPrev.setAttribute("aria-disabled", "true");
  }

  if (nextState) {
    canonicalNext.href = nextState.route;
    canonicalNext.setAttribute("aria-disabled", "false");
  } else {
    canonicalNext.href = "#";
    canonicalNext.setAttribute("aria-disabled", "true");
  }
}

function getLegacyRouteForState(state) {
  return `/design-system/components/choice-group?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedChoiceGroupRoute()) {
    return `/design-system/canonical-renderings/choice-group/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedChoiceGroupReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/choice-group/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated choice-group canonical with status ${response.status}`);
  }

  const payload = await response.json();
  const matchedCanonical = canonicalStateMap.get(payload.reference.referenceId) ?? canonicalStates[0];
  return {
    family: payload.family,
    activeRefId: payload.reference.referenceId,
    width: payload.reference.width ?? matchedCanonical.width,
    state: typeof payload.reference.specimenPayload?.state === "string"
      ? payload.reference.specimenPayload.state
      : matchedCanonical.state,
    dir: payload.reference.direction ?? matchedCanonical.dir,
    zoom: payload.reference.zoom ?? matchedCanonical.zoom,
    theme: payload.reference.theme ?? matchedCanonical.theme,
    viewportLabel: payload.reference.viewport ?? matchedCanonical.viewportLabel,
    note: payload.reference.description,
  };
}

function renderCanonicalState(resolvedGeneratedState = null) {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = resolvedGeneratedState?.activeRefId
    ?? params.get("ref")
    ?? fallbackState.refId;
  const resolvedCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const payload = statePayloads[resolvedGeneratedState?.state ?? params.get("state") ?? resolvedCanonical.state]
    ?? statePayloads[resolvedCanonical.state];
  const width = normalizeWidth(
    resolvedGeneratedState?.width !== undefined
      ? String(resolvedGeneratedState.width)
      : params.get("width"),
    resolvedCanonical.width,
  );
  const dir = normalizeDir(resolvedGeneratedState?.dir ?? params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(
    resolvedGeneratedState?.zoom !== undefined
      ? String(resolvedGeneratedState.zoom)
      : (params.get("zoom") ?? String(resolvedCanonical.zoom)),
  );
  const theme = normalizeTheme(resolvedGeneratedState?.theme ?? params.get("theme") ?? resolvedCanonical.theme);
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  previewFrame.style.setProperty("--choice-group-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", zoom === 100 ? "1.5" : "1");
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "ready";
  previewShell.dataset.formErrorMode = String(payload.errorMode);
  previewShell.dataset.formDisabledMode = "false";
  previewShell.dataset.formMobileView = String(payload.mobile);
  previewShell.dataset.viewportClass = width <= 420 ? "mobile" : "desktop";
  previewShell.setAttribute("dir", dir);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 820)}px`);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  resetCopy(payload.copyOverride);
  setVisibleGroups(payload.visibleGroups);

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedCanonical.refId} - ${resolvedCanonical.label}`;
  }

  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width · ${dir.toUpperCase()} · ${zoom}% magnification · ${theme} theme`;
  }

  if (canonicalSummary instanceof HTMLElement) {
    canonicalSummary.textContent = payload.note;
  }

  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = payload.stateLabel;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedGeneratedState?.viewportLabel ?? resolvedCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedGeneratedState?.note ?? payload.note;
  }

  if (launcherLink instanceof HTMLAnchorElement) {
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonicals/choice-group";
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  document.body.dataset.renderStatus = "ready";
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render choice-group canonical", error);
});
