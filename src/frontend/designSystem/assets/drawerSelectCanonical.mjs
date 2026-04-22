const previewFrame = document.getElementById("drawer-select-preview-frame");
const previewShell = document.getElementById("drawer-select-preview-shell");
const renderLayout = document.getElementById("drawer-select-render-layout");
const collectionsField = document.getElementById("drawer-select-collections-field");
const segmentsField = document.getElementById("drawer-select-segments-field");
const collectionsRoot = collectionsField?.querySelector("[data-form-drawer-select]");
const segmentsRoot = segmentsField?.querySelector("[data-form-drawer-select]");
const canonicalMatchList = document.getElementById("drawer-select-canonical-match-list");
const canonicalCircumstances = document.getElementById("drawer-select-canonical-circumstances");
const canonicalSummary = document.getElementById("drawer-select-preview-summary");
const canonicalCurrent = document.getElementById("drawer-select-canonical-current");
const canonicalPrev = document.getElementById("drawer-select-canonical-prev");
const canonicalNext = document.getElementById("drawer-select-canonical-next");
const canonicalMetaState = document.getElementById("drawer-select-meta-state");
const canonicalMetaViewport = document.getElementById("drawer-select-meta-viewport");
const canonicalMetaNotes = document.getElementById("drawer-select-meta-notes");
const launcherLink = document.querySelector('a[href="/design-system/canonicals/drawer-select"]');

