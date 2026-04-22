import type {
  ApprovedIconCatalogEntryResponse,
  ApprovedPageTemplateCatalogEntryResponse,
} from "../contract/types";

export const DEFAULT_PAGE_ICON_KEY = "page-default";

const LEGACY_PAGE_ICON_CATALOG: ApprovedIconCatalogEntryResponse[] = [
  { iconKey: "page-default", label: "Default Page", status: "approved" },
  { iconKey: "page-grid", label: "Grid", status: "approved" },
  { iconKey: "page-list", label: "List", status: "approved" },
  { iconKey: "page-settings", label: "Settings", status: "approved" },
  { iconKey: "page-home", label: "Home", status: "approved" },
  { iconKey: "page-folder", label: "Folder", status: "approved" },
];

const DESIGN_SYSTEM_ICON_KEYS = [
  "home",
  "grid",
  "list",
  "doc",
  "token",
  "spark",
  "text",
  "shield",
  "globe",
  "filter",
  "dashboard",
  "search",
  "sort",
  "email",
  "notification",
  "help",
  "settings",
  "comment",
  "calendar",
  "clock",
  "hierarchy",
  "browser",
  "layout",
  "row",
  "split",
  "record",
  "drawer",
  "workspace",
  "user",
  "secure-user",
  "super-user",
  "normal-user",
  "admin",
  "administrator",
  "leader",
  "tenant",
  "monitor",
  "checklist",
  "accessibility",
] as const;

function labelForIconKey(iconKey: string): string {
  return iconKey
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export const APPROVED_ICON_CATALOG: ApprovedIconCatalogEntryResponse[] = [
  ...LEGACY_PAGE_ICON_CATALOG,
  ...DESIGN_SYSTEM_ICON_KEYS.map((iconKey) => ({
    iconKey,
    label: labelForIconKey(iconKey),
    status: "approved" as const,
  })),
];

export const APPROVED_PAGE_TEMPLATE_CATALOG: ApprovedPageTemplateCatalogEntryResponse[] = [
  { pageTemplateKey: "static-html-page", label: "Static HTML Page", status: "approved" },
  { pageTemplateKey: "launcher", label: "Launcher", status: "approved" },
  { pageTemplateKey: "canonical-rendering", label: "Canonical Rendering", status: "approved" },
];
