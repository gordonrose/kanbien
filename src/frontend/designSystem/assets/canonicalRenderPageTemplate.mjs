import { createPageShellBreadcrumbController } from "./pageShellController.mjs";

const renderSettingsButton = document.getElementById("render-settings-button");
const renderSettingsDrawer = document.getElementById("render-settings-drawer");
const renderSettingsClose = document.getElementById("render-settings-close");
const pageSettingsButton = document.getElementById("accessibility-button");
const pageSettingsDrawer = document.getElementById("accessibility-drawer");

const previewFrame = document.getElementById("canonical-render-template-preview-frame");
const previewShell = document.getElementById("canonical-render-template-preview-shell");
const previewScroll = previewFrame?.closest(".canonical-render-template-scroll");
const stageNote = document.getElementById("canonical-render-template-stage-note");
const metaCircumstances = document.getElementById("canonical-render-template-meta-circumstances");
const metaSpecimen = document.getElementById("canonical-render-template-meta-specimen");
const widthReadout = document.getElementById("render-settings-width-readout");
const widthInput = document.getElementById("render-settings-width");
const patternSelect = document.getElementById("render-settings-pattern");

const viewportButtons = Array.from(document.querySelectorAll("button[data-render-viewport]"));
const themeButtons = Array.from(document.querySelectorAll("button[data-render-theme-option]"));
const directionButtons = Array.from(document.querySelectorAll("button[data-render-direction]"));
const zoomButtons = Array.from(document.querySelectorAll("button[data-render-zoom-option]"));
const labelButtons = Array.from(document.querySelectorAll("button[data-render-label-density]"));
const stateButtons = Array.from(document.querySelectorAll("button[data-render-state-option]"));

const specimenEyebrow = document.getElementById("canonical-render-template-specimen-eyebrow");
const specimenTitle = document.getElementById("canonical-render-page-preview-title");
const specimenCopy = document.getElementById("canonical-render-template-specimen-copy");
const stateBadge = document.getElementById("canonical-render-template-state-badge");
const primaryAction = document.getElementById("canonical-render-template-primary-action");
const secondaryAction = document.getElementById("canonical-render-template-secondary-action");
const toolbarNote = document.getElementById("canonical-render-template-toolbar-note");
const cardEyebrow = document.getElementById("canonical-render-template-card-eyebrow");
const cardTitle = document.getElementById("canonical-render-template-card-title");
const cardCopy = document.getElementById("canonical-render-template-card-copy");
const panelEyebrow = document.getElementById("canonical-render-template-panel-eyebrow");
const panelTitle = document.getElementById("canonical-render-template-panel-title");
const panelCopy = document.getElementById("canonical-render-template-panel-copy");
const panelContextNote = document.getElementById("canonical-render-template-panel-context-note");
const panelListA = document.getElementById("canonical-render-template-list-a");
const panelListB = document.getElementById("canonical-render-template-list-b");
const panelListC = document.getElementById("canonical-render-template-list-c");
const errorMessage = document.getElementById("canonical-render-template-error");
const missingMessage = document.getElementById("canonical-render-template-missing");
const scrollRegion = document.getElementById("canonical-render-template-scroll-region");
const layeredOverlay = document.getElementById("canonical-render-template-layered-overlay");
const patternVisual = document.getElementById("canonical-render-template-pattern-visual");
const subNavVisual = document.getElementById("canonical-render-template-sub-nav-visual");
const subNavShell = document.getElementById("canonical-render-template-sub-nav-shell");
const subNavBreadcrumbNav = document.getElementById("crt-sub-nav-breadcrumb-nav");
const subNavBreadcrumbList = document.getElementById("crt-sub-nav-breadcrumb-list");
const subNavHomeLink = document.getElementById("crt-sub-nav-home-link");
const subNavBreadcrumbCompact = document.getElementById("crt-sub-nav-breadcrumb-compact");
const subNavBreadcrumbCompactButton = document.getElementById("crt-sub-nav-breadcrumb-compact-button");
const subNavBreadcrumbCompactMenu = document.getElementById("crt-sub-nav-breadcrumb-compact-menu");
const subNavBreadcrumbCollapseButton = document.getElementById("crt-sub-nav-breadcrumb-collapse-button");
const subNavBreadcrumbCollapseMenu = document.getElementById("crt-sub-nav-breadcrumb-collapse-menu");
const subNavCollapsedItem = document.getElementById("crt-sub-nav-collapsed-item");
const subNavSeparatorBeforeCollapsed = document.getElementById("crt-sub-nav-separator-before-collapsed");
const subNavPageMinusOneItem = document.getElementById("crt-sub-nav-page-minus-one-item");
const subNavSeparatorBeforePageMinusOne = document.getElementById("crt-sub-nav-separator-before-page-minus-one");
const subNavPageMinusOneLink = document.getElementById("crt-sub-nav-page-minus-one-link");
const subNavSeparatorBeforeCurrent = document.getElementById("crt-sub-nav-separator-before-current");
const subNavCurrentItem = document.getElementById("crt-sub-nav-current-item");
const subNavCurrentLabel = document.getElementById("crt-sub-nav-current-label");
const subNavSearchShell = document.getElementById("crt-sub-nav-search-shell");
const subNavSearchInput = document.getElementById("crt-sub-nav-search-input");
const listRecordCardVisual = document.getElementById("canonical-render-template-list-record-card-visual");
const listRecordCardShell = document.getElementById("canonical-render-template-list-record-card-shell");
const listRecordCardButton = document.getElementById("crt-list-record-card");
const listRecordCardTitle = document.getElementById("crt-list-record-card-title");
const listRecordCardSubtitle = document.getElementById("crt-list-record-card-subtitle");
const listRecordCardDescription = document.getElementById("crt-list-record-card-description");
const listRecordCardTags = document.getElementById("crt-list-record-card-tags");
const listDetailPanelVisual = document.getElementById("canonical-render-template-list-detail-panel-visual");
const listDetailPanelShell = document.getElementById("canonical-render-template-list-detail-panel-shell");
const listDetailPanelMeta = document.getElementById("crt-list-detail-panel-meta");
const listDetailPanelTitle = document.getElementById("crt-list-detail-panel-title");
const listDetailPanelSubtitle = document.getElementById("crt-list-detail-panel-subtitle");
const listDetailPanelDescription = document.getElementById("crt-list-detail-panel-description");
const listDetailPanelTags = document.getElementById("crt-list-detail-panel-tags");
const listDetailPanelError = document.getElementById("crt-list-detail-panel-error");
const listDetailPanelClose = document.getElementById("crt-list-detail-panel-close");
const listDetailPanelPrev = document.getElementById("crt-list-detail-panel-prev");
const listDetailPanelNext = document.getElementById("crt-list-detail-panel-next");