const canonicalStates = [
  {
    refId: "DSR-001",
    label: "Descriptive resting trigger with compressed three-plus summary",
    route: "/design-system/components/drawer-select?ref=DSR-001&width=940&state=collections-resting-threeplus&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-resting-threeplus",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Resting descriptive trigger shows the approved three-plus summary compression while parent field framing stays visible.",
  },
  {
    refId: "DSR-002",
    label: "Descriptive open drawer with search, Selected, and Available stacks",
    route: "/design-system/components/drawer-select?ref=DSR-002&width=940&state=collections-open&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-open",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Primary open state exposes the search-first drawer chassis with the approved Selected and Available naming.",
  },
  {
    refId: "DSR-003",
    label: "Descriptive no-match search while selections remain visible",
    route: "/design-system/components/drawer-select?ref=DSR-003&width=940&state=collections-no-match&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-no-match",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Search empty state hides the Available stack contents without dropping the still-selected chips.",
  },
  {
    refId: "DSR-004",
    label: "Descriptive no-selected open state with empty fallback summary",
    route: "/design-system/components/drawer-select?ref=DSR-004&width=940&state=collections-empty-open&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-empty-open",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Selected-empty review keeps the drawer open while the trigger falls back to the honest empty-summary noun.",
  },
  {
    refId: "DSR-005",
    label: "Compact attribute-card variant open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-005&width=820&state=segments-open&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-open",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Compact variant keeps the same drawer contract while compressing the selected and available content to a single attribute line.",
  },
  {
    refId: "DSR-006",
    label: "Descriptive resting trigger with exact two-selection summary",
    route: "/design-system/components/drawer-select?ref=DSR-006&width=940&state=collections-resting-two&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-resting-two",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Exact-two resting state keeps both labels visible without summary compression.",
  },
  {
    refId: "DSR-007",
    label: "Descriptive resting trigger with exact one-selection summary",
    route: "/design-system/components/drawer-select?ref=DSR-007&width=940&state=collections-resting-one&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-resting-one",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Single-selection resting state keeps the summary truthful without introducing a synthetic placeholder.",
  },
  {
    refId: "DSR-008",
    label: "Descriptive open state after adding one available option",
    route: "/design-system/components/drawer-select?ref=DSR-008&width=940&state=collections-open-after-add&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-open-after-add",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Add-flow review shows selected count and trigger summary after one Available option has been toggled on.",
  },
  {
    refId: "DSR-009",
    label: "Descriptive open state after removing one selected chip",
    route: "/design-system/components/drawer-select?ref=DSR-009&width=940&state=collections-open-after-remove&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-open-after-remove",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Remove-flow review shows the open drawer after one Selected chip has been removed and synchronization has completed.",
  },
  {
    refId: "DSR-010",
    label: "Descriptive resting trigger with empty fallback summary",
    route: "/design-system/components/drawer-select?ref=DSR-010&width=940&state=collections-empty-resting&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-empty-resting",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Closed empty state preserves the hosted empty-summary noun without forcing the drawer open.",
  },
  {
    refId: "DSR-011",
    label: "Compact resting trigger with populated attribute-card summary",
    route: "/design-system/components/drawer-select?ref=DSR-011&width=820&state=segments-resting&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-resting",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Closed compact state preserves the approved populated summary without opening the drawer.",
  },
  {
    refId: "DSR-012",
    label: "Compact resting trigger with empty fallback summary",
    route: "/design-system/components/drawer-select?ref=DSR-012&width=820&state=segments-empty-resting&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-empty-resting",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Closed compact empty state confirms the segment-specific fallback noun instead of reusing the descriptive one.",
  },
  {
    refId: "DSR-013",
    label: "Compact open state with no selected items",
    route: "/design-system/components/drawer-select?ref=DSR-013&width=820&state=segments-empty-open&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-empty-open",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Compact selected-empty state keeps the attribute-card drawer open while showing the empty Selected stack.",
  },
  {
    refId: "DSR-014",
    label: "Compact open state with no search matches",
    route: "/design-system/components/drawer-select?ref=DSR-014&width=820&state=segments-no-match&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-no-match",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Compact search-empty state preserves the selected stack while the Available list is fully filtered out.",
  },
  {
    refId: "DSR-015",
    label: "RTL descriptive open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-015&width=940&state=collections-open&theme=normal&dir=rtl&zoom=0",
    width: 940,
    state: "collections-open",
    fixture: "collections",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "RTL open-state review keeps the child seam structure intact while mirroring directionality.",
  },
  {
    refId: "DSR-016",
    label: "Dark and magnified compact open review",
    route: "/design-system/components/drawer-select?ref=DSR-016&width=820&state=segments-open&theme=dark&dir=ltr&zoom=100",
    width: 820,
    state: "segments-open",
    fixture: "segments",
    dir: "ltr",
    zoom: 100,
    theme: "dark",
    viewportLabel: "Magnified compact attribute-card lane",
    note: "Dark-theme magnified review keeps the compact drawer legible while preserving the same core seam structure.",
  },
  {
    refId: "DSR-017",
    label: "Mobile descriptive open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-017&width=390&state=collections-open&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "collections-open",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile descriptive lane",
    note: "Mobile descriptive review keeps the drawer in a narrow overlay posture while preserving the same search-first open contract.",
  },
  {
    refId: "DSR-018",
    label: "Mobile compact open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-018&width=390&state=segments-open&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "segments-open",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile compact attribute-card lane",
    note: "Mobile compact review keeps the attribute-card variant readable in the narrow overlay posture.",
  },
  {
    refId: "DSR-019",
    label: "Descriptive open drawer with long-label stress",
    route: "/design-system/components/drawer-select?ref=DSR-019&width=940&state=collections-open-long&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-open-long",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Long-label descriptive review keeps summary, selected chips, and available options readable without collapsing the drawer structure.",
    copyVariant: "collections-long",
  },
  {
    refId: "DSR-020",
    label: "Compact open drawer with long-label stress",
    route: "/design-system/components/drawer-select?ref=DSR-020&width=820&state=segments-open-long&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-open-long",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Long-label compact review proves the denser attribute-card variant still stays readable under extended labels and attributes.",
    copyVariant: "segments-long",
  },
  {
    refId: "DSR-021",
    label: "Localized RTL descriptive open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-021&width=940&state=collections-open-localized&theme=normal&dir=rtl&zoom=0",
    width: 940,
    state: "collections-open-localized",
    fixture: "collections",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Localized RTL descriptive review keeps child-owned text, headings, and option rows coherent under translated copy.",
    copyVariant: "collections-localized",
  },
  {
    refId: "DSR-022",
    label: "Localized RTL compact open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-022&width=820&state=segments-open-localized&theme=normal&dir=rtl&zoom=0",
    width: 820,
    state: "segments-open-localized",
    fixture: "segments",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Localized RTL compact review keeps dense card content legible under translated labels and attribute copy.",
    copyVariant: "segments-localized",
  },
  {
    refId: "DSR-023",
    label: "Disabled descriptive resting review",
    route: "/design-system/components/drawer-select?ref=DSR-023&width=940&state=collections-resting-disabled&theme=normal&dir=ltr&zoom=0",
    width: 940,
    state: "collections-resting-disabled",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Parent field lane",
    note: "Disabled descriptive resting review keeps the hosted trigger truthful while blocking interaction in inherited disabled mode.",
    disabled: true,
  },
  {
    refId: "DSR-024",
    label: "Disabled compact resting review",
    route: "/design-system/components/drawer-select?ref=DSR-024&width=820&state=segments-resting-disabled&theme=normal&dir=ltr&zoom=0",
    width: 820,
    state: "segments-resting-disabled",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact attribute-card lane",
    note: "Disabled compact resting review keeps the denser trigger readable while honoring inherited disabled mode.",
    disabled: true,
  },
  {
    refId: "DSR-025",
    label: "Dark compact open review",
    route: "/design-system/components/drawer-select?ref=DSR-025&width=820&state=segments-open-dark&theme=dark&dir=ltr&zoom=0",
    width: 820,
    state: "segments-open-dark",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Compact attribute-card lane",
    note: "Dark compact review isolates theme stress without magnification so approved-host parity can compare the actual dark seam directly.",
  },
  {
    refId: "DSR-026",
    label: "Dark mobile descriptive open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-026&width=390&state=collections-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    width: 390,
    state: "collections-open-mobile-dark",
    fixture: "collections",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Mobile descriptive lane",
    note: "Dark mobile descriptive review keeps the narrow overlay posture legible under dark theme treatment.",
  },
  {
    refId: "DSR-027",
    label: "Dark mobile compact open drawer review",
    route: "/design-system/components/drawer-select?ref=DSR-027&width=390&state=segments-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    width: 390,
    state: "segments-open-mobile-dark",
    fixture: "segments",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Mobile compact attribute-card lane",
    note: "Dark mobile compact review keeps the denser overlay readable under the narrowest dark-theme posture.",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedDrawerSelectReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/drawer-select\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedDrawerSelectRoute() {
  return getGeneratedDrawerSelectReferenceId() !== null;
}
const scenarioStateMap = {
  "collections-resting-threeplus": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: false,
    search: "",
  },
  "collections-open": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: true,
    search: "",
  },
  "collections-no-match": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: true,
    search: "zzzz",
  },
  "collections-empty-open": {
    selectedValues: [],
    open: true,
    search: "",
  },
  "segments-open": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "",
  },
  "collections-resting-two": {
    selectedValues: ["ops-core", "customer-success"],
    open: false,
    search: "",
  },
  "collections-resting-one": {
    selectedValues: ["ops-core"],
    open: false,
    search: "",
  },
  "collections-open-after-add": {
    selectedValues: ["ops-core", "finance-admins", "customer-success", "renewals-watch"],
    open: true,
    search: "",
  },
  "collections-open-after-remove": {
    selectedValues: ["ops-core", "customer-success"],
    open: true,
    search: "",
  },
  "collections-empty-resting": {
    selectedValues: [],
    open: false,
    search: "",
  },
  "segments-resting": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: false,
    search: "",
  },
  "segments-empty-resting": {
    selectedValues: [],
    open: false,
    search: "",
  },
  "segments-empty-open": {
    selectedValues: [],
    open: true,
    search: "",
  },
  "segments-no-match": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "zzzz",
  },
  "collections-open-long": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: true,
    search: "",
  },
  "segments-open-long": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "",
  },
  "collections-open-localized": {
    selectedValues: ["ops-core", "customer-success"],
    open: true,
    search: "",
  },
  "segments-open-localized": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "",
  },
  "collections-resting-disabled": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: false,
    search: "",
  },
  "segments-resting-disabled": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: false,
    search: "",
  },
  "segments-open-dark": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "",
  },
  "collections-open-mobile-dark": {
    selectedValues: ["ops-core", "customer-success", "renewals-watch"],
    open: true,
    search: "",
  },
  "segments-open-mobile-dark": {
    selectedValues: ["new-admins", "at-risk-renewals"],
    open: true,
    search: "",
  },
};