const viewportWidths = {
  mobile: 390,
  tablet: 760,
  desktop: 1180,
  xl: 1560,
};

const renderZoomScales = {
  "-100": 0.5,
  "-50": 0.75,
  "0": 1,
  "50": 1.25,
  "100": 1.5,
};

const renderState = {
  pattern: "sub-nav-row",
  viewport: "desktop",
  width: viewportWidths.desktop,
  theme: "normal",
  direction: "ltr",
  zoom: 0,
  labels: "short",
  state: "open",
  laneFitScale: 1,
  effectiveScale: 1,
};

const subNavPatternBreadcrumbChain = [
  { href: "/design-system", label: "Home" },
  { href: "/design-system/components", label: "Components" },
  { href: "/design-system/components/navigation", label: "Navigation" },
  { href: "/design-system/components/navigation/sub-nav", label: "Sub Nav" },
  { href: "/design-system/components/navigation/sub-nav/breadcrumb", label: "Breadcrumb" },
];

const subNavPatternBreadcrumbController = (
  subNavBreadcrumbNav instanceof HTMLElement
  && subNavBreadcrumbList instanceof HTMLElement
  && subNavHomeLink instanceof HTMLElement
  && subNavBreadcrumbCompact instanceof HTMLElement
  && subNavBreadcrumbCompactButton instanceof HTMLElement
  && subNavBreadcrumbCompactMenu instanceof HTMLElement
  && subNavBreadcrumbCollapseButton instanceof HTMLElement
  && subNavBreadcrumbCollapseMenu instanceof HTMLElement
  && subNavCollapsedItem instanceof HTMLElement
  && subNavSeparatorBeforeCollapsed instanceof HTMLElement
  && subNavPageMinusOneItem instanceof HTMLElement
  && subNavSeparatorBeforePageMinusOne instanceof HTMLElement
  && subNavPageMinusOneLink instanceof HTMLElement
  && subNavSeparatorBeforeCurrent instanceof HTMLElement
  && subNavCurrentItem instanceof HTMLElement
  && subNavCurrentLabel instanceof HTMLElement
)
  ? createPageShellBreadcrumbController({
    row: subNavBreadcrumbNav.closest(".sub-nav"),
    breadcrumbNav: subNavBreadcrumbNav,
    breadcrumbList: subNavBreadcrumbList,
    breadcrumbHomeLink: subNavHomeLink,
    breadcrumbCompact: subNavBreadcrumbCompact,
    breadcrumbCompactButton: subNavBreadcrumbCompactButton,
    breadcrumbCompactMenu: subNavBreadcrumbCompactMenu,
    breadcrumbCollapseButton: subNavBreadcrumbCollapseButton,
    breadcrumbCollapseMenu: subNavBreadcrumbCollapseMenu,
    breadcrumbCollapsedItem: subNavCollapsedItem,
    breadcrumbSeparatorBeforeCollapsed: subNavSeparatorBeforeCollapsed,
    breadcrumbPageMinusOneItem: subNavPageMinusOneItem,
    breadcrumbSeparatorBeforePageMinusOne: subNavSeparatorBeforePageMinusOne,
    breadcrumbPageMinusOneLink: subNavPageMinusOneLink,
    breadcrumbSeparatorBeforeCurrent: subNavSeparatorBeforeCurrent,
    breadcrumbCurrentItem: subNavCurrentItem,
    breadcrumbCurrentLabel: subNavCurrentLabel,
  })
  : null;

const patternCopyByDensity = {
  "sub-nav-row": {
    short: {
      eyebrow: {
        mobile: "Mobile sub-nav review lane",
        tablet: "Tablet sub-nav review lane",
        desktop: "Desktop sub-nav review lane",
        xl: "XL sub-nav review lane",
      },
      title: "Sub-Nav Row Review",
      copy: "Inspect breadcrumb and bounded search balance inside one deterministic row instead of bouncing back to the broader host page.",
      primaryAction: "Review breadcrumb",
      secondaryAction: "Inspect search",
      toolbar: "Short row labels keep the shared chrome compact while the selector swaps between approved patterns.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Shared row contract",
      cardCopy: "This pattern governs the secondary chrome row that lets wayfinding and search coexist without one stealing the full lane.",
      panelEyebrow: "Row specimen",
      panelTitle: "Balanced breadcrumb and search",
      panelCopy: "The active specimen keeps breadcrumb, centered search, and surrounding shell posture visible together so layout pressure can be reviewed honestly.",
      panelContext: "Use render controls to pressure-test the row in narrower lanes, mirrored direction, and alternate local states without changing the page shell.",
      listA: "Breadcrumb yields before the bounded search shell loses its governed width.",
      listB: "The search affordance stays centered instead of drifting into page-local placement.",
      listC: "This row remains reusable page chrome rather than an app-specific one-off layout.",
      error: "The row specimen is showing a local failure message so reviewers can inspect how shared chrome survives under disruption.",
      missing: "The row keeps its structure even when a local breadcrumb or search datum is unavailable.",
      scroll: "Scrollable detail highlights how the row's reading notes behave when review guidance runs long.",
      layered: "Layered overlay mode proves a local prompt can sit above the row specimen without turning the whole page into a drawer.",
    },
    long: {
      eyebrow: {
        mobile: "Mobile sub-nav-row canonical specimen lane",
        tablet: "Tablet sub-nav-row canonical specimen lane",
        desktop: "Desktop sub-nav-row canonical specimen lane",
        xl: "Extra-large sub-nav-row canonical specimen lane",
      },
      title: "Sub-Nav Row Pattern Review Surface",
      copy: "Inspect the governed relationship between breadcrumb wayfinding and bounded search inside a deterministic render lane instead of relying on exploratory host-page interaction.",
      primaryAction: "Review breadcrumb reduction sequence",
      secondaryAction: "Inspect bounded search placement",
      toolbar: "Long labels intentionally push the row contract so reviewers can inspect spacing, wrapping pressure, and action readability under stress.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Shared sub-nav-row contract and viewing circumstances",
      cardCopy: "The left column explains why this row exists, which neighboring families it must balance, and why those review circumstances matter before sign-off.",
      panelEyebrow: "Row specimen",
      panelTitle: "One governed breadcrumb-plus-search specimen",
      panelCopy: "The active specimen keeps breadcrumb reduction, centered search posture, and shell truth together so reviewers can compare geometry and runtime behavior honestly.",
      panelContext: "Local render controls can mirror direction, add bounded zoom, and compress the row without mutating the surrounding canonical render-page shell.",
      listA: "Breadcrumb reduces before the centered search shell loses its governed width or alignment.",
      listB: "Search remains a bounded row participant rather than expanding into breadcrumb territory.",
      listC: "The row stays reusable page chrome instead of becoming a page-local arrangement that has to be reinvented downstream.",
      error: "The row specimen is intentionally showing a locally scoped disruption so the shared chrome can be reviewed under failure pressure without mutating the page shell.",
      missing: "The row keeps local scaffolding intact even when a dependent trail segment or supporting search note is unavailable.",
      scroll: "The scroll-pressure state proves longer review guidance can overflow inside the specimen without collapsing the surrounding render frame.",
      layered: "Layered overlay mode demonstrates that stacked row-specific guidance can sit above the specimen without dragging the broader canonical page into overlay mode.",
    },
  },
  breadcrumb: {
    short: {
      eyebrow: {
        mobile: "Mobile breadcrumb lane",
        tablet: "Tablet breadcrumb lane",
        desktop: "Desktop breadcrumb lane",
        xl: "XL breadcrumb lane",
      },
      title: "Breadcrumb Review",
      copy: "Focus on trail reduction, current-page visibility, and compact recovery without carrying the whole host row into the review job.",
      primaryAction: "Inspect trail",
      secondaryAction: "Open compact menu",
      toolbar: "Short labels keep the trail easy to scan while the local state controls pressure-test collapse behavior.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Wayfinding contract",
      cardCopy: "Breadcrumb governs real hierarchy only, current-page visibility, and graceful reduction before row overflow.",
      panelEyebrow: "Trail specimen",
      panelTitle: "Collapsed versus full trail",
      panelCopy: "This specimen isolates breadcrumb posture so reviewers can compare full, collapsed, and compact states without unrelated chrome noise.",
      panelContext: "Switch width and direction locally to see when the trail yields and how the current page remains visible.",
      listA: "Only real hierarchy belongs in the trail; filler steps are out of bounds.",
      listB: "Collapse should happen before labels collide with neighboring controls.",
      listC: "Compact recovery still needs a trustworthy path back to the current page.",
      error: "Breadcrumb review is showing a local failure callout so reviewers can inspect how the trail area behaves under disruption.",
      missing: "The trail holds structure even when a parent step is unavailable and recovery copy takes its place.",
      scroll: "Scrollable detail captures the longer breadcrumb guidance used during reduction reviews.",
      layered: "Layered overlay mode proves a compact-menu explanation can sit above the trail without mutating the page shell.",
    },
    long: {
      eyebrow: {
        mobile: "Mobile breadcrumb canonical specimen lane",
        tablet: "Tablet breadcrumb canonical specimen lane",
        desktop: "Desktop breadcrumb canonical specimen lane",
        xl: "Extra-large breadcrumb canonical specimen lane",
      },
      title: "Breadcrumb Pattern Review Surface",
      copy: "Inspect full-trail, collapsed-middle, and compact recovery behavior inside one deterministic lane so wayfinding sign-off does not depend on the rest of the host row.",
      primaryAction: "Inspect full-trail reduction behavior",
      secondaryAction: "Review compact recovery affordance",
      toolbar: "Long labels intentionally pressure the trail so reviewers can inspect reduction timing, readable current-page emphasis, and compact-menu resilience.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Breadcrumb contract and reduction circumstances",
      cardCopy: "The left column explains the approved trail variants, the no-fake-hierarchy rule, and why width pressure matters before anyone signs off.",
      panelEyebrow: "Trail specimen",
      panelTitle: "One deterministic breadcrumb specimen",
      panelCopy: "The specimen isolates trail posture so reviewers can compare geometry, current-page visibility, and reduction behavior honestly without unrelated search-shell noise.",
      panelContext: "Local render controls can mirror direction, compress the lane, and add bounded zoom while the surrounding canonical shell remains stable.",
      listA: "Full, collapsed, and compact trail variants must all preserve real hierarchy and current-page clarity.",
      listB: "Long labels should reduce through approved collapse modes before they overlap neighboring row chrome.",
      listC: "Compact recovery remains a signpost, not a license to hide the current page or invent fake intermediate steps.",
      error: "The breadcrumb specimen is intentionally showing a locally scoped failure callout so reduction posture can be reviewed under stress without mutating the page shell.",
      missing: "The missing-data state keeps trail scaffolding and recovery affordances intact even when a dependent ancestor label is unavailable.",
      scroll: "The scroll-pressure state captures the longer evaluation guidance often used during breadcrumb reduction review.",
      layered: "Layered overlay mode demonstrates that compact-menu explanation or recovery guidance can sit above the trail without dragging the broader page into overlay mode.",
    },
  },
  "search-shell": {
    short: {
      eyebrow: {
        mobile: "Mobile search lane",
        tablet: "Tablet search lane",
        desktop: "Desktop search lane",
        xl: "XL search lane",
      },
      title: "Search Shell Review",
      copy: "Inspect the bounded search affordance on its own so width, placeholder clarity, and centered posture stay honest under pressure.",
      primaryAction: "Focus search",
      secondaryAction: "Inspect width",
      toolbar: "Short labels keep the search specimen compact and readable while viewport changes stress the width contract.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Centered search contract",
      cardCopy: "Search shell governs one bounded input surface that stays discoverable in shared chrome without overpowering navigation.",
      panelEyebrow: "Search specimen",
      panelTitle: "Bounded centered search",
      panelCopy: "This specimen isolates the search affordance so reviewers can check centering, readable placeholder scope, and collapse posture directly.",
      panelContext: "Use local width and zoom changes to inspect when the shell stacks and how the centered width contract holds up.",
      listA: "The input stays centered and bounded instead of spreading into the whole row.",
      listB: "Placeholder scope should remain readable without turning into explanatory prose.",
      listC: "Stacking on narrow widths should be honest, not an early escape hatch for desktop layouts.",
      error: "The search-shell specimen is showing a local failure note so reviewers can inspect how the bounded search area behaves under disruption.",
      missing: "The bounded shell keeps its structure even when search suggestions or helper context are missing.",
      scroll: "Scrollable detail captures the longer operator guidance used when reviewing centered-search posture.",
      layered: "Layered overlay mode proves filter guidance can sit above the search shell without mutating the full canonical page.",
    },
    long: {
      eyebrow: {
        mobile: "Mobile search-shell canonical specimen lane",
        tablet: "Tablet search-shell canonical specimen lane",
        desktop: "Desktop search-shell canonical specimen lane",
        xl: "Extra-large search-shell canonical specimen lane",
      },
      title: "Search Shell Pattern Review Surface",
      copy: "Inspect the bounded search affordance inside a deterministic lane so centered width, readable placeholder scope, and stacking behavior can be reviewed without unrelated chrome.",
      primaryAction: "Focus bounded search field",
      secondaryAction: "Inspect centered width contract",
      toolbar: "Long labels intentionally pressure the search area so reviewers can inspect readable placeholder behavior, centering, and stacking thresholds under stress.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Search-shell contract and width circumstances",
      cardCopy: "The left column explains why the search surface must stay centered and bounded in shared chrome instead of turning into a page-local width hack.",
      panelEyebrow: "Search specimen",
      panelTitle: "One deterministic bounded-search specimen",
      panelCopy: "The specimen isolates search-shell posture so reviewers can compare geometry, centering, and stack behavior honestly without breadcrumb reduction muddying the frame.",
      panelContext: "Local render controls can narrow the specimen, mirror direction, and add bounded zoom while the outer canonical shell remains fixed and truthful.",
      listA: "The search affordance must remain centered and bounded instead of expanding across breadcrumb territory.",
      listB: "Placeholder and helper scope stay readable without turning the chrome into a prose-heavy onboarding surface.",
      listC: "Stacking is allowed only when the lane can no longer honestly sustain the desktop or tablet relationship.",
      error: "The search-shell specimen is intentionally showing a locally scoped failure note so bounded-search posture can be reviewed under stress without mutating the page shell.",
      missing: "The missing-data state keeps the search surface scaffolded even when helper content or nearby search context is unavailable.",
      scroll: "The scroll-pressure state captures longer operator notes that often accompany centered-search review and accessibility checks.",
      layered: "Layered overlay mode demonstrates that search guidance can stack above the specimen without dragging the broader canonical page into overlay mode.",
    },
  },
  "list-record-card": {
    short: {
      eyebrow: {
        mobile: "Mobile record-card lane",
        tablet: "Tablet record-card lane",
        desktop: "Desktop record-card lane",
        xl: "XL record-card lane",
      },
      title: "List Record Card Review",
      copy: "Inspect one summary-card specimen so scanning, selected-state feedback, and trigger posture stay honest without recreating the full list page.",
      primaryAction: "Review summary",
      secondaryAction: "Inspect selection",
      toolbar: "Short labels keep the card readable while local state controls stress selected and missing-data posture.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Record-scanning contract",
      cardCopy: "List-record-card governs compact record summary, selection feedback, and trigger posture for detail reveal without inline expansion.",
      panelEyebrow: "Card specimen",
      panelTitle: "Summary card with selection cues",
      panelCopy: "This specimen keeps one card in focus so reviewers can inspect title hierarchy, summary compression, and selected-state clarity directly.",
      panelContext: "Use local render controls to stress narrow lanes, label density, and mirrored scan order without changing the outer page shell.",
      listA: "The card remains a summary trigger rather than expanding into inline detail.",
      listB: "Selection cues need to stay legible without making the whole card feel overloaded.",
      listC: "Summary content should compress gracefully while keeping the primary record identity obvious.",
      error: "The record-card specimen is showing a local failure message so reviewers can inspect how summary posture survives under disruption.",
      missing: "The card keeps its reading structure even when a secondary summary field is missing.",
      scroll: "Scrollable detail captures the longer record notes used during summary-density review.",
      layered: "Layered overlay mode proves selection guidance can stack above the card specimen without mutating the canonical page shell.",
    },
    long: {
      eyebrow: {
        mobile: "Mobile list-record-card canonical specimen lane",
        tablet: "Tablet list-record-card canonical specimen lane",
        desktop: "Desktop list-record-card canonical specimen lane",
        xl: "Extra-large list-record-card canonical specimen lane",
      },
      title: "List Record Card Pattern Review Surface",
      copy: "Inspect one summary-card specimen so title hierarchy, compressed metadata, and selection feedback can be reviewed honestly without reconstructing the broader list-page template.",
      primaryAction: "Review summary-card hierarchy",
      secondaryAction: "Inspect selected-state feedback",
      toolbar: "Long labels intentionally stress the card so reviewers can inspect density, readability, and selection posture under realistic summary pressure.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Record-card contract and scanning circumstances",
      cardCopy: "The left column explains why the card stays summary-first, why inline expansion is out of scope, and why selection cues need to remain readable under compression.",
      panelEyebrow: "Card specimen",
      panelTitle: "One deterministic summary-card specimen",
      panelCopy: "The specimen isolates title, subtitle, summary, and selection posture so reviewers can compare geometry and trigger clarity honestly without full-list noise.",
      panelContext: "Local render controls can narrow the lane, mirror scan order, and pressure-test label density while the outer canonical shell remains unchanged.",
      listA: "The card remains a selection trigger and must not quietly absorb inline detail that belongs to a neighboring panel.",
      listB: "Selected-state feedback needs to stay visible without overwhelming the summary hierarchy or action affordances.",
      listC: "Compressed metadata, summary copy, and tags should still support fast scanning across repeated list-card families.",
      error: "The record-card specimen is intentionally showing a locally scoped failure state so summary-card posture can be reviewed under disruption without mutating the page shell.",
      missing: "The missing-data state keeps the card scaffolded and scan-friendly even when a dependent secondary field is unavailable.",
      scroll: "The scroll-pressure state captures the longer record notes that can appear during summary-density and content-length review.",
      layered: "Layered overlay mode demonstrates that selection guidance can sit above the card specimen without dragging the broader canonical page into overlay mode.",
    },
  },
  "list-detail-panel": {
    short: {
      eyebrow: {
        mobile: "Mobile detail-panel lane",
        tablet: "Tablet detail-panel lane",
        desktop: "Desktop detail-panel lane",
        xl: "XL detail-panel lane",
      },
      title: "List Detail Panel Review",
      copy: "Inspect one open-detail specimen so header zoning, local errors, and footer traversal stay honest without rebuilding the parent list page.",
      primaryAction: "Open detail",
      secondaryAction: "Inspect footer",
      toolbar: "Short labels keep the panel readable while the local controls stress half-page, mobile, and failure states.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Open-detail contract",
      cardCopy: "List-detail-panel governs a reading surface with stable header, body, and footer structure that degrades locally instead of breaking the wider master-detail flow.",
      panelEyebrow: "Detail specimen",
      panelTitle: "Header, body, and footer in one lane",
      panelCopy: "This specimen keeps one open-detail panel in focus so reviewers can inspect reading length, local errors, and traversal affordances directly.",
      panelContext: "Use local render controls to pressure-test half-page width, mobile stacking, and mirrored direction without changing the outer canonical shell.",
      listA: "Header, content, and footer controls stay coherent even when fields are missing.",
      listB: "Local detail errors remain inside the panel instead of breaking the page frame.",
      listC: "Long content should scroll honestly without collapsing action and footer posture.",
      error: "The detail-panel specimen is showing a local failure callout so reviewers can inspect error containment inside the panel body.",
      missing: "The panel keeps its reading structure even when a dependent summary field or detail note is unavailable.",
      scroll: "Scrollable detail proves the reading lane can absorb longer operational content while preserving containment.",
      layered: "Layered overlay mode proves panel-local guidance can stack above the detail body without mutating the full render page.",
    },
    long: {
      eyebrow: {
        mobile: "Mobile list-detail-panel canonical specimen lane",
        tablet: "Tablet list-detail-panel canonical specimen lane",
        desktop: "Desktop list-detail-panel canonical specimen lane",
        xl: "Extra-large list-detail-panel canonical specimen lane",
      },
      title: "List Detail Panel Pattern Review Surface",
      copy: "Inspect one open-detail specimen so header zoning, local error handling, reading length, and footer traversal can be reviewed honestly without reconstructing the parent list-page template.",
      primaryAction: "Review open-detail panel structure",
      secondaryAction: "Inspect footer traversal affordance",
      toolbar: "Long labels intentionally pressure the detail surface so reviewers can inspect readable hierarchy, overflow behavior, and footer clarity under realistic content length.",
      cardEyebrow: "Pattern summary",
      cardTitle: "Detail-panel contract and reading circumstances",
      cardCopy: "The left column explains why the panel keeps a stable header-body-footer stack, why local disruptions stay local, and why half-page review circumstances matter before sign-off.",
      panelEyebrow: "Detail specimen",
      panelTitle: "One deterministic open-detail specimen",
      panelCopy: "The specimen isolates header zoning, content length, and footer traversal so reviewers can compare geometry and runtime posture honestly without the broader list page muddying the frame.",
      panelContext: "Local render controls can compress the lane, mirror direction, and apply bounded zoom while the surrounding canonical shell remains stable and truthful.",
      listA: "Header, reading body, and footer traversal must remain coherent even when secondary fields or local notes disappear.",
      listB: "Local detail failures stay inside the panel so the broader master-detail rhythm does not collapse around one broken record.",
      listC: "Long content should overflow honestly inside the panel instead of forcing the surrounding canonical page to absorb hidden scroll behavior.",
      error: "The detail-panel specimen is intentionally showing a locally scoped failure state so reviewers can inspect containment and readability under disruption without mutating the page shell.",
      missing: "The missing-data state keeps local scaffolding, alignment, and traversal affordances intact even when a dependent detail field is unavailable.",
      scroll: "The scroll-pressure state proves the detail lane can absorb longer operational content while preserving containment and footer posture.",
      layered: "Layered overlay mode demonstrates that panel-local guidance can stack above the detail body without dragging the broader canonical page into overlay mode.",
    },
  },
};