const fixtureCopyOverrides = {
  "collections-long": {
    drawerEyebrow: "Collection picker",
    drawerTitle: "Choose workspace collections",
    searchPlaceholder: "Search collections",
    selectedTitle: "Selected",
    availableTitle: "Available",
    selectedEmpty: "No collections selected yet.",
    availableEmpty: "No collections match this search.",
    options: {
      "ops-core": {
        label: "Operations Coordination Council",
        description: "Primary internal operating cohort for launch coordination across approvals, sequencing, and response ownership.",
      },
      "finance-admins": {
        label: "Finance Administration And Billing Governance",
        description: "Billing owners and finance reviewers for customer-impacting changes across invoicing, approvals, and controls.",
      },
      "customer-success": {
        label: "Customer Success Enablement Leadership",
        description: "Account-facing operators who need launch timing, customer-readiness notes, and playbook visibility.",
      },
      "product-leads": {
        label: "Product And Rollout Narrative Leads",
        description: "Feature owners responsible for rollout narrative, adoption feedback, and follow-up signals.",
      },
      "risk-review": {
        label: "Risk Review And Compliance Escalations",
        description: "Compliance and escalation partners for sensitive tenant communications and approval paths.",
      },
      "renewals-watch": {
        label: "Renewals Health And Monitoring Watchlist",
        description: "Customer health and renewal monitoring cohort for near-term accounts that need coordinated attention.",
      },
      "trial-conversion": {
        label: "Lifecycle Trial Conversion Programs",
        description: "Lifecycle programs focused on first-value milestones, handoff readiness, and conversion nudges.",
      },
      "support-escalations": {
        label: "Support Escalations And Launch Exceptions",
        description: "Support leaders who need visibility into customer-facing launch exceptions and response playbooks.",
      },
    },
  },
  "segments-long": {
    drawerEyebrow: "Segment picker",
    drawerTitle: "Choose tenant segments",
    searchPlaceholder: "Search segments",
    selectedTitle: "Selected",
    availableTitle: "Available",
    selectedEmpty: "No segments selected yet.",
    availableEmpty: "No segments match this search.",
    options: {
      "enterprise-expansion": {
        label: "Enterprise Expansion Opportunity Watchlist",
        description: "42 tenants",
        attribute: "42 tenants",
      },
      "new-admins": {
        label: "Newly Added Workspace Administrators",
        description: "31 tenants",
        attribute: "31 tenants",
      },
      "inactive-owners": {
        label: "Inactive Workspace Owners Requiring Follow-Up",
        description: "18 tenants",
        attribute: "18 tenants",
      },
      "at-risk-renewals": {
        label: "Accounts With At-Risk Renewal Signals",
        description: "9 tenants",
        attribute: "9 tenants",
      },
      "high-growth-trials": {
        label: "High-Growth Trial Accounts Near First Value",
        description: "24 tenants",
        attribute: "24 tenants",
      },
      "support-heavy": {
        label: "Support-Heavy Accounts Requiring Guidance",
        description: "13 tenants",
        attribute: "13 tenants",
      },
    },
  },
  "collections-localized": {
    drawerEyebrow: "منتقي المجموعات",
    drawerTitle: "اختر مجموعات مساحة العمل",
    searchPlaceholder: "ابحث في المجموعات",
    selectedTitle: "المحدد",
    availableTitle: "المتاح",
    selectedEmpty: "لا توجد مجموعات محددة بعد.",
    availableEmpty: "لا توجد مجموعات مطابقة لهذا البحث.",
    options: {
      "ops-core": {
        label: "فريق التشغيل الأساسي",
        description: "الفريق الداخلي الأساسي المسؤول عن تنسيق الإطلاق والمتابعة التشغيلية.",
      },
      "finance-admins": {
        label: "مسؤولو المالية",
        description: "أصحاب الفوترة والمراجعون الماليون للتغييرات ذات التأثير على العملاء.",
      },
      "customer-success": {
        label: "فريق نجاح العملاء",
        description: "الفرق المواجهة للحسابات التي تحتاج إلى توقيت الإطلاق والرؤية الإرشادية.",
      },
      "product-leads": {
        label: "قادة المنتج",
        description: "مالكو الميزات المسؤولون عن سرد الإطلاق وإشارات المتابعة.",
      },
      "risk-review": {
        label: "مراجعة المخاطر",
        description: "شركاء الامتثال والتصعيد للاتصالات الحساسة مع المستأجرين.",
      },
      "renewals-watch": {
        label: "مراقبة التجديدات",
        description: "مجموعة مراقبة صحة العملاء والتجديدات للحسابات القريبة المدى.",
      },
      "trial-conversion": {
        label: "تحويل التجارب",
        description: "برامج دورة الحياة التي تركز على القيمة الأولى وزيادة التحويل.",
      },
      "support-escalations": {
        label: "تصعيدات الدعم",
        description: "قادة الدعم الذين يحتاجون إلى رؤية استثناءات الإطلاق المواجهة للعملاء.",
      },
    },
  },
  "segments-localized": {
    drawerEyebrow: "منتقي الشرائح",
    drawerTitle: "اختر شرائح المستأجرين",
    searchPlaceholder: "ابحث في الشرائح",
    selectedTitle: "المحدد",
    availableTitle: "المتاح",
    selectedEmpty: "لا توجد شرائح محددة بعد.",
    availableEmpty: "لا توجد شرائح مطابقة لهذا البحث.",
    options: {
      "enterprise-expansion": {
        label: "فرص التوسع المؤسسي",
        description: "42 مستأجراً",
        attribute: "42 مستأجراً",
      },
      "new-admins": {
        label: "المسؤولون الجدد",
        description: "31 مستأجراً",
        attribute: "31 مستأجراً",
      },
      "inactive-owners": {
        label: "المالكون غير النشطين",
        description: "18 مستأجراً",
        attribute: "18 مستأجراً",
      },
      "at-risk-renewals": {
        label: "التجديدات المعرضة للخطر",
        description: "9 مستأجرين",
        attribute: "9 مستأجرين",
      },
      "high-growth-trials": {
        label: "التجارب عالية النمو",
        description: "24 مستأجراً",
        attribute: "24 مستأجراً",
      },
      "support-heavy": {
        label: "الحسابات كثيرة الدعم",
        description: "13 مستأجراً",
        attribute: "13 مستأجراً",
      },
    },
  },
};