const stateContent = {
  open: {
    badge: "Open",
    stage: "ready for direct inspection",
    status: "Local specimen",
    note: "",
  },
  closed: {
    badge: "Closed",
    stage: "collapsed to prove shell stability",
    status: "Collapsed specimen",
    note: "The focused panel is collapsed so reviewers can inspect the closed posture without changing the surrounding anatomy.",
  },
  disabled: {
    badge: "Disabled",
    stage: "locked to prove non-interactive posture",
    status: "Disabled specimen",
    note: "Actions are disabled so the lane can show a governed non-interactive state without changing page-level navigation.",
  },
  error: {
    badge: "Error",
    stage: "under failure pressure",
    status: "Error specimen",
    note: "An inline failure callout stays inside the specimen so the render page can be reviewed under error pressure.",
  },
  missing: {
    badge: "Missing",
    stage: "with missing local content",
    status: "Missing detail",
    note: "A dependent field is absent, so the lane proves missing-data posture without collapsing the local structure.",
  },
  scroll: {
    badge: "Scroll",
    stage: "under vertical overflow pressure",
    status: "Scrollable detail",
    note: "Long local content forces an inner scroll region so reviewers can inspect containment and overflow honestly.",
  },
  layered: {
    badge: "Layered",
    stage: "with stacked local UI",
    status: "Overlay active",
    note: "A local overlay layer sits above the specimen to prove stacking behavior without opening a page-level drawer.",
  },
};

function setPatternSurfaceVisibility(surface, visible) {
  if (!(surface instanceof HTMLElement)) {
    return;
  }

  surface.classList.toggle("hidden", !visible);
}

function syncPatternVisual() {
  const selectedPattern = renderState.pattern;
  const isSubNavFamily = selectedPattern === "sub-nav-row" || selectedPattern === "breadcrumb" || selectedPattern === "search-shell";

  if (patternVisual instanceof HTMLElement) {
    patternVisual.style.setProperty("--canonical-render-template-pattern-width", `${renderState.width}px`);
  }

  if (subNavShell instanceof HTMLElement) {
    subNavShell.dataset.themeScope = renderState.theme;
    subNavShell.dir = renderState.direction;
    subNavShell.classList.toggle("sub-nav-preview-mobile", renderState.viewport === "mobile");
  }

  if (subNavSearchInput instanceof HTMLInputElement) {
    subNavSearchInput.placeholder = selectedPattern === "search-shell"
      ? "Search shell pattern review"
      : "Search components, patterns, or docs";
  }

  setPatternSurfaceVisibility(subNavVisual, isSubNavFamily);
  setPatternSurfaceVisibility(listRecordCardVisual, selectedPattern === "list-record-card");
  setPatternSurfaceVisibility(listDetailPanelVisual, selectedPattern === "list-detail-panel");

  if (subNavBreadcrumbNav instanceof HTMLElement) {
    subNavBreadcrumbNav.classList.toggle("hidden", selectedPattern === "search-shell");
  }

  if (subNavSearchShell instanceof HTMLElement) {
    subNavSearchShell.classList.toggle("hidden", selectedPattern === "breadcrumb");
  }

  subNavPatternBreadcrumbController?.renderBreadcrumbs(subNavPatternBreadcrumbChain);
  subNavPatternBreadcrumbController?.scheduleBreadcrumbPresentation();

  if (listRecordCardShell instanceof HTMLElement) {
    listRecordCardShell.dataset.themeScope = renderState.theme;
    listRecordCardShell.dir = renderState.direction;
    listRecordCardShell.dataset.viewportClass = renderState.viewport === "mobile" ? "mobile" : "desktop";
    listRecordCardShell.style.setProperty("--list-record-card-preview-width", `${Math.min(renderState.width, 760)}px`);
  }

  if (listRecordCardButton instanceof HTMLButtonElement) {
    listRecordCardButton.disabled = renderState.state === "disabled";
    listRecordCardButton.setAttribute("aria-pressed", String(renderState.state !== "closed"));
  }

  if (listRecordCardTitle instanceof HTMLElement) {
    listRecordCardTitle.textContent = renderState.labels === "long"
      ? "Root Admin Surface Inventory and Navigation Governance Readiness"
      : "Root Admin Surface Inventory";
  }

  if (listRecordCardSubtitle instanceof HTMLElement) {
    listRecordCardSubtitle.textContent = renderState.labels === "long"
      ? "Curated navigation readiness snapshot for governed root-admin surfaces"
      : "Curated navigation readiness snapshot";
    listRecordCardSubtitle.classList.toggle("hidden", renderState.state === "missing");
  }

  if (listRecordCardDescription instanceof HTMLElement) {
    listRecordCardDescription.textContent = renderState.state === "error"
      ? "This summary card is showing a local failure posture while the surrounding list rhythm stays intact."
      : "Reviewers scan one record summary at a time before the parent page reveals a governed detail panel.";
  }

  if (listRecordCardTags instanceof HTMLElement) {
    listRecordCardTags.classList.toggle("hidden", renderState.state === "missing");
  }

  if (listDetailPanelShell instanceof HTMLElement) {
    listDetailPanelShell.dataset.themeScope = renderState.theme;
    listDetailPanelShell.dir = renderState.direction;
    listDetailPanelShell.dataset.viewportClass = renderState.viewport === "mobile" ? "mobile" : "desktop";
    listDetailPanelShell.style.setProperty("--list-detail-panel-preview-width", `${Math.min(renderState.width, 760)}px`);
  }

  if (listDetailPanelMeta instanceof HTMLElement) {
    listDetailPanelMeta.classList.toggle("hidden", renderState.state === "missing");
  }

  if (listDetailPanelSubtitle instanceof HTMLElement) {
    listDetailPanelSubtitle.classList.toggle("hidden", renderState.state === "missing");
  }

  if (listDetailPanelTags instanceof HTMLElement) {
    listDetailPanelTags.classList.toggle("hidden", renderState.state === "missing");
  }

  if (listDetailPanelError instanceof HTMLElement) {
    const showError = renderState.state === "error";
    listDetailPanelError.classList.toggle("hidden", !showError);
    listDetailPanelError.setAttribute("aria-hidden", String(!showError));
  }

  if (listDetailPanelDescription instanceof HTMLElement) {
    listDetailPanelDescription.classList.toggle("hidden", renderState.state === "error");
    listDetailPanelDescription.textContent = renderState.state === "scroll"
      ? "The established design-system detail panel keeps reading length, actions, and footer traversal inside one focused surface while longer operational notes push the body into honest overflow. Reviewers should see the panel keep its boundary and action posture instead of leaking scroll behavior into the outer shell."
      : "The established design-system detail panel keeps reading length, actions, and footer traversal inside one focused surface instead of letting errors or missing fields collapse the surrounding page rhythm.";
  }

  if (listDetailPanelClose instanceof HTMLButtonElement) {
    listDetailPanelClose.disabled = renderState.state === "disabled";
  }

  if (listDetailPanelPrev instanceof HTMLButtonElement) {
    listDetailPanelPrev.disabled = renderState.state === "disabled";
  }

  if (listDetailPanelNext instanceof HTMLButtonElement) {
    listDetailPanelNext.disabled = renderState.state === "disabled";
  }
}