const fixtureCopyDefaults = new WeakMap();

function getScenarioForCanonical(canonical) {
  return scenarioStateMap[canonical.state] ?? null;
}

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(320, Math.min(parsed, 1040));
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

function getRootForFixture(fixture) {
  if (fixture === "segments" && segmentsRoot instanceof HTMLElement) {
    return segmentsRoot;
  }

  return collectionsRoot instanceof HTMLElement ? collectionsRoot : null;
}

function captureFixtureDefaults(root) {
  if (!(root instanceof HTMLElement) || fixtureCopyDefaults.has(root)) {
    return;
  }

  const drawerEyebrow = root.querySelector(".drawer-eyebrow");
  const drawerTitle = root.querySelector("h2");
  const searchInput = getSearchInput(root);
  const selectedTitle = root.querySelector(".form-drawer-select-selected-panel .form-drawer-select-selected-title");
  const availableTitle = root.querySelector(".form-drawer-select-catalog .form-drawer-select-selected-title");
  const selectedEmpty = root.querySelector("[data-form-drawer-select-selected-empty]");
  const availableEmpty = root.querySelector("[data-form-drawer-select-empty]");
  const options = Array.from(root.querySelectorAll("[data-form-drawer-select-option]")).map((option) => {
    const strong = option.querySelector("strong");
    const copy = option.querySelector(".form-drawer-select-option-copy span");
    return {
      value: option.getAttribute("data-value") ?? "",
      label: option.getAttribute("data-label") ?? "",
      description: option.getAttribute("data-description") ?? "",
      attribute: option.getAttribute("data-attribute") ?? "",
      strongText: strong?.textContent ?? "",
      copyText: copy?.textContent ?? "",
    };
  });

  fixtureCopyDefaults.set(root, {
    drawerEyebrow: drawerEyebrow?.textContent ?? "",
    drawerTitle: drawerTitle?.textContent ?? "",
    searchPlaceholder: searchInput?.getAttribute("placeholder") ?? "",
    selectedTitle: selectedTitle?.textContent ?? "",
    availableTitle: availableTitle?.textContent ?? "",
    selectedEmpty: selectedEmpty?.textContent ?? "",
    availableEmpty: availableEmpty?.textContent ?? "",
    options,
  });
}