let renderFitFrame = 0;

function inferViewport(width) {
  if (width <= 480) {
    return "mobile";
  }
  if (width <= 900) {
    return "tablet";
  }
  if (width >= 1440) {
    return "xl";
  }
  return "desktop";
}

function normalizeWidth(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return viewportWidths.desktop;
  }
  return Math.max(320, Math.min(1680, parsed));
}

function getZoomScale() {
  return renderZoomScales[String(renderState.zoom)] ?? 1;
}

function getRenderFitMetrics() {
  if (!(previewScroll instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return {
      laneFitScale: 1,
      effectiveScale: getZoomScale(),
      fittedWidth: renderState.width,
      fittedHeight: previewShell instanceof HTMLElement ? previewShell.scrollHeight * getZoomScale() : 0,
    };
  }

  const availableWidth = Math.max(320, previewScroll.clientWidth - 4);
  const shouldCompensate = renderState.viewport === "desktop" || renderState.viewport === "xl";
  const laneFitScale = shouldCompensate ? Math.min(1, availableWidth / renderState.width) : 1;
  const effectiveScale = laneFitScale * getZoomScale();
  const fittedWidth = Math.round(renderState.width * effectiveScale);
  const fittedHeight = Math.ceil(previewShell.scrollHeight * effectiveScale);

  return { laneFitScale, effectiveScale, fittedWidth, fittedHeight };
}

function applyRenderFit() {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement) || !(previewScroll instanceof HTMLElement)) {
    return;
  }

  const { laneFitScale, effectiveScale, fittedWidth, fittedHeight } = getRenderFitMetrics();

  renderState.laneFitScale = laneFitScale;
  renderState.effectiveScale = effectiveScale;
  previewFrame.style.setProperty("--canonical-render-template-fit-scale", String(effectiveScale));
  previewFrame.style.setProperty("--canonical-render-template-fitted-width", `${fittedWidth}px`);
  previewFrame.style.setProperty("--canonical-render-template-fitted-height", `${fittedHeight}px`);
}