function applyFixtureCopy(root, variantKey) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  captureFixtureDefaults(root);
  const defaults = fixtureCopyDefaults.get(root);
  if (!defaults) {
    return;
  }

  const variant = fixtureCopyOverrides[variantKey] ?? null;
  const resolved = variant ?? defaults;

  const drawerEyebrow = root.querySelector(".drawer-eyebrow");
  const drawerTitle = root.querySelector("h2");
  const searchInput = getSearchInput(root);
  const selectedTitle = root.querySelector(".form-drawer-select-selected-panel .form-drawer-select-selected-title");
  const availableTitle = root.querySelector(".form-drawer-select-catalog .form-drawer-select-selected-title");
  const selectedEmpty = root.querySelector("[data-form-drawer-select-selected-empty]");
  const availableEmpty = root.querySelector("[data-form-drawer-select-empty]");

  if (drawerEyebrow instanceof HTMLElement) {
    drawerEyebrow.textContent = resolved.drawerEyebrow;
  }
  if (drawerTitle instanceof HTMLElement) {
    drawerTitle.textContent = resolved.drawerTitle;
  }
  if (searchInput instanceof HTMLInputElement) {
    searchInput.setAttribute("placeholder", resolved.searchPlaceholder);
  }
  if (selectedTitle instanceof HTMLElement) {
    selectedTitle.textContent = resolved.selectedTitle;
  }
  if (availableTitle instanceof HTMLElement) {
    availableTitle.textContent = resolved.availableTitle;
  }
  if (selectedEmpty instanceof HTMLElement) {
    selectedEmpty.textContent = resolved.selectedEmpty;
  }
  if (availableEmpty instanceof HTMLElement) {
    availableEmpty.textContent = resolved.availableEmpty;
  }

  for (const option of root.querySelectorAll("[data-form-drawer-select-option]")) {
    if (!(option instanceof HTMLButtonElement)) {
      continue;
    }

    const value = option.getAttribute("data-value") ?? "";
    const defaultOption = defaults.options.find((entry) => entry.value === value);
    const optionOverride = variant?.options?.[value] ?? null;
    const nextLabel = optionOverride?.label ?? defaultOption?.label ?? "";
    const nextDescription = optionOverride?.description ?? defaultOption?.description ?? "";
    const nextAttribute = optionOverride?.attribute ?? defaultOption?.attribute ?? "";

    option.dataset.label = nextLabel;
    option.dataset.description = nextDescription;

    if (nextAttribute) {
      option.dataset.attribute = nextAttribute;
    } else {
      delete option.dataset.attribute;
    }

    const strong = option.querySelector("strong");
    const copy = option.querySelector(".form-drawer-select-option-copy span");

    if (strong instanceof HTMLElement) {
      strong.textContent = nextLabel;
    }
    if (copy instanceof HTMLElement) {
      copy.textContent = nextAttribute || nextDescription;
    }
  }
}

function applyDisabledState(shell, enabled) {
  if (!(shell instanceof HTMLElement)) {
    return;
  }

  shell.dataset.formDisabledMode = String(enabled);

  const controls = shell.querySelectorAll("input:not([type=\"hidden\"]), textarea, select, button");
  for (const control of controls) {
    if (
      control instanceof HTMLInputElement
      || control instanceof HTMLTextAreaElement
      || control instanceof HTMLSelectElement
      || control instanceof HTMLButtonElement
    ) {
      control.disabled = enabled;
    }
  }
}

function getSearchInput(root) {
  const input = root?.querySelector("[data-form-drawer-select-search]");
  return input instanceof HTMLInputElement ? input : null;
}

function getTrigger(root) {
  const trigger = root?.querySelector("[data-form-drawer-select-button]");
  return trigger instanceof HTMLButtonElement ? trigger : null;
}

function getSelectedList(root) {
  const list = root?.querySelector("[data-form-drawer-select-selected-list]");
  return list instanceof HTMLElement ? list : null;
}

function getHiddenInput(root) {
  const input = root?.querySelector("[data-form-drawer-select-value]");
  return input instanceof HTMLInputElement ? input : null;
}

function getSelectedValues(root) {
  const hiddenInput = getHiddenInput(root);
  if (!(hiddenInput instanceof HTMLInputElement)) {
    return [];
  }

  return hiddenInput.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function setVisibleField(fixture) {
  collectionsField?.classList.toggle("hidden", fixture !== "collections");
  segmentsField?.classList.toggle("hidden", fixture !== "segments");
}

function setGlobalAppearance({ dir, theme, zoom }) {
  if (previewShell instanceof HTMLElement) {
    previewShell.setAttribute("dir", dir);
    if (zoom === 100) {
      previewShell.style.setProperty("--ui-scale", "1.5");
    } else {
      previewShell.style.removeProperty("--ui-scale");
    }
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
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

async function nextFrame() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function openDrawer(root) {
  const trigger = getTrigger(root);
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  if (trigger.getAttribute("aria-expanded") !== "true") {
    trigger.click();
    await nextFrame();
    await nextFrame();
  }
}

async function closeDrawer(root) {
  const trigger = getTrigger(root);
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  if (trigger.getAttribute("aria-expanded") === "true") {
    trigger.click();
    await nextFrame();
  }
}

async function setSearch(root, value) {
  const searchInput = getSearchInput(root);
  if (!(searchInput instanceof HTMLInputElement)) {
    return;
  }

  searchInput.value = value;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  await nextFrame();
}

async function clickOptionForValue(root, value) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const optionButton = root.querySelector(`[data-form-drawer-select-option][data-value="${CSS.escape(value)}"]`);
  if (optionButton instanceof HTMLButtonElement) {
    optionButton.click();
    await nextFrame();
  }
}

async function clickRemoveForValue(root, value) {
  const selectedList = getSelectedList(root);
  if (!(selectedList instanceof HTMLElement)) {
    return;
  }

  const removeButton = selectedList.querySelector(`[data-form-drawer-select-remove="${CSS.escape(value)}"]`);
  if (removeButton instanceof HTMLButtonElement) {
    removeButton.click();
    await nextFrame();
  }
}

async function alignSelections(root, desiredValues) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const currentValues = getSelectedValues(root);
  const nextValues = Array.from(new Set(desiredValues));

  for (const value of currentValues) {
    if (!nextValues.includes(value)) {
      await clickRemoveForValue(root, value);
    }
  }

  const updatedValues = getSelectedValues(root);
  for (const value of nextValues) {
    if (!updatedValues.includes(value)) {
      await clickOptionForValue(root, value);
    }
  }
}

async function resetSurface() {
  for (const root of [collectionsRoot, segmentsRoot]) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    applyFixtureCopy(root, null);
    await closeDrawer(root);
    await setSearch(root, "");
  }
}