function scheduleRenderFit() {
  if (renderFitFrame) {
    window.cancelAnimationFrame(renderFitFrame);
  }

  renderFitFrame = window.requestAnimationFrame(() => {
    renderFitFrame = 0;
    applyRenderFit();
  });
}

function setPageDrawerOpen(open) {
  if (!(pageSettingsButton instanceof HTMLElement) || !(pageSettingsDrawer instanceof HTMLElement)) {
    return;
  }
  pageSettingsButton.setAttribute("aria-expanded", String(open));
  pageSettingsDrawer.classList.toggle("hidden", !open);
  pageSettingsDrawer.setAttribute("aria-hidden", String(!open));
  syncRenderDrawerStacking();
}

function setRenderDrawerOpen(open, { restoreFocus = true } = {}) {
  if (!(renderSettingsButton instanceof HTMLElement) || !(renderSettingsDrawer instanceof HTMLElement)) {
    return;
  }

  syncRenderDrawerStacking();
  renderSettingsButton.setAttribute("aria-expanded", String(open));
  renderSettingsDrawer.classList.toggle("hidden", !open);
  renderSettingsDrawer.setAttribute("aria-hidden", String(!open));

  if (open) {
    renderSettingsClose?.focus();
    return;
  }

  if (restoreFocus) {
    renderSettingsButton.focus();
  }
}

function isRenderDrawerOpen() {
  return renderSettingsButton?.getAttribute("aria-expanded") === "true";
}

function isPageDrawerOpen() {
  return pageSettingsButton?.getAttribute("aria-expanded") === "true";
}

function syncRenderDrawerStacking() {
  if (!(renderSettingsDrawer instanceof HTMLElement)) {
    return;
  }

  renderSettingsDrawer.classList.toggle(
    "canonical-render-template-render-drawer-stacked",
    Boolean(isPageDrawerOpen()),
  );
}

function setPressedState(buttons, activeValue, key) {
  buttons.forEach((button) => {
    const isActive = button.dataset[key] === activeValue;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function syncRenderPreview() {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  const patternCopy = patternCopyByDensity[renderState.pattern] ?? patternCopyByDensity["sub-nav-row"];
  const densityCopy = patternCopy[renderState.labels];
  const stateMeta = stateContent[renderState.state] ?? stateContent.open;
  const width = renderState.width;
  const viewportLabel = renderState.viewport === "xl" ? "XL Large" : `${renderState.viewport[0].toUpperCase()}${renderState.viewport.slice(1)}`;
  const directionLabel = renderState.direction === "rtl" ? "RTL" : "LTR";
  const zoomLabel = renderState.zoom > 0 ? `+${renderState.zoom}%` : `${renderState.zoom}%`;
  const { laneFitScale, effectiveScale } = getRenderFitMetrics();
  renderState.laneFitScale = laneFitScale;
  renderState.effectiveScale = effectiveScale;
  const effectivePercent = Math.round(effectiveScale * 100);
  const laneFitPercent = Math.round(laneFitScale * 100);
  const laneFitNote = laneFitScale < 1 ? ` Lane fit compensates wide widths to ${laneFitPercent}% before local zoom is applied.` : "";

  previewFrame.style.setProperty("--canonical-render-template-preview-width", `${width}px`);
  previewShell.dataset.themeScope = renderState.theme;
  previewShell.dataset.renderViewport = renderState.viewport;
  previewShell.dataset.renderLabels = renderState.labels;
  previewShell.dataset.renderState = renderState.state;
  previewShell.dir = renderState.direction;

  if (widthReadout instanceof HTMLElement) {
    widthReadout.textContent = `${width}px`;
  }
  if (widthInput instanceof HTMLInputElement) {
    widthInput.value = String(width);
  }

  if (specimenEyebrow instanceof HTMLElement) {
    specimenEyebrow.textContent = densityCopy.eyebrow[renderState.viewport];
  }
  if (specimenTitle instanceof HTMLElement) {
    specimenTitle.textContent = densityCopy.title;
  }
  if (specimenCopy instanceof HTMLElement) {
    specimenCopy.textContent = densityCopy.copy;
  }
  if (patternSelect instanceof HTMLSelectElement) {
    patternSelect.value = renderState.pattern;
  }
  if (primaryAction instanceof HTMLButtonElement) {
    primaryAction.textContent = densityCopy.primaryAction;
    primaryAction.disabled = renderState.state === "disabled";
  }
  if (secondaryAction instanceof HTMLButtonElement) {
    secondaryAction.textContent = densityCopy.secondaryAction;
    secondaryAction.disabled = renderState.state === "disabled";
  }
  if (toolbarNote instanceof HTMLElement) {
    const stateSpecificToolbar = {
      error: densityCopy.error,
      missing: densityCopy.missing,
      scroll: densityCopy.scroll,
      layered: densityCopy.layered,
    };
    toolbarNote.textContent = stateSpecificToolbar[renderState.state] ?? densityCopy.toolbar;
  }
  if (cardEyebrow instanceof HTMLElement) {
    cardEyebrow.textContent = densityCopy.cardEyebrow;
  }
  if (cardTitle instanceof HTMLElement) {
    cardTitle.textContent = densityCopy.cardTitle;
  }
  if (cardCopy instanceof HTMLElement) {
    cardCopy.textContent = densityCopy.cardCopy;
  }
  if (panelEyebrow instanceof HTMLElement) {
    panelEyebrow.textContent = densityCopy.panelEyebrow;
  }
  if (panelTitle instanceof HTMLElement) {
    panelTitle.textContent = densityCopy.panelTitle;
  }
  if (panelCopy instanceof HTMLElement) {
    panelCopy.textContent = densityCopy.panelCopy;
  }
  if (panelContextNote instanceof HTMLElement) {
    panelContextNote.textContent = stateMeta.note || densityCopy.panelContext;
  }
  if (panelListA instanceof HTMLElement) {
    panelListA.textContent = densityCopy.listA;
  }
  if (panelListB instanceof HTMLElement) {
    panelListB.textContent = densityCopy.listB;
  }
  if (panelListC instanceof HTMLElement) {
    panelListC.textContent = densityCopy.listC;
  }
  if (errorMessage instanceof HTMLElement) {
    errorMessage.textContent = densityCopy.error;
    errorMessage.classList.toggle("hidden", renderState.state !== "error");
  }
  if (missingMessage instanceof HTMLElement) {
    missingMessage.classList.toggle("hidden", renderState.state !== "missing");
  }
  if (scrollRegion instanceof HTMLElement) {
    scrollRegion.classList.toggle("hidden", renderState.state !== "scroll");
  }
  if (layeredOverlay instanceof HTMLElement) {
    layeredOverlay.classList.toggle("hidden", renderState.state !== "layered");
    layeredOverlay.setAttribute("aria-hidden", String(renderState.state !== "layered"));
  }
  if (stateBadge instanceof HTMLElement) {
    stateBadge.textContent = stateMeta.badge;
  }
  document.querySelectorAll(".canonical-render-template-panel-status").forEach((node) => {
    node.textContent = stateMeta.status;
  });

  if (stageNote instanceof HTMLElement) {
    stageNote.textContent = `${densityCopy.title} at ${width}px in ${viewportLabel} ${directionLabel} review with ${renderState.labels} labels, ${renderState.theme} render theme, ${zoomLabel} local zoom, and ${renderState.state} state.${laneFitNote}`;
  }
  if (metaCircumstances instanceof HTMLElement) {
    metaCircumstances.textContent = `Page shell settings still apply outside the specimen, while the local render lane can swap between five governed patterns and change direction, bounded zoom, and state posture inside a ${viewportLabel.toLowerCase()} review frame.${laneFitNote}`;
  }
  if (metaSpecimen instanceof HTMLElement) {
    metaSpecimen.textContent = `${densityCopy.title}, ${viewportLabel} viewport, ${width}px width, ${directionLabel}, ${renderState.labels} labels, ${renderState.state} state, ${renderState.theme} render theme, ${zoomLabel} requested zoom, ${effectivePercent}% effective render zoom.`;
  }

  setPressedState(viewportButtons, renderState.viewport, "renderViewport");
  setPressedState(themeButtons, renderState.theme, "renderThemeOption");
  setPressedState(directionButtons, renderState.direction, "renderDirection");
  setPressedState(zoomButtons, String(renderState.zoom), "renderZoomOption");
  setPressedState(labelButtons, renderState.labels, "renderLabelDensity");
  setPressedState(stateButtons, renderState.state, "renderStateOption");
  syncPatternVisual();
  scheduleRenderFit();
}

viewportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextViewport = button.dataset.renderViewport;
    if (!nextViewport || !(nextViewport in viewportWidths)) {
      return;
    }
    renderState.viewport = nextViewport;
    renderState.width = viewportWidths[nextViewport];
    syncRenderPreview();
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = button.dataset.renderThemeOption;
    if (!nextTheme) {
      return;
    }
    renderState.theme = nextTheme;
    syncRenderPreview();
  });
});

directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextDirection = button.dataset.renderDirection;
    if (!nextDirection) {
      return;
    }
    renderState.direction = nextDirection;
    syncRenderPreview();
  });
});

zoomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextZoom = Number.parseInt(button.dataset.renderZoomOption ?? "", 10);
    if (!Number.isFinite(nextZoom)) {
      return;
    }
    renderState.zoom = nextZoom;
    syncRenderPreview();
  });
});

labelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextLabels = button.dataset.renderLabelDensity;
    if (!nextLabels) {
      return;
    }
    renderState.labels = nextLabels;
    syncRenderPreview();
  });
});

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextState = button.dataset.renderStateOption;
    if (!nextState) {
      return;
    }
    renderState.state = nextState;
    syncRenderPreview();
  });
});

widthInput?.addEventListener("input", () => {
  renderState.width = normalizeWidth(widthInput.value);
  renderState.viewport = inferViewport(renderState.width);
  syncRenderPreview();
});

function syncSelectedPattern() {
  if (!(patternSelect instanceof HTMLSelectElement)) {
    return;
  }

  if (!(patternSelect.value in patternCopyByDensity)) {
    return;
  }

  renderState.pattern = patternSelect.value;
  syncRenderPreview();
}

patternSelect?.addEventListener("input", syncSelectedPattern);
patternSelect?.addEventListener("change", syncSelectedPattern);

pageSettingsButton?.addEventListener("click", () => {
  setRenderDrawerOpen(false, { restoreFocus: false });
});

renderSettingsButton?.addEventListener("click", () => {
  setPageDrawerOpen(false);
  setRenderDrawerOpen(!isRenderDrawerOpen());
});

renderSettingsClose?.addEventListener("click", () => {
  setRenderDrawerOpen(false);
});

document.addEventListener("pointerdown", (event) => {
  if (!isRenderDrawerOpen()) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (renderSettingsButton?.contains(target) || renderSettingsDrawer?.contains(target)) {
    return;
  }

  setRenderDrawerOpen(false, { restoreFocus: false });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !isRenderDrawerOpen()) {
    return;
  }

  setRenderDrawerOpen(false);
});

syncRenderPreview();
window.addEventListener("resize", scheduleRenderFit);

if (typeof ResizeObserver !== "undefined" && previewScroll instanceof HTMLElement) {
  const fitObserver = new ResizeObserver(() => {
    scheduleRenderFit();
  });
  fitObserver.observe(previewScroll);
  fitObserver.observe(previewShell);
}

if (typeof MutationObserver !== "undefined" && pageSettingsDrawer instanceof HTMLElement) {
  const drawerObserver = new MutationObserver(() => {
    syncRenderDrawerStacking();
  });
  drawerObserver.observe(pageSettingsDrawer, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
}

if (typeof MutationObserver !== "undefined" && pageSettingsButton instanceof HTMLElement) {
  const buttonObserver = new MutationObserver(() => {
    syncRenderDrawerStacking();
  });
  buttonObserver.observe(pageSettingsButton, { attributes: true, attributeFilter: ["aria-expanded"] });
}

syncRenderDrawerStacking();