async function applyScenario(canonical) {
  const root = getRootForFixture(canonical.fixture);
  const scenario = getScenarioForCanonical(canonical);

  if (!(root instanceof HTMLElement) || !scenario) {
    return;
  }

  setVisibleField(canonical.fixture);
  await resetSurface();
  applyFixtureCopy(root, canonical.copyVariant ?? null);
  await openDrawer(root);
  await alignSelections(root, scenario.selectedValues);
  await setSearch(root, scenario.search);

  if (!scenario.open) {
    await closeDrawer(root);
  }
}

function getLegacyRouteForState(state) {
  return `/design-system/components/drawer-select?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedDrawerSelectRoute()) {
    return `/design-system/canonical-renderings/drawer-select/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedDrawerSelectReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/drawer-select/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated drawer-select canonical with status ${response.status}`);
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

async function renderCanonicalState(resolvedGeneratedState = null) {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = resolvedGeneratedState?.activeRefId
    ?? params.get("ref")
    ?? fallbackState.refId;
  const activeCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const activeScenario = getScenarioForCanonical(activeCanonical);
  const width = normalizeWidth(
    resolvedGeneratedState?.width !== undefined
      ? String(resolvedGeneratedState.width)
      : params.get("width"),
    activeCanonical.width,
  );
  const dir = normalizeDir(resolvedGeneratedState?.dir ?? params.get("dir") ?? activeCanonical.dir);
  const zoom = normalizeZoom(
    resolvedGeneratedState?.zoom !== undefined
      ? String(resolvedGeneratedState.zoom)
      : (params.get("zoom") ?? String(activeCanonical.zoom)),
  );
  const theme = normalizeTheme(resolvedGeneratedState?.theme ?? params.get("theme") ?? activeCanonical.theme);
  const currentIndex = canonicalStates.findIndex((state) => state.refId === activeCanonical.refId);

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  setGlobalAppearance({ dir, theme, zoom });
  previewFrame.style.setProperty("--drawer-select-preview-width", `${width}px`);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "settling";
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.viewportClass = width <= 430 ? "mobile" : width <= 820 ? "compact" : "standard";
  previewShell.dataset.formMobileView = String(width <= 430);
  previewShell.dataset.formDisabledMode = "false";
  previewShell.dataset.drawerOpen = String(activeScenario?.open ?? false);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 820)}px`);
  }

  await applyScenario(activeCanonical);
  applyDisabledState(previewShell, activeCanonical.disabled === true);

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${activeCanonical.refId} - ${activeCanonical.label}`;
  }

  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width · ${dir.toUpperCase()} · ${zoom}% magnification · ${theme} theme`;
  }

  if (canonicalSummary instanceof HTMLElement) {
    canonicalSummary.textContent = resolvedGeneratedState?.note ?? activeCanonical.note;
  }

  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = activeCanonical.label;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedGeneratedState?.viewportLabel ?? activeCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedGeneratedState?.note ?? activeCanonical.note;
  }

  if (launcherLink instanceof HTMLAnchorElement) {
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonicals/drawer-select";
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  previewShell.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  await renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render drawer-select canonical", error);
});
