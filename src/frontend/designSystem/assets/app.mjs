import { createPageShellBannerController } from "./pageShellBanner.mjs";
import {
  asyncActivityDrawerDemoJobs,
  createAsyncActivityDrawerController,
} from "./asyncActivityDrawer.mjs";
import { partitionContextNavItems, renderContextNavMenuItems } from "./contextNav.mjs";
import {
  initializeFormUploadFields as initializeSharedFormUploadFields,
  syncFormUploadFieldsForShell,
} from "./formControls.mjs";

function setTextContent(node, text) {
  if (node instanceof HTMLElement) {
    node.textContent = text;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

const formTimeHourOptions = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));
const formTimeMinuteOptions = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));
const designSystemIconDefinitions = [
  {
    key: "home",
    label: "Home",
    aliases: ["house", "dashboard", "landing"],
    markup: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />',
  },
  {
    key: "grid",
    label: "Grid",
    aliases: ["apps", "tiles", "catalog"],
    markup: '<path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" />',
  },
  {
    key: "list",
    label: "List",
    aliases: ["rows", "menu", "items"],
    markup: '<path d="M5 6h14v3H5zm0 5h14v3H5zm0 5h9v3H5z" />',
  },
  {
    key: "doc",
    label: "Document",
    aliases: ["file", "page", "record"],
    markup: '<path d="M7 4h8l4 4v12H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 1.5V9h3.5" />',
  },
  {
    key: "token",
    label: "Token",
    aliases: ["badge", "seal", "module"],
    markup: '<path d="m12 3 7 4v10l-7 4-7-4V7zm0 3.1L8.1 8.3v4.4L12 15l3.9-2.3V8.3z" />',
  },
  {
    key: "spark",
    label: "Spark",
    aliases: ["magic", "highlight", "featured"],
    markup: '<path d="M12 2.5 14.2 8l5.3 2-5.3 2-2.2 5.5L9.8 12 4.5 10l5.3-2zm-5 13 1.15 2.85L11 19.5l-2.85 1.15L7 23.5l-1.15-2.85L3 19.5l2.85-1.15z" />',
  },
  {
    key: "text",
    label: "Text",
    aliases: ["type", "content", "copy"],
    markup: '<path d="M5 5h14v3h-5.5v11h-3V8H5z" />',
  },
  {
    key: "shield",
    label: "Shield",
    aliases: ["secure", "security", "protection"],
    markup: '<path d="M12 3.2 18.5 5v5.2c0 4.3-2.75 8.05-6.5 9.8-3.75-1.75-6.5-5.5-6.5-9.8V5zM10.8 14.7l4.7-4.7-1.4-1.4-3.3 3.3-1.8-1.8-1.4 1.4z" />',
  },
  {
    key: "globe",
    label: "Globe",
    aliases: ["world", "global", "internet"],
    markup: '<path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm5.85 8h-3.2a14.4 14.4 0 0 0-1.2-5A7.03 7.03 0 0 1 17.85 11zM12 5.2A12.1 12.1 0 0 1 13.4 11h-2.8A12.1 12.1 0 0 1 12 5.2zM6.15 13h3.2a14.4 14.4 0 0 0 1.2 5A7.03 7.03 0 0 1 6.15 13zm3.2-2h-3.2A7.03 7.03 0 0 1 10.55 6a14.4 14.4 0 0 0-1.2 5zm2.65 7.8A12.1 12.1 0 0 1 10.6 13h2.8A12.1 12.1 0 0 1 12 18.8zM13.45 18a14.4 14.4 0 0 0 1.2-5h3.2A7.03 7.03 0 0 1 13.45 18z" />',
  },
  {
    key: "filter",
    label: "Filter",
    aliases: ["funnel", "refine", "segment"],
    markup: '<path d="M4 6h16l-6.5 7.25V19l-3-1.5v-4.25z" />',
  },
  {
    key: "dashboard",
    label: "Dashboard",
    aliases: ["overview", "summary", "kpi"],
    markup: '<path d="M4 5h7v6H4zm9 0h7v4h-7zM4 13h7v6H4zm9 2h7v4h-7z" />',
  },
  {
    key: "search",
    label: "Search",
    aliases: ["find", "lookup", "magnify"],
    markup: '<path d="M10.5 4.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm4.25 10.25L19.5 19.5" />',
  },
  {
    key: "sort",
    label: "Sort",
    aliases: ["order", "arrange", "rank"],
    markup: '<path d="M7 5v12m0 0-3-3m3 3 3-3M17 19V7m0 0-3 3m3-3 3 3" />',
  },
  {
    key: "email",
    label: "Email",
    aliases: ["mail", "inbox", "message"],
    markup: '<path d="M4 7.5h16v9H4zm1.5.5 6.5 5 6.5-5" />',
  },
  {
    key: "notification",
    label: "Notification",
    aliases: ["alert", "bell", "reminder"],
    markup: '<path d="M12 4.5a4 4 0 0 1 4 4v2.5c0 .9.3 1.78.86 2.5L18 15.5H6l1.14-2c.56-.72.86-1.6.86-2.5V8.5a4 4 0 0 1 4-4zm-1.75 13a1.75 1.75 0 0 0 3.5 0" />',
  },
  {
    key: "help",
    label: "Help",
    aliases: ["question", "support", "faq"],
    markup: '<path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zm-2.25 6a2.25 2.25 0 1 1 3.85 1.6c-.66.65-1.6 1.14-1.6 2.4m0 3h.01" />',
  },
  {
    key: "settings",
    label: "Settings",
    aliases: ["preferences", "gear", "configuration"],
    markup: '<path d="m12 3 1.05 2.2 2.43.35.7 2.35 2.22 1.1-.42 2.42 1.52 1.92-1.52 1.92.42 2.42-2.22 1.1-.7 2.35-2.43.35L12 21l-1.05-2.2-2.43-.35-.7-2.35-2.22-1.1.42-2.42L4.5 11.5l1.52-1.92-.42-2.42 2.22-1.1.7-2.35 2.43-.35zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />',
  },
  {
    key: "users",
    label: "Users",
    aliases: ["team", "members", "people"],
    markup: '<path d="M9 6.25a2.75 2.75 0 1 1-2.75 2.75A2.75 2.75 0 0 1 9 6.25zm6 1a2.25 2.25 0 1 1-2.25 2.25A2.25 2.25 0 0 1 15 7.25zM5.5 18a3.75 3.75 0 0 1 7 0m1.75-.5a3 3 0 0 1 4.25-.25c.33.2.64.45.92.75" />',
  },
  {
    key: "building",
    label: "Building",
    aliases: ["company", "office", "organization"],
    markup: '<path d="M5 20V6.5A1.5 1.5 0 0 1 6.5 5H14v15m0 0h5V9.5A1.5 1.5 0 0 0 17.5 8H14m-5-1v2m0 3v2m0 3v2m4-9v2m0 3v2m0 3v2" />',
  },
  {
    key: "building-block",
    label: "Building Block",
    aliases: ["block", "cube", "module", "component"],
    markup: '<path d="m12 3.5 4.75 2.75v5.5L12 14.5 7.25 11.75v-5.5zm0 2.31-2.75 1.6v3.18l2.75 1.6 2.75-1.6V7.41zm-7 9 4.75-2.75v5.5L5 20.31l-4-2.31v-4.5zm14-2.75 4 2.31V18L19 20.31l-4.75-2.75v-5.5z" />',
  },
  {
    key: "brick-wall",
    label: "Brick Wall",
    aliases: ["bricks", "masonry", "wall", "foundation"],
    markup: '<path d="M4 6.5h7v4H4zm9 0h7v4h-7zM2 13h7v4H2zm9 0h7v4h-7zm-4.5 0h3v4h-3z" />',
  },
  {
    key: "lego",
    label: "Lego",
    aliases: ["toy brick", "stud block", "snap brick", "construction toy"],
    markup: '<path d="M7.5 8.5h9A1.5 1.5 0 0 1 18 10v8.5H6V10a1.5 1.5 0 0 1 1.5-1.5zm1.25-3h2.5v2h-2.5zm4 0h2.5v2h-2.5zm-3.75 6v4m6-4v4M6 13.5h12" />',
  },
  {
    key: "jigsaw",
    label: "Jigsaw",
    aliases: ["interlock", "connector", "piece", "fit"],
    markup: '<path d="M9 4.5h3.25a1.75 1.75 0 1 1 3.5 0H19v4.25a1.75 1.75 0 1 0 0 3.5V16H14.75a1.75 1.75 0 1 1-3.5 0H7V11.75a1.75 1.75 0 1 0 0-3.5V4.5z" />',
  },
  {
    key: "puzzle",
    label: "Puzzle",
    aliases: ["brain teaser", "problem", "solution", "assembly"],
    markup: '<path d="M8 5h3.25a1.75 1.75 0 1 1 3.5 0H18a1 1 0 0 1 1 1v3.25a1.75 1.75 0 1 0 0 3.5V16a1 1 0 0 1-1 1h-3.25a1.75 1.75 0 1 1-3.5 0H8a1 1 0 0 1-1-1v-3.25a1.75 1.75 0 1 0 0-3.5V6a1 1 0 0 1 1-1z" />',
  },
  {
    key: "lock",
    label: "Lock",
    aliases: ["private", "secure", "restricted"],
    markup: '<path d="M8 10V8a4 4 0 1 1 8 0v2m-9 0h10v9H7zm5 3v2" />',
  },
  {
    key: "key",
    label: "Key",
    aliases: ["credential", "access", "secret"],
    markup: '<path d="M14 8.5a3.5 3.5 0 1 1-1.03 2.47L5 19h3v-2h2v-2h2l1.22-1.22A3.49 3.49 0 0 1 14 8.5z" />',
  },
  {
    key: "eye",
    label: "Eye",
    aliases: ["view", "visible", "preview"],
    markup: '<path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12zm9.5-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />',
  },
  {
    key: "eye-off",
    label: "Eye Off",
    aliases: ["hidden", "masked", "invisible"],
    markup: '<path d="M4 4 20 20M9.6 9.6A2.5 2.5 0 0 0 12 14.5c.7 0 1.33-.29 1.79-.75M6.2 6.3A13.5 13.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a18.7 18.7 0 0 1-4 4.41M9.03 17.95c.95.35 1.93.55 2.97.55 6 0 9.5-6.5 9.5-6.5a18.34 18.34 0 0 0-2.76-3.62M2.5 12A18.3 18.3 0 0 1 5.66 8.2" />',
  },
  {
    key: "analytics",
    label: "Analytics",
    aliases: ["insights", "metrics", "reporting"],
    markup: '<path d="M5 18h14M7 16V9m5 7V6m5 10v-4" />',
  },
  {
    key: "chart-bar",
    label: "Chart Bar",
    aliases: ["bars", "counts", "statistics"],
    markup: '<path d="M5 19h14M7 19v-5m5 5V8m5 11V5" />',
  },
  {
    key: "chart-line",
    label: "Chart Line",
    aliases: ["trend", "growth", "timeseries"],
    markup: '<path d="M5 18h14M6.5 14.5 10 11l3 2 4.5-5" />',
  },
  {
    key: "folder",
    label: "Folder",
    aliases: ["directory", "collection", "files"],
    markup: '<path d="M3.5 7.5h6l1.5 2H20v7.5A1.5 1.5 0 0 1 18.5 18.5h-13A1.5 1.5 0 0 1 4 17V9A1.5 1.5 0 0 1 5.5 7.5z" />',
  },
  {
    key: "database",
    label: "Database",
    aliases: ["storage", "data", "persistence"],
    markup: '<path d="M12 5c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zm8 3v8c0 1.66-3.58 3-8 3s-8-1.34-8-3V8m16 4c0 1.66-3.58 3-8 3s-8-1.34-8-3" />',
  },
  {
    key: "integration",
    label: "Integration",
    aliases: ["connect", "sync", "external"],
    markup: '<path d="M8 8h8m-5.5 8h-2A2.5 2.5 0 0 1 6 13.5v-1A2.5 2.5 0 0 1 8.5 10h2m3-2h2A2.5 2.5 0 0 1 18 10.5v1a2.5 2.5 0 0 1-2.5 2.5h-2" />',
  },
  {
    key: "code",
    label: "Code",
    aliases: ["developer", "api", "technical"],
    markup: '<path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 6.5l-3 11" />',
  },
  {
    key: "triangle",
    label: "Explore",
    aliases: ["triangle", "warning", "explore"],
    markup: '<path d="M12 4 20 20H4z" />',
  },
  {
    key: "panel",
    label: "Panel",
    aliases: ["window", "drawer", "overlay"],
    markup: '<path d="M4 5h16v4H4zm0 6h16v8H4z" />',
  },
  {
    key: "form",
    label: "Form",
    aliases: ["campaign", "editor", "template"],
    markup: '<path d="M6 4h12v16H6zm2 3v2h8V7zm0 4v2h8v-2zm0 4v2h5v-2z" />',
  },
  {
    key: "message",
    label: "Message",
    aliases: ["comment", "chat", "campaign"],
    markup: '<path d="M6 4h12a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 1-2.56 1.06l-2.88-2.88a1.5 1.5 0 0 0-1.06-.44H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1.5 4.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5zm0 3.75a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z" />',
  },
  {
    key: "calendar",
    label: "Calendar",
    aliases: ["date", "schedule", "launch"],
    markup: '<path d="M7 3.5v3M17 3.5v3M4.5 8.5h15M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v9.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V8A1.5 1.5 0 0 1 6 6.5Z" />',
  },
  {
    key: "clock",
    label: "Clock",
    aliases: ["time", "hour", "minute"],
    markup: '<path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75Zm.75 4.5h-1.5v5.1l3.65 2.2.78-1.28-2.93-1.77Z" />',
  },
  {
    key: "hierarchy",
    label: "Hierarchy",
    aliases: ["tree", "structure", "nodes"],
    markup: '<path d="M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z" />',
  },
  {
    key: "browser",
    label: "Browser",
    aliases: ["window", "screen", "frame"],
    markup: '<path d="M4 6h16v12H4zm3 3v6h10V9z" />',
  },
  {
    key: "layout",
    label: "Layout",
    aliases: ["navigation", "shell", "sections"],
    markup: '<path d="M4 5h16v4H4zm0 6h10v3H4zm12 0h4v3h-4zM4 16h16v3H4z" />',
  },
  {
    key: "row",
    label: "Sub Nav Row",
    aliases: ["sub nav", "row", "header"],
    markup: '<path d="M4 5h16v3H4zm0 6h16v8H4zm4 2h8v4H8z" />',
  },
  {
    key: "split",
    label: "Split View",
    aliases: ["split", "columns", "detail"],
    markup: '<path d="M3 5h8v14H3zm10 0h8v14h-8zm1.5 2v10h5V7z" />',
  },
  {
    key: "record",
    label: "Record Panel",
    aliases: ["record", "detail", "card"],
    markup: '<path d="M5 5h14v8H5zm0 6h14v8H5zm3 2v4h8v-4z" />',
  },
  {
    key: "drawer",
    label: "Drawer",
    aliases: ["side panel", "picker", "slideout"],
    markup: '<path d="M4 5h16v14H8l-4 3V5Zm4 4h8v2H8Zm0 4h8v2H8Z" />',
  },
  {
    key: "workspace",
    label: "Workspace",
    aliases: ["product", "app", "platform"],
    markup: '<path d="M4 20.25V6.75a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v13.5h2V3.75a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 20 3.75v16.5h.75a.75.75 0 0 1 0 1.5H3.25a.75.75 0 0 1 0-1.5zm3-11.5v2h2v-2zm0 4.5v2h2v-2zm4-4.5v2h2v-2zm0 4.5v2h2v-2z" />',
  },
  {
    key: "user",
    label: "User",
    aliases: ["person", "profile", "member"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5z" />',
  },
  {
    key: "secure-user",
    label: "Secure User",
    aliases: ["protected user", "verified user", "trusted user"],
    markup: '<path d="M10 4.75a3.25 3.25 0 1 1-3.25 3.25A3.25 3.25 0 0 1 10 4.75zm-4.1 13a4.4 4.4 0 0 1 8.2 0M15.75 5.5l4.25 1.2v3.4c0 2.8-1.8 5.25-4.25 6.4-2.45-1.15-4.25-3.6-4.25-6.4V6.7zm-1 5.7 1.1 1.1 2.6-2.6" />',
  },
  {
    key: "super-user",
    label: "Super User",
    aliases: ["power user", "advanced user", "elevated user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm6.2-8.7.6 1.2 1.33.2-.96.93.23 1.32-1.2-.63-1.2.63.23-1.32-.96-.93 1.33-.2z" />',
  },
  {
    key: "normal-user",
    label: "Normal User",
    aliases: ["standard user", "basic user", "regular user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zM8.5 17.25h7" />',
  },
  {
    key: "admin",
    label: "Admin Shield",
    aliases: ["operator", "admin", "protected"],
    markup: '<path d="M12 2.75 5.5 5v6.15c0 4.34 2.76 8.39 6.5 10.1 3.74-1.71 6.5-5.76 6.5-10.1V5zm0 4.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 6.85zm3.55 8.92a5.04 5.04 0 0 1-7.1 0 4.2 4.2 0 0 1 7.1 0z" />',
  },
  {
    key: "administrator",
    label: "Administrator",
    aliases: ["system admin", "platform admin", "admin user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm6.4-7.9.58 1.18 1.3.19-.94.92.22 1.28-1.16-.61-1.16.61.22-1.28-.94-.92 1.3-.19zm0 9.8.58 1.18 1.3.19-.94.92.22 1.28-1.16-.61-1.16.61.22-1.28-.94-.92 1.3-.19z" />',
  },
  {
    key: "leader",
    label: "Leader",
    aliases: ["manager", "owner", "team lead"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm-3.5-8.6L10.2 7l1.8-1.1L13.8 7l1.7-2.1" />',
  },
  {
    key: "tenant",
    label: "Tenant",
    aliases: ["organization", "workspace member", "account"],
    markup: '<path d="M12 3.25a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm-4.9 16.5a5.45 5.45 0 0 1 9.8-3.31V20H7.95A1.5 1.5 0 0 1 7.1 19.75zm11.65-7 1.05 2.13 2.35.34-1.7 1.66.4 2.34-2.1-1.11-2.1 1.11.4-2.34-1.7-1.66 2.35-.34z" />',
  },
  {
    key: "monitor",
    label: "Monitor",
    aliases: ["display", "screen", "preview"],
    markup: '<path d="M4.75 5.25h14.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H13.5l.9 2h2.35a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1 0-1.5H9.6l.9-2H4.75a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5zm0 1.5v8.5h14.5v-8.5zm7.25 2a2.5 2.5 0 1 1-2.5 2.5 2.5 2.5 0 0 1 2.5-2.5z" />',
  },
  {
    key: "checklist",
    label: "Checklist",
    aliases: ["choice group", "steps", "tasks"],
    markup: '<path d="M5 7.5h14v2H5zm0 7h14v2H5zm2.5-3.5A1.75 1.75 0 1 0 7.5 7.5a1.75 1.75 0 0 0 0 3.5Zm0 7A1.75 1.75 0 1 0 7.5 14.5a1.75 1.75 0 0 0 0 3.5Z" />',
  },
  {
    key: "accessibility",
    label: "Accessibility",
    aliases: ["inclusive", "assistive", "a11y"],
    markup: '<path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75zm0 3.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 5.85zm0 11.55a5.4 5.4 0 0 1-4.19-1.97 4.87 4.87 0 0 1 8.38 0A5.4 5.4 0 0 1 12 17.4z" />',
  },
];
const designSystemIconMarkupByKey = Object.fromEntries(
  designSystemIconDefinitions.map((icon) => [icon.key, icon.markup]),
);

function normalizeFormTimeValue(value) {
  const [hours = "00", minutes = "00"] = String(value ?? "").split(":");
  const normalizedHour = formTimeHourOptions.includes(hours) ? hours : "00";
  const minuteNumber = Number(minutes);
  const normalizedMinute = Number.isFinite(minuteNumber)
    ? String(Math.min(55, Math.max(0, Math.round(minuteNumber / 5) * 5))).padStart(2, "0")
    : "00";
  return `${normalizedHour}:${normalizedMinute}`;
}

function syncFormPickerOverlayState() {
  const activePicker = document.querySelector(
    '.form-page-shell[data-form-mobile-view="true"] .form-date-menu:not(.hidden), .form-page-shell[data-form-mobile-view="true"] .form-time-menu:not(.hidden)',
  );

  const canonicalRenderSurface = activePicker instanceof HTMLElement
    ? activePicker.closest('body[data-date-picker-surface="canonical"], body[data-time-picker-surface="canonical"]')
    : null;

  if (canonicalRenderSurface) {
    delete document.documentElement.dataset.formPickerOverlayOpen;
    return;
  }

  if (activePicker) {
    document.documentElement.dataset.formPickerOverlayOpen = "true";
    return;
  }

  delete document.documentElement.dataset.formPickerOverlayOpen;
}

function getDesignSystemIconRecord(iconKey) {
  return designSystemIconDefinitions.find((icon) => icon.key === iconKey) ?? designSystemIconDefinitions[0];
}

function renderDesignSystemIconSvg(iconKey) {
  const iconMarkup = designSystemIconMarkupByKey[iconKey] ?? designSystemIconMarkupByKey.grid;
  return `<svg viewBox="0 0 24 24" focusable="false">${iconMarkup}</svg>`;
}

function closeFormSelectRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-select-button]");
  const listbox = root.querySelector("[data-form-select-listbox]");

  if (!(trigger instanceof HTMLButtonElement) || !(listbox instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  listbox.classList.add("hidden");
}

function closeFormIconGridRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-icon-grid-button]");
  const panel = root.querySelector("[data-form-icon-grid-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("aria-modal", "false");
}

function closeFormDrawerSelectRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-drawer-select-button]");
  const panel = root.querySelector("[data-form-drawer-select-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("aria-modal", "false");
}

function closeFormTimePickerRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-time-button]");
  const panel = root.querySelector("[data-form-time-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
}

function closeFormDatePickerRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-date-button]");
  const panel = root.querySelector("[data-form-date-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
}

function closeUnrelatedFormSurfaces({ preservedRoots = [] } = {}) {
  const preserved = new Set(
    preservedRoots.filter((root) => root instanceof HTMLElement),
  );

  for (const root of formSelectRoots) {
    if (root instanceof HTMLElement && !preserved.has(root)) {
      closeFormSelectRoot(root);
    }
  }

  for (const root of formIconGridRoots) {
    if (root instanceof HTMLElement && !preserved.has(root)) {
      closeFormIconGridRoot(root);
    }
  }

  for (const root of formDrawerSelectRoots) {
    if (root instanceof HTMLElement && !preserved.has(root)) {
      closeFormDrawerSelectRoot(root);
    }
  }

  for (const root of formTimePickerRoots) {
    if (root instanceof HTMLElement && !preserved.has(root)) {
      closeFormTimePickerRoot(root);
    }
  }

  for (const root of formDatePickerRoots) {
    if (root instanceof HTMLElement && !preserved.has(root)) {
      closeFormDatePickerRoot(root);
    }
  }

  syncFormPickerOverlayState();
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/design-system";
  }

  const trimmed = pathname.replace(/\/+$/g, "");
  return trimmed === "" ? "/design-system" : trimmed;
}

const designSystemPrimaryNavItems = [
  { href: "/design-system", label: "Overview" },
  { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
  { href: "/design-system/canonicals", label: "Canonicals" },
];

const designSystemPrimaryNavOrderIndex = new Map(
  designSystemPrimaryNavItems.map((item, index) => [item.href, index]),
);

const designSystemPrimaryNavItemByHref = new Map(
  designSystemPrimaryNavItems.map((item) => [item.href, item]),
);

const designSystemBreadcrumbChains = new Map([
  ["/design-system", [
    { href: "/design-system", label: "Home" },
  ]],
  ["/design-system/components", [
    { href: "/design-system/components", label: "Home" },
  ]],
  ["/design-system/patterns", [
    { href: "/design-system/patterns", label: "Home" },
  ]],
  ["/design-system/templates", [
    { href: "/design-system/templates", label: "Home" },
  ]],
  ["/design-system/canonicals", [
    { href: "/design-system", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
  ]],
  ["/design-system/components/top-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals/top-nav", label: "Top Nav" },
    { href: "/design-system/components/top-nav", label: "Render" },
  ]],
  ["/design-system/components/sub-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals/sub-nav", label: "Sub Nav" },
    { href: "/design-system/components/sub-nav", label: "Render" },
  ]],
  ["/design-system/components/context-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals/context-nav", label: "Context Nav" },
    { href: "/design-system/components/context-nav", label: "Render" },
  ]],
  ["/design-system/components/list-record-card", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonical-renderings/list-record-card", label: "List Record Card" },
    { href: "/design-system/components/list-record-card", label: "Render" },
  ]],
  ["/design-system/components/list-detail-panel", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings/list-detail-panel", label: "List Detail Panel" },
    { href: "/design-system/components/list-detail-panel", label: "Render" },
  ]],
  ["/design-system/components/list-detail-split-layout", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings/list-detail-split-layout", label: "List Detail Split Layout" },
    { href: "/design-system/components/list-detail-split-layout", label: "Render" },
  ]],
  ["/design-system/components/simple-select", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings/simple-select", label: "Simple Select" },
    { href: "/design-system/components/simple-select", label: "Render" },
  ]],
  ["/design-system/components/date-picker", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings/date-picker", label: "Date Picker" },
    { href: "/design-system/components/date-picker", label: "Render" },
  ]],
  ["/design-system/components/time-picker", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings/time-picker", label: "Time Picker" },
    { href: "/design-system/components/time-picker", label: "Render" },
  ]],
  ["/design-system/canonicals/top-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/top-nav", label: "Top Nav" },
  ]],
  ["/design-system/canonicals/sub-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/sub-nav", label: "Sub Nav" },
  ]],
  ["/design-system/canonicals/context-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/context-nav", label: "Context Nav" },
  ]],
  ["/design-system/canonicals/context-nav-drawer", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/context-nav-drawer", label: "Context-Nav Drawer" },
  ]],
  ["/design-system/canonicals/display-settings", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/display-settings", label: "Display Settings" },
  ]],
  ["/design-system/canonicals/async-activity-drawer", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/async-activity-drawer", label: "Async Activity Drawer" },
  ]],
  ["/design-system/canonicals/page-shell-banner", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/page-shell-banner", label: "Page-Shell Banner" },
  ]],
  ["/design-system/canonicals/hierarchy-tree", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/hierarchy-tree", label: "Hierarchy Tree" },
    { href: "/design-system/canonicals/hierarchy-tree", label: "Canonicals" },
  ]],
  ["/design-system/canonicals/list-record-card", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonical-renderings/list-record-card", label: "List Record Card" },
  ]],
  ["/design-system/canonicals/list-detail-panel", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonical-renderings/list-detail-panel", label: "List Detail Panel" },
  ]],
  ["/design-system/canonicals/list-detail-split-layout", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonical-renderings/list-detail-split-layout", label: "List Detail Split Layout" },
  ]],
  ["/design-system/canonicals/form-template", [
    { href: "/design-system/templates", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/form-template", label: "Form Template" },
  ]],
  ["/design-system/canonicals/simple-select", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/simple-select", label: "Simple Select" },
  ]],
  ["/design-system/canonicals/time-picker", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/time-picker", label: "Time Picker" },
  ]],
  ["/design-system/canonicals/date-picker", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/date-picker", label: "Date Picker" },
  ]],
  ["/design-system/canonicals/drawer-select", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/drawer-select", label: "Drawer Select" },
  ]],
  ["/design-system/canonicals/icon-grid", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/icon-grid", label: "Icon Grid" },
  ]],
  ["/design-system/canonicals/choice-group", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/choice-group", label: "Choice Group" },
  ]],
  ["/design-system/components/drawer-select", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
    { href: "/design-system/canonical-renderings/drawer-select", label: "Drawer Select" },
    { href: "/design-system/components/drawer-select", label: "Canonical Render" },
  ]],
  ["/design-system/components/icon-grid", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals", label: "Canonicals" },
    { href: "/design-system/canonicals/icon-grid", label: "Icon Grid" },
    { href: "/design-system/components/icon-grid", label: "Canonical Render" },
  ]],
  ["/design-system/components/choice-group", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
    { href: "/design-system/canonical-renderings/choice-group", label: "Choice Group" },
    { href: "/design-system/components/choice-group", label: "Canonical Render" },
  ]],
  ["/design-system/exploration/top-nav", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/components/top-nav", label: "Top Nav" },
    { href: "/design-system/exploration/top-nav", label: "Exploration" },
  ]],
  ["/design-system/exploration/sub-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/sub-nav-row", label: "Sub-Nav Row" },
    { href: "/design-system/exploration/sub-nav", label: "Exploration" },
  ]],
  ["/design-system/exploration/context-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/context-nav", label: "Context Nav" },
    { href: "/design-system/exploration/context-nav", label: "Exploration" },
  ]],
  ["/design-system/patterns/navigation-shell", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/navigation-shell", label: "Navigation Shell" },
  ]],
  ["/design-system/patterns/sub-nav-row", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/sub-nav-row", label: "Sub-Nav Row" },
  ]],
  ["/design-system/patterns/breadcrumb", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/breadcrumb", label: "Breadcrumb" },
  ]],
  ["/design-system/patterns/search-shell", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/search-shell", label: "Search Shell" },
  ]],
  ["/design-system/patterns/context-nav", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/context-nav", label: "Context Nav" },
  ]],
  ["/design-system/patterns/drawer", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/drawer", label: "Drawer" },
  ]],
  ["/design-system/patterns/display-settings", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/display-settings", label: "Display Settings" },
  ]],
  ["/design-system/patterns/list-record-card", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/list-record-card", label: "List Record Card" },
  ]],
  ["/design-system/patterns/list-detail-panel", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/list-detail-panel", label: "List Detail Panel" },
  ]],
  ["/design-system/patterns/list-detail-split-layout", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/list-detail-split-layout", label: "List Detail Split Layout" },
  ]],
  ["/design-system/templates/page-shell", [
    { href: "/design-system/templates", label: "Home" },
    { href: "/design-system/templates/page-shell", label: "Page Shell" },
  ]],
  ["/design-system/templates/list-page", [
    { href: "/design-system/templates", label: "Home" },
    { href: "/design-system/templates/list-page", label: "List Page" },
  ]],
  ["/design-system/templates/table-page", [
    { href: "/design-system/templates", label: "Home" },
    { href: "/design-system/templates/table-page", label: "Table Page" },
  ]],
  ["/design-system/templates/form", [
    { href: "/design-system/templates", label: "Home" },
    { href: "/design-system/templates/form", label: "Form" },
  ]],
  ["/design-system/components/page-shell-banner", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals/page-shell-banner", label: "Page-Shell Banner Canonicals" },
    { href: "/design-system/components/page-shell-banner", label: "Canonical Render" },
  ]],
  ["/design-system/components/async-activity-drawer", [
    { href: "/design-system/components", label: "Home" },
    { href: "/design-system/canonicals/async-activity-drawer", label: "Async Activity Drawer Canonicals" },
    { href: "/design-system/components/async-activity-drawer", label: "Canonical Render" },
  ]],
  ["/design-system/patterns/hierarchy-tree/render", [
    { href: "/design-system/patterns", label: "Home" },
    { href: "/design-system/patterns/hierarchy-tree", label: "Hierarchy Tree" },
    { href: "/design-system/canonicals/hierarchy-tree", label: "Canonicals" },
    { href: "/design-system/patterns/hierarchy-tree/render", label: "Render" },
  ]],
]);

function resolveBreadcrumbChain(pathname) {
  const normalizedPath = normalizePathname(pathname);
  const generatedCanonicalRenderingChain = resolveGeneratedCanonicalRenderingBreadcrumbChain(normalizedPath);
  if (generatedCanonicalRenderingChain) {
    return generatedCanonicalRenderingChain;
  }

  return designSystemBreadcrumbChains.get(normalizedPath)
    ?? designSystemBreadcrumbChains.get("/design-system");
}

function humanizeGeneratedCanonicalFamilyKey(familyKey) {
  return familyKey
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function resolveGeneratedCanonicalRenderingBreadcrumbChain(pathname) {
  if (!pathname.startsWith("/design-system/canonical-renderings")) {
    return null;
  }

  const segments = pathname
    .replace(/^\/design-system\/canonical-renderings\/?/, "")
    .split("/")
    .filter(Boolean);

  const chain = [
    { href: "/design-system", label: "Home" },
    { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
  ];

  if (segments.length === 0) {
    return chain;
  }

  const [familyKey, referenceId] = segments;
  const familyHref = `/design-system/canonical-renderings/${familyKey}`;
  chain.push({
    href: familyHref,
    label: humanizeGeneratedCanonicalFamilyKey(familyKey),
  });

  if (referenceId) {
    chain.push({
      href: `${familyHref}/${referenceId}`,
      label: referenceId,
    });
  }

  return chain;
}

function renderBreadcrumbMenuItems(items, currentLabel) {
  return items.map((item, index) => {
    const isCurrent = index === items.length - 1 && item.label === currentLabel;
    if (isCurrent) {
      return `<span class="menu-item breadcrumb-structure-current" aria-current="page">${escapeHtml(item.label)}</span>`;
    }

    return `<a class="menu-item" href="${escapeHtml(item.href)}" role="menuitem">${escapeHtml(item.label)}</a>`;
  }).join("");
}

function buildBreadcrumbMarkup(chain) {
  const current = chain[chain.length - 1];
  const isSingleItem = chain.length === 1;
  const collapsedItems = chain.length >= 4 ? chain.slice(1, -2) : [];
  const pageMinusOne = chain.length >= 3 ? chain[chain.length - 2] : null;
  const compactItems = chain.length > 1 ? chain.slice(0, -1) : [];
  const compactMenuItems = [...compactItems, { href: current.href, label: current.label }];
  const hasCollapsed = collapsedItems.length > 0;
  const hasPageMinusOne = Boolean(pageMinusOne);
  const collapsedMenu = renderBreadcrumbMenuItems(collapsedItems, current.label);
  const compactMenu = renderBreadcrumbMenuItems(compactMenuItems, current.label);

  return `
    <div id="breadcrumb-compact" class="breadcrumb-compact hidden">
      <button
        id="breadcrumb-compact-button"
        class="breadcrumb-collapse-button breadcrumb-compact-button"
        type="button"
        aria-expanded="false"
        aria-controls="breadcrumb-compact-menu"
        aria-label="Open page structure menu"
      >
        <span class="breadcrumb-compact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6 4.5a1.5 1.5 0 1 1 0 3H5v3h5.5a1.5 1.5 0 1 1 0 3H5v5h3.5a1.5 1.5 0 1 1 0 3H3.5a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 3.5 4.5zm11 0a4 4 0 0 1 0 8h-2v-3h2a1 1 0 1 0 0-2h-2v-3zm-2 9h3a4 4 0 1 1 0 8h-3v-3h3a1 1 0 1 0 0-2h-3z" />
          </svg>
        </span>
      </button>
      <div
        id="breadcrumb-compact-menu"
        class="breadcrumb-collapse-menu hidden"
        role="menu"
        aria-labelledby="breadcrumb-compact-button"
      >
        ${compactMenu}
      </div>
    </div>
    <ol id="breadcrumb-list" class="breadcrumb-list">
      <li id="breadcrumb-home-item">
        <a id="breadcrumb-home-link" class="breadcrumb-button" href="${escapeHtml(chain[0].href)}">${escapeHtml(chain[0].label)}</a>
      </li>
      <li id="breadcrumb-separator-before-collapsed" class="${hasCollapsed ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-collapsed-item" class="breadcrumb-collapsed ${hasCollapsed ? "" : "hidden"}">
        <button
          id="breadcrumb-collapse-button"
          class="breadcrumb-collapse-button"
          type="button"
          aria-expanded="false"
          aria-controls="breadcrumb-collapse-menu"
          aria-label="Open collapsed breadcrumb menu"
        >
          ...
        </button>
        <div
          id="breadcrumb-collapse-menu"
          class="breadcrumb-collapse-menu hidden"
          role="menu"
          aria-labelledby="breadcrumb-collapse-button"
        >
          ${collapsedMenu}
        </div>
      </li>
      <li id="breadcrumb-separator-before-page-minus-one" class="${hasPageMinusOne ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-page-minus-one-item" class="${hasPageMinusOne ? "" : "hidden"}">
        <a
          id="breadcrumb-page-minus-one-link"
          class="breadcrumb-button"
          href="${hasPageMinusOne ? escapeHtml(pageMinusOne.href) : "#"}"
        >${hasPageMinusOne ? escapeHtml(pageMinusOne.label) : ""}</a>
      </li>
      <li id="breadcrumb-separator-before-current" class="${chain.length > 1 ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-current-item" class="${isSingleItem ? "hidden" : ""}">
        <span id="breadcrumb-current-label" class="breadcrumb-button breadcrumb-current" aria-current="page">${escapeHtml(current.label)}</span>
      </li>
    </ol>
  `;
}

function normalizeTemplatesRouteLabels(root = document) {
  for (const link of root.querySelectorAll('a[href="/design-system/templates"]')) {
    const contextNavLabel = link.querySelector(".context-nav-label");
    const profileMetaLabel = link.querySelector(".profile-meta strong");
    const label = contextNavLabel ?? profileMetaLabel;

    if (label instanceof HTMLElement) {
      label.textContent = "Templates";
    } else if (link.childElementCount === 0) {
      setTextContent(link, "Templates");
    }

    if (link instanceof HTMLElement && link.dataset.tooltip === "Pages") {
      link.dataset.tooltip = "Templates";
    }
  }
}

function normalizeShellProfileLabels(root = document) {
  const shellProfileLabel = root.querySelector(".design-system-shell > .top-nav .profile-meta strong");
  if (shellProfileLabel instanceof HTMLElement) {
    shellProfileLabel.textContent = "Profile";
  }

  const mobileProfileButton = root.querySelector(".design-system-shell > .mobile-nav-menu .mobile-profile-item");
  if (mobileProfileButton instanceof HTMLElement) {
    mobileProfileButton.textContent = "Profile";
  }
}

function normalizeTopNavUtilityPresence(root = document) {
  for (const topNav of root.querySelectorAll(".design-system-shell > .top-nav")) {
    if (!(topNav instanceof HTMLElement)) {
      continue;
    }

    const hasUtilities = topNav.querySelector(":scope > .nav-utilities") instanceof HTMLElement;
    topNav.classList.toggle("top-nav-no-utilities", !hasUtilities);
  }
}

function resolvePrimaryNavHomeHref(pathname) {
  const chain = resolveBreadcrumbChain(pathname);
  return chain[0]?.href ?? "/design-system";
}

function getAllowedPrimaryNavHref(href, items = designSystemPrimaryNavItems) {
  return items.some((item) => item.href === href) ? href : null;
}

function getPrimaryNavHrefFromLink(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return null;
  }

  const href = normalizePathname(link.getAttribute("href") ?? "");
  return getAllowedPrimaryNavHref(href);
}

function resolvePrimaryNavActiveHref(pathname, items, fallbackHref) {
  const normalizedPath = normalizePathname(pathname);
  const exactHref = getAllowedPrimaryNavHref(normalizedPath, items);
  if (exactHref) {
    return exactHref;
  }

  const prefixMatch = [...items]
    .filter((item) => normalizedPath.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0];

  return prefixMatch?.href ?? fallbackHref;
}

function getPreferredPrimaryNavHref(container, fallbackHref) {
  const activeLink = container.querySelector('a.nav-link[aria-current="page"], a.nav-link.active');
  const activeHref = getPrimaryNavHrefFromLink(activeLink);
  return activeHref ?? resolvePrimaryNavActiveHref(window.location.pathname, designSystemPrimaryNavItems, fallbackHref);
}

function buildPrimaryNavLinkMarkupFromItems(items, activeHref, { tooltipAnchors = false } = {}) {
  return items.map((item) => {
    const active = item.href === activeHref;
    const current = active ? ' aria-current="page"' : "";
    const activeClass = active ? " active" : "";
    const tooltipClass = tooltipAnchors ? " tooltip-anchor" : "";
    const tooltipAttribute = tooltipAnchors ? ` data-tooltip="${escapeHtml(item.label)}"` : "";
    return `<a class="nav-link${tooltipClass}${activeClass}" href="${escapeHtml(item.href)}"${current}${tooltipAttribute}>${escapeHtml(item.label)}</a>`;
  }).join("");
}

function buildPrimaryNavLinkMarkup(activeHref, { tooltipAnchors = false } = {}) {
  return buildPrimaryNavLinkMarkupFromItems(designSystemPrimaryNavItems, activeHref, { tooltipAnchors });
}

function buildPrimaryNavMenuMarkupFromItems(items, activeHref) {
  return items.map((item) => {
    const active = item.href === activeHref;
    if (active) {
      return `<span class="menu-item breadcrumb-structure-current" aria-current="page">${escapeHtml(item.label)}</span>`;
    }
    return `<a class="menu-item" href="${escapeHtml(item.href)}" role="menuitem">${escapeHtml(item.label)}</a>`;
  }).join("");
}

function buildPrimaryNavMenuMarkup(activeHref) {
  return buildPrimaryNavMenuMarkupFromItems(designSystemPrimaryNavItems, activeHref);
}

function ensureElementId(element, id) {
  if (element instanceof HTMLElement && !element.id) {
    element.id = id;
  }
}

function normalizePrimaryNavOverflowStructure(primaryNav) {
  if (!(primaryNav instanceof HTMLElement)) {
    return;
  }

  if (primaryNav.closest("#top-nav-preview-frame, .context-nav-preview-shell")) {
    return;
  }

  let overflow = primaryNav.querySelector(":scope > .primary-nav-overflow");
  if (!(overflow instanceof HTMLElement)) {
    primaryNav.insertAdjacentHTML(
      "beforeend",
      `
        <div id="primary-nav-overflow" class="primary-nav-overflow hidden">
          <button
            id="primary-nav-overflow-button"
            class="nav-link primary-nav-overflow-button"
            type="button"
            aria-expanded="false"
            aria-controls="primary-nav-overflow-menu"
          >
            More
          </button>
          <div
            id="primary-nav-overflow-menu"
            class="primary-nav-overflow-menu hidden"
            role="menu"
            aria-labelledby="primary-nav-overflow-button"
          ></div>
        </div>
      `,
    );
    overflow = primaryNav.querySelector(":scope > .primary-nav-overflow");
  }

  if (!(overflow instanceof HTMLElement)) {
    return;
  }

  ensureElementId(overflow, "primary-nav-overflow");

  let button = overflow.querySelector(":scope > .primary-nav-overflow-button");
  if (!(button instanceof HTMLElement)) {
    button = overflow.querySelector(".primary-nav-overflow-button");
  }

  if (!(button instanceof HTMLElement)) {
    overflow.insertAdjacentHTML(
      "afterbegin",
      `
        <button
          id="primary-nav-overflow-button"
          class="nav-link primary-nav-overflow-button"
          type="button"
          aria-expanded="false"
          aria-controls="primary-nav-overflow-menu"
        >
          More
        </button>
      `,
    );
    button = overflow.querySelector(":scope > .primary-nav-overflow-button");
  }

  let menu = overflow.querySelector(":scope > .primary-nav-overflow-menu");
  if (!(menu instanceof HTMLElement)) {
    menu = overflow.querySelector(".primary-nav-overflow-menu");
  }

  if (!(menu instanceof HTMLElement)) {
    overflow.insertAdjacentHTML(
      "beforeend",
      `
        <div
          id="primary-nav-overflow-menu"
          class="primary-nav-overflow-menu hidden"
          role="menu"
          aria-labelledby="primary-nav-overflow-button"
        ></div>
      `,
    );
    menu = overflow.querySelector(":scope > .primary-nav-overflow-menu");
  }

  if (!(menu instanceof HTMLElement)) {
    return;
  }

  ensureElementId(button, "primary-nav-overflow-button");
  ensureElementId(menu, "primary-nav-overflow-menu");

  if (button?.parentElement !== overflow) {
    overflow.prepend(button);
  }

  if (menu.parentElement !== overflow) {
    overflow.append(menu);
  }

  const orphanMenuItems = Array.from(overflow.children).filter((child) => (
    child !== button
    && child !== menu
    && child.matches(".menu-item, [role='menuitem'], [aria-current='page']")
  ));

  for (const orphan of orphanMenuItems) {
    menu.append(orphan);
  }
}

function ensureDesignSystemShellScaffold(root = document) {
  const shell = root.querySelector(".design-system-shell");
  if (!(shell instanceof HTMLElement)) {
    return;
  }

  const topNav = shell.querySelector(":scope > .top-nav");
  if (!(topNav instanceof HTMLElement)) {
    return;
  }

  const activeHref = resolvePrimaryNavActiveHref(
    window.location.pathname,
    designSystemPrimaryNavItems,
    resolvePrimaryNavHomeHref(window.location.pathname),
  );
  const profileLabel =
    topNav.querySelector(".profile-meta strong")?.textContent?.trim()
    ?? "Profile";

  const primaryNav = topNav.querySelector(":scope > .primary-nav");
  if (primaryNav instanceof HTMLElement) {
    normalizePrimaryNavOverflowStructure(primaryNav);

    const primaryNavLinks = primaryNav.querySelector(":scope > .primary-nav-links");
    ensureElementId(primaryNavLinks, "primary-nav-links");

    normalizePrimaryNavOverflowStructure(primaryNav);
  }

  const mobileNavButton = topNav.querySelector(":scope > .mobile-nav-button");
  if (mobileNavButton instanceof HTMLButtonElement) {
    ensureElementId(mobileNavButton, "mobile-nav-button");
    mobileNavButton.setAttribute("aria-controls", "mobile-nav-menu");
  }

  const navUtilities = topNav.querySelector(":scope > .nav-utilities");
  const profileButton = navUtilities?.querySelector(":scope > .profile-button");
  if (profileButton instanceof HTMLButtonElement) {
    ensureElementId(profileButton, "profile-menu-button");
    profileButton.setAttribute("aria-controls", "profile-menu");

    let profileMenu = navUtilities?.querySelector(":scope > .profile-menu");
    if (!(profileMenu instanceof HTMLElement) && navUtilities instanceof HTMLElement) {
      navUtilities.insertAdjacentHTML(
        "beforeend",
        `
          <div
            id="profile-menu"
            class="profile-menu hidden"
            role="menu"
            aria-labelledby="profile-menu-button"
          >
            <button
              id="profile-language-button"
              class="menu-item menu-item-button"
              type="button"
              role="menuitem"
            >
              Language
            </button>
            <button id="close-profile-menu" class="menu-item menu-item-button" type="button" role="menuitem">
              Close menu
            </button>
          </div>
        `,
      );
      profileMenu = navUtilities.querySelector(":scope > .profile-menu");
    }

    if (profileMenu instanceof HTMLElement) {
      ensureElementId(profileMenu, "profile-menu");
      ensureElementId(profileMenu.querySelector('[id="profile-language-button"], #profile-language-button, button'), "profile-language-button");
      const closeButton = Array.from(profileMenu.querySelectorAll("button")).find(
        (button) => button.id === "close-profile-menu" || /close menu/i.test(button.textContent ?? ""),
      );
      ensureElementId(closeButton, "close-profile-menu");
    }
  }

  let mobileNavMenu = shell.querySelector(":scope > .mobile-nav-menu");
  if (!(mobileNavMenu instanceof HTMLElement)) {
    topNav.insertAdjacentHTML(
      "afterend",
      `
        <nav id="mobile-nav-menu" class="mobile-nav-menu hidden" aria-label="Mobile primary">
          ${buildPrimaryNavLinkMarkup(activeHref)}
          <div class="mobile-profile-group">
            <button
              id="mobile-profile-button"
              class="mobile-profile-item"
              type="button"
              aria-expanded="false"
              aria-controls="mobile-profile-menu"
            >
              ${escapeHtml(profileLabel)}
            </button>
            <div id="mobile-profile-menu" class="mobile-profile-menu hidden">
              <button id="mobile-language-button" class="mobile-subnav-link mobile-subnav-button" type="button">
                Language
              </button>
            </div>
          </div>
        </nav>
      `,
    );
    mobileNavMenu = shell.querySelector(":scope > .mobile-nav-menu");
  }

  if (mobileNavMenu instanceof HTMLElement) {
    ensureElementId(mobileNavMenu, "mobile-nav-menu");
    let mobileProfileGroup = mobileNavMenu.querySelector(":scope > .mobile-profile-group");
    if (!(mobileProfileGroup instanceof HTMLElement)) {
      mobileNavMenu.insertAdjacentHTML(
        "beforeend",
        `
          <div class="mobile-profile-group">
            <button
              id="mobile-profile-button"
              class="mobile-profile-item"
              type="button"
              aria-expanded="false"
              aria-controls="mobile-profile-menu"
            >
              ${escapeHtml(profileLabel)}
            </button>
            <div id="mobile-profile-menu" class="mobile-profile-menu hidden">
              <button id="mobile-language-button" class="mobile-subnav-link mobile-subnav-button" type="button">
                Language
              </button>
            </div>
          </div>
        `,
      );
      mobileProfileGroup = mobileNavMenu.querySelector(":scope > .mobile-profile-group");
    }

    if (mobileProfileGroup instanceof HTMLElement) {
      ensureElementId(mobileProfileGroup.querySelector(".mobile-profile-item"), "mobile-profile-button");
      ensureElementId(mobileProfileGroup.querySelector(".mobile-profile-menu"), "mobile-profile-menu");
      const mobileLanguageButton = Array.from(mobileProfileGroup.querySelectorAll("button")).find(
        (button) => button.id === "mobile-language-button" || /language/i.test(button.textContent ?? ""),
      );
      ensureElementId(mobileLanguageButton, "mobile-language-button");
    }
  }
}

function normalizePrimaryNav(root = document) {
  const fallbackHref = resolvePrimaryNavHomeHref(window.location.pathname);

  for (const primaryNav of root.querySelectorAll(".primary-nav")) {
    normalizePrimaryNavOverflowStructure(primaryNav);
  }

  for (const primaryNavLinksContainer of root.querySelectorAll(".primary-nav-links")) {
    if (!(primaryNavLinksContainer instanceof HTMLElement)) {
      continue;
    }

    if (primaryNavLinksContainer.closest("#top-nav-preview-frame, .context-nav-preview-shell")) {
      continue;
    }

    const tooltipAnchors = Boolean(primaryNavLinksContainer.querySelector(".tooltip-anchor"));
    const activeHref = getPreferredPrimaryNavHref(primaryNavLinksContainer, fallbackHref);
    primaryNavLinksContainer.innerHTML = buildPrimaryNavLinkMarkup(activeHref, { tooltipAnchors });
  }

  for (const primaryNavOverflowMenu of root.querySelectorAll(".primary-nav-overflow-menu")) {
    if (!(primaryNavOverflowMenu instanceof HTMLElement)) {
      continue;
    }

    if (primaryNavOverflowMenu.closest("#top-nav-preview-frame, .context-nav-preview-shell")) {
      continue;
    }

    const nav = primaryNavOverflowMenu.closest(".primary-nav");
    const navLinksContainer = nav?.querySelector(".primary-nav-links");
    const activeHref = navLinksContainer instanceof HTMLElement
      ? getPreferredPrimaryNavHref(navLinksContainer, fallbackHref)
      : fallbackHref;
    primaryNavOverflowMenu.innerHTML = buildPrimaryNavMenuMarkup(activeHref);
  }

  for (const mobileNavMenu of root.querySelectorAll(".mobile-nav-menu")) {
    if (!(mobileNavMenu instanceof HTMLElement)) {
      continue;
    }

    if (mobileNavMenu.closest("#top-nav-preview-frame, .context-nav-preview-shell")) {
      continue;
    }

    const tooltipAnchors = Boolean(mobileNavMenu.querySelector(".tooltip-anchor"));
    const activeHref = getPreferredPrimaryNavHref(mobileNavMenu, fallbackHref);
    const mobileProfileGroup = mobileNavMenu.querySelector(".mobile-profile-group");
    mobileNavMenu.querySelectorAll(":scope > a.nav-link").forEach((node) => node.remove());
    mobileNavMenu.insertAdjacentHTML("afterbegin", buildPrimaryNavLinkMarkup(activeHref, { tooltipAnchors }));
    if (mobileProfileGroup) {
      mobileNavMenu.append(mobileProfileGroup);
    }
  }
}

function flattenHierarchyPages(pages) {
  return pages.flatMap((page) => [page, ...flattenHierarchyPages(page.children ?? [])]);
}

function buildGovernedDesignSystemTopNavCandidates(tree) {
  const rootFamily = tree?.rootFamilies?.find((family) => family.rootFamilyId === "design-system");
  if (!rootFamily || !Array.isArray(rootFamily.modules)) {
    return [];
  }

  let fallbackOrder = 0;

  return rootFamily.modules.flatMap((module) =>
    flattenHierarchyPages(module.pages ?? [])
      .filter((page) => page?.parentPageId === null && typeof page?.resolvedFullRoutePath === "string")
      .map((page) => ({
        webAppPageId: page.webAppPageId,
        displayLabel: page.displayLabel,
        href: page.resolvedFullRoutePath,
        fallbackOrder: fallbackOrder++,
      })),
  );
}

function sortGovernedDesignSystemTopNavItems(items) {
  return [...items].sort((left, right) => {
    if (left.href === "/design-system" && right.href !== "/design-system") {
      return -1;
    }

    if (right.href === "/design-system" && left.href !== "/design-system") {
      return 1;
    }

    const leftOrder = typeof left.topNavOrder === "number" ? left.topNavOrder : Number.POSITIVE_INFINITY;
    const rightOrder = typeof right.topNavOrder === "number" ? right.topNavOrder : Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftIndex = designSystemPrimaryNavOrderIndex.get(left.href) ?? Number.POSITIVE_INFINITY;
    const rightIndex = designSystemPrimaryNavOrderIndex.get(right.href) ?? Number.POSITIVE_INFINITY;
    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    if (left.fallbackOrder !== right.fallbackOrder) {
      return left.fallbackOrder - right.fallbackOrder;
    }

    return left.displayLabel.localeCompare(right.displayLabel);
  });
}

function setHostPrimaryNavCollections(items) {
  const fallbackHref = resolvePrimaryNavHomeHref(window.location.pathname);
  const activeHref = resolvePrimaryNavActiveHref(window.location.pathname, items, fallbackHref);
  const hostPrimaryNavLinksContainer = designSystemShell?.querySelector(":scope > .top-nav .primary-nav-links");
  const hostPrimaryNavOverflowMenu = designSystemShell?.querySelector(":scope > .top-nav .primary-nav-overflow-menu");
  const hostMobileNavMenu = designSystemShell?.querySelector(":scope > .mobile-nav-menu");

  if (hostPrimaryNavLinksContainer instanceof HTMLElement) {
    const tooltipAnchors = Boolean(hostPrimaryNavLinksContainer.querySelector(".tooltip-anchor"));
    hostPrimaryNavLinksContainer.innerHTML = buildPrimaryNavLinkMarkupFromItems(items, activeHref, { tooltipAnchors });

    if (hostPrimaryNavLinksContainer === primaryNavLinksContainer) {
      primaryNavLinks.splice(
        0,
        primaryNavLinks.length,
        ...Array.from(hostPrimaryNavLinksContainer.querySelectorAll(".nav-link")),
      );
    }
  }

  if (hostPrimaryNavOverflowMenu instanceof HTMLElement) {
    hostPrimaryNavOverflowMenu.innerHTML = buildPrimaryNavMenuMarkupFromItems(items, activeHref);
  }

  if (hostMobileNavMenu instanceof HTMLElement) {
    const tooltipAnchors = Boolean(hostMobileNavMenu.querySelector(".tooltip-anchor"));
    const mobileProfileGroup = hostMobileNavMenu.querySelector(".mobile-profile-group");
    hostMobileNavMenu.querySelectorAll(":scope > a.nav-link").forEach((node) => node.remove());
    hostMobileNavMenu.insertAdjacentHTML(
      "afterbegin",
      buildPrimaryNavLinkMarkupFromItems(items, activeHref, { tooltipAnchors }),
    );
    if (mobileProfileGroup) {
      hostMobileNavMenu.append(mobileProfileGroup);
    }

    if (hostMobileNavMenu === mobileNavMenu) {
      mobileNavLinks.splice(
        0,
        mobileNavLinks.length,
        ...Array.from(hostMobileNavMenu.querySelectorAll(":scope > a.nav-link")),
      );
    }
  }
}

let governedTopNavRequestId = 0;

async function refreshGovernedPrimaryNav() {
  const requestId = ++governedTopNavRequestId;

  try {
    const response = await fetchJson("/v1/web-app-page-settings/public/design-system/top-nav");

    if (requestId !== governedTopNavRequestId) {
      return;
    }

    const nextItems = Array.isArray(response?.items)
      ? response.items.filter((item) => typeof item?.href === "string" && typeof item?.label === "string")
      : [];

    if (nextItems.length === 0) {
      return;
    }
    setHostPrimaryNavCollections(nextItems);
    updatePrimaryNavOverflow();
  } catch (_error) {
    if (requestId !== governedTopNavRequestId) {
      return;
    }
  }
}

function normalizeDesignSystemShellBeforeBinding() {
  ensureDesignSystemShellScaffold();
  normalizeTemplatesRouteLabels();
  normalizeShellProfileLabels();
  normalizeTopNavUtilityPresence();
  normalizePrimaryNav();

  const breadcrumbNav = document.querySelector(".breadcrumb-nav");
  if (!(breadcrumbNav instanceof HTMLElement)) {
    return;
  }

  const normalizedPath = normalizePathname(window.location.pathname);
  const chain = resolveBreadcrumbChain(normalizedPath);
  breadcrumbNav.innerHTML = buildBreadcrumbMarkup(chain);

  const preserveCanonicalFullTrail =
    normalizedPath.startsWith("/design-system/canonicals/")
    || normalizedPath.startsWith("/design-system/canonical-renderings/")
    || normalizedPath.startsWith("/design-system/patterns/hierarchy-tree/render")
    || (
      normalizedPath.startsWith("/design-system/components/")
      && normalizedPath !== "/design-system/components"
    );

  if (preserveCanonicalFullTrail) {
    breadcrumbNav.dataset.canonicalShellMode = "full-trail";
  } else {
    delete breadcrumbNav.dataset.canonicalShellMode;
  }
}

normalizeDesignSystemShellBeforeBinding();

const profileButton = document.getElementById("preview-profile-menu-button") ?? document.getElementById("profile-menu-button");
const profileMenu = document.getElementById("preview-profile-menu") ?? document.getElementById("profile-menu");
const profileLanguageButton = document.getElementById("preview-profile-language-button") ?? document.getElementById("profile-language-button");
const closeProfileMenuButton = document.getElementById("preview-close-profile-menu") ?? document.getElementById("close-profile-menu");
const brandLockup = document.querySelector("#top-nav-preview-frame .brand-lockup") ?? document.querySelector(".brand-lockup");
const primaryNav = document.querySelector("#top-nav-preview-frame .primary-nav") ?? document.querySelector(".primary-nav");
const primaryNavLinksContainer = document.getElementById("preview-primary-nav-links") ?? document.getElementById("primary-nav-links");
const primaryNavLinks = Array.from(primaryNavLinksContainer?.querySelectorAll(".nav-link") ?? []);
const primaryNavOverflow = document.getElementById("preview-primary-nav-overflow") ?? document.getElementById("primary-nav-overflow");
const primaryNavOverflowButton = document.getElementById("preview-primary-nav-overflow-button") ?? document.getElementById("primary-nav-overflow-button");
const primaryNavOverflowMenu = document.getElementById("preview-primary-nav-overflow-menu") ?? document.getElementById("primary-nav-overflow-menu");
const navUtilities = document.querySelector("#top-nav-preview-frame .nav-utilities") ?? document.querySelector(".nav-utilities");
const mobileNavButton = document.getElementById("preview-mobile-nav-button") ?? document.getElementById("mobile-nav-button");
const mobileNavMenu = document.getElementById("preview-mobile-nav-menu") ?? document.getElementById("mobile-nav-menu");
const mobileNavLinks = Array.from(mobileNavMenu?.querySelectorAll(".nav-link") ?? []);
const mobileProfileButton = document.getElementById("preview-mobile-profile-button") ?? document.getElementById("mobile-profile-button");
const mobileProfileMenu = document.getElementById("preview-mobile-profile-menu") ?? document.getElementById("mobile-profile-menu");
const mobileLanguageButton = document.getElementById("preview-mobile-language-button") ?? document.getElementById("mobile-language-button");
const breadcrumbNav = document.querySelector(".breadcrumb-nav");
const breadcrumbList = document.getElementById("breadcrumb-list");
const breadcrumbHomeLink = document.getElementById("breadcrumb-home-link");
const breadcrumbCompact = document.getElementById("breadcrumb-compact");
const breadcrumbCompactButton = document.getElementById("breadcrumb-compact-button");
const breadcrumbCompactMenu = document.getElementById("breadcrumb-compact-menu");
const breadcrumbCollapseButton = document.getElementById("breadcrumb-collapse-button");
const breadcrumbCollapseMenu = document.getElementById("breadcrumb-collapse-menu");
const breadcrumbCollapsedItem = document.getElementById("breadcrumb-collapsed-item");
const breadcrumbSeparatorBeforeCollapsed = document.getElementById("breadcrumb-separator-before-collapsed");
const breadcrumbPageMinusOneItem = document.getElementById("breadcrumb-page-minus-one-item");
const breadcrumbSeparatorBeforePageMinusOne = document.getElementById("breadcrumb-separator-before-page-minus-one");
const breadcrumbPageMinusOneLink = document.getElementById("breadcrumb-page-minus-one-link");
const filterPanelButton = document.getElementById("filter-panel-button");
const filterPanel = document.getElementById("filter-panel");
const filterPanelCloseButton = document.getElementById("filter-panel-close");
const filterMenuButtons = Array.from(document.querySelectorAll("[data-filter-target]"));
const filterOptionsPanel = document.getElementById("filter-options-panel");
const filterOptionsTitle = document.getElementById("filter-options-title");
const filterOptionsCloseButton = document.getElementById("filter-options-close");
const filterOptionsSearch = document.getElementById("filter-options-search");
const filterOptionsList = document.getElementById("filter-options-list");
const accessibilityButton = document.getElementById("accessibility-button");
const accessibilityDrawer = document.getElementById("accessibility-drawer");
const accessibilityCloseButton = document.getElementById("accessibility-close");
const displaySettingsCopyNodes = Array.from(document.querySelectorAll("[data-display-settings-copy]"));
const displaySettingsAriaLabelNodes = Array.from(document.querySelectorAll("[data-display-settings-aria-label]"));
const contextNavMoreButton = document.getElementById("context-nav-more-button");
const contextNavMoreMenu = document.getElementById("context-nav-more-menu");
const contextNavMoreFilterButton = document.getElementById("context-nav-more-filter");
const contextNavMoreAccessibilityButton = document.getElementById("context-nav-more-accessibility");
const asyncActivityButton = document.getElementById("async-activity-button");
const asyncActivityDrawer = document.getElementById("async-activity-drawer");
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const directionButtons = Array.from(document.querySelectorAll("[data-direction-option]"));
const accentButtons = Array.from(document.querySelectorAll("[data-accent]"));
const magnificationButtons = Array.from(document.querySelectorAll("[data-magnification-option]"));
const brochurePreview = document.querySelector("[data-brochure-preview]");
const brochurePatternPage = document.querySelector(".brochure-pattern-page");
const brochureDensityButtons = Array.from(document.querySelectorAll("[data-brochure-density]"));
const brochureColorInputs = Array.from(document.querySelectorAll("[data-brochure-color]"));
const brochureEditableToggle = document.querySelector("[data-brochure-editable-toggle]");
const brochureEditButtons = Array.from(document.querySelectorAll("[data-brochure-edit-target]"));
const brochureEditFloatingButton = document.querySelector("[data-brochure-edit-floating]");
const brochureEditDrawer = document.getElementById("brochure-edit-drawer");
const brochureEditDrawerCloseButton = document.getElementById("brochure-edit-drawer-close");
const brochureEditDrawerEyebrow = document.querySelector("[data-brochure-edit-drawer-eyebrow]");
const brochureEditDrawerTitle = document.querySelector("[data-brochure-edit-drawer-title]");
const brochureEditDrawerCopy = document.querySelector("[data-brochure-edit-drawer-copy]");
const pageShellBannerDemoRoot = document.querySelector("[data-page-shell-banner-demo]");
const pageShellBannerVisibilityButtons = Array.from(document.querySelectorAll("[data-page-shell-banner-visibility]"));
const pageShellTopNavVisibilityButtons = Array.from(document.querySelectorAll("[data-page-shell-top-nav-visibility]"));
const pageShellProfileVisibilityButtons = Array.from(document.querySelectorAll("[data-page-shell-profile-visibility]"));
const pageShellProfileMenuStateButtons = Array.from(document.querySelectorAll("[data-page-shell-profile-menu-state]"));
const topNav = document.querySelector("#top-nav-preview-frame .top-nav") ?? document.querySelector(".top-nav");
const subNav = document.querySelector(".sub-nav");
const designSystemShell = document.querySelector(".design-system-shell");
const shellTopNav = document.querySelector(".design-system-shell > .top-nav");
const shellSubNav = document.querySelector(".design-system-shell > .sub-nav");
const languageModal = document.getElementById("language-modal");
const languageModalBackdrop = document.getElementById("language-modal-backdrop");
const languageModalCloseButton = document.getElementById("language-modal-close");
const languageOptionList = document.getElementById("language-option-list");
const formSelectRoots = Array.from(document.querySelectorAll("[data-form-select]"));
const formIconGridRoots = Array.from(document.querySelectorAll("[data-form-icon-grid]"));
const formDrawerSelectRoots = Array.from(document.querySelectorAll("[data-form-drawer-select]"));
const formTimePickerRoots = Array.from(document.querySelectorAll("[data-form-time-picker]"));
const formDatePickerRoots = Array.from(document.querySelectorAll("[data-form-date-picker]"));
const formErrorToggleButtons = Array.from(document.querySelectorAll("[data-form-error-toggle]"));
const formDrawerSettingButtons = Array.from(document.querySelectorAll("[data-form-drawer-setting]"));
const formPageShells = Array.from(document.querySelectorAll(".form-page-shell[data-form-error-mode]"));
const previewFrame = document.getElementById("top-nav-preview-frame");
const topNavPreviewCanvas = previewFrame?.querySelector(".top-nav-preview-canvas");
const topNavCanonicalRenderLayout = previewFrame?.closest(".canonical-render-layout");
const previewWidthInput = document.getElementById("top-nav-preview-width");
const previewWidthReadout = document.getElementById("top-nav-preview-width-readout");
const previewWidthPresetButtons = Array.from(document.querySelectorAll("[data-preview-width-preset]"));
const previewFixtureButtons = Array.from(document.querySelectorAll("[data-preview-fixture]"));
const previewOpenStateButtons = Array.from(document.querySelectorAll("[data-preview-open-state]"));
const previewBrandLabel = document.getElementById("preview-brand-label");
const previewProfileLabel = document.getElementById("preview-profile-label");
const previewTopNav = previewFrame?.querySelector(".top-nav") ?? topNav;
const previewPrimaryNav = previewFrame?.querySelector(".primary-nav") ?? primaryNav;
const previewNavUtilities = previewFrame?.querySelector(".nav-utilities") ?? navUtilities;
const topNavCanonicalMatchList = document.getElementById("top-nav-canonical-match-list");
const topNavCanonicalCircumstances = document.getElementById("top-nav-canonical-circumstances");
const topNavCanonicalCurrent = document.getElementById("top-nav-canonical-current");
const topNavCanonicalPrev = document.getElementById("top-nav-canonical-prev");
const topNavCanonicalNext = document.getElementById("top-nav-canonical-next");
const subNavPreviewFrame = document.getElementById("sub-nav-preview-frame");
const subNavPreviewShell = document.getElementById("sub-nav-preview-shell");
const subNavPreviewSummary = document.getElementById("sub-nav-preview-summary");
const subNavPreviewWidthInput = document.getElementById("sub-nav-preview-width");
const subNavPreviewWidthReadout = document.getElementById("sub-nav-preview-width-readout");
const subNavPreviewWidthPresetButtons = Array.from(document.querySelectorAll("[data-sub-nav-width-preset]"));
const subNavPreviewStateButtons = Array.from(document.querySelectorAll("[data-sub-nav-state]"));
const subNavPreviewSearchStateButtons = Array.from(document.querySelectorAll("[data-sub-nav-search-state]"));
const subNavPreviewLocaleButtons = Array.from(document.querySelectorAll("[data-sub-nav-locale]"));
const subNavPreviewBreadcrumbNav = document.getElementById("sub-nav-preview-breadcrumb-nav");
const subNavPreviewBreadcrumbList = document.getElementById("sub-nav-preview-breadcrumb-list");
const subNavPreviewBreadcrumbCompact = document.getElementById("sub-nav-preview-breadcrumb-compact");
const subNavPreviewBreadcrumbCompactButton = document.getElementById("sub-nav-preview-breadcrumb-compact-button");
const subNavPreviewBreadcrumbCompactMenu = document.getElementById("sub-nav-preview-breadcrumb-compact-menu");
const subNavPreviewCollapsedItem = document.getElementById("sub-nav-preview-collapsed-item");
const subNavPreviewBreadcrumbCollapseButton = document.getElementById("sub-nav-preview-breadcrumb-collapse-button");
const subNavPreviewBreadcrumbCollapseMenu = document.getElementById("sub-nav-preview-breadcrumb-collapse-menu");
const subNavPreviewSeparatorBeforeCollapsed = document.getElementById("sub-nav-preview-separator-before-collapsed");
const subNavPreviewPageMinusOneItem = document.getElementById("sub-nav-preview-page-minus-one-item");
const subNavPreviewSeparatorBeforePageMinusOne = document.getElementById("sub-nav-preview-separator-before-page-minus-one");
const subNavPreviewHomeLink = document.getElementById("sub-nav-preview-home-link");
const subNavPreviewPageMinusOneLink = document.getElementById("sub-nav-preview-page-minus-one-link");
const subNavPreviewCurrentLabel = document.getElementById("sub-nav-preview-current-label");
const subNavPreviewMiddleALink = document.getElementById("sub-nav-preview-middle-a-link");
const subNavPreviewMiddleBLink = document.getElementById("sub-nav-preview-middle-b-link");
const subNavPreviewCompactHome = document.getElementById("sub-nav-preview-compact-home");
const subNavPreviewCompactMiddleA = document.getElementById("sub-nav-preview-compact-middle-a");
const subNavPreviewCompactMiddleB = document.getElementById("sub-nav-preview-compact-middle-b");
const subNavPreviewCompactPageMinusOne = document.getElementById("sub-nav-preview-compact-page-minus-one");
const subNavPreviewCompactCurrent = document.getElementById("sub-nav-preview-compact-current");
const subNavPreviewSearchInput = document.getElementById("sub-nav-preview-search-input");
const subNavCanonicalRenderLayout = subNavPreviewFrame?.closest(".canonical-render-layout");
const subNavCanonicalRenderScroller = subNavPreviewFrame?.closest(".canonical-render-surface-scroll");
const contextNavPreviewFrame = document.getElementById("context-nav-preview-frame");
const contextNavCanonicalRenderLayout = contextNavPreviewFrame?.closest(".canonical-render-layout");
const contextNavPreviewShell = document.getElementById("context-nav-preview-shell");
const contextNavPreviewContent = document.querySelector(".context-nav-preview-content");
const contextNavPreviewSummary = document.getElementById("context-nav-preview-summary");
const contextNavPreviewWidthInput = document.getElementById("context-nav-preview-width");
const contextNavPreviewHeightInput = document.getElementById("context-nav-preview-height");
const contextNavPreviewWidthPresetButtons = Array.from(document.querySelectorAll("[data-context-nav-width-preset]"));
const contextNavPreviewHeightPresetButtons = Array.from(document.querySelectorAll("[data-context-nav-height-preset]"));
const contextNavPreviewStackButtons = Array.from(document.querySelectorAll("[data-context-nav-stack]"));
const contextNavPreviewLabelButtons = Array.from(document.querySelectorAll("[data-context-nav-labels]"));
const contextNavPreviewOpenButtons = Array.from(document.querySelectorAll("[data-context-nav-open]"));
const contextNavPreviewMainItems = document.getElementById("context-nav-preview-main-items");
const contextNavPreviewMeta = document.getElementById("context-nav-preview-meta");
const contextNavShellTopNav = document.getElementById("context-nav-shell-top-nav");
const contextNavShellPrimaryNav = document.getElementById("context-nav-shell-primary-nav");
const contextNavShellPrimaryNavLinksContainer = document.getElementById("context-nav-shell-primary-nav-links");
const contextNavShellPrimaryNavLinks = Array.from(contextNavShellPrimaryNavLinksContainer?.querySelectorAll(".nav-link") ?? []);
const contextNavShellPrimaryNavOverflow = document.getElementById("context-nav-shell-primary-nav-overflow");
const contextNavShellPrimaryNavOverflowButton = document.getElementById("context-nav-shell-primary-nav-overflow-button");
const contextNavShellPrimaryNavOverflowMenu = document.getElementById("context-nav-shell-primary-nav-overflow-menu");
const contextNavShellMobileNavButton = document.getElementById("context-nav-shell-mobile-nav-button");
const contextNavShellMobileNavMenu = document.getElementById("context-nav-shell-mobile-nav-menu");
const contextNavShellNavUtilities = document.getElementById("context-nav-shell-nav-utilities");
const contextNavPreviewBreadcrumbNav = document.getElementById("context-nav-preview-breadcrumb-nav");
const contextNavPreviewBreadcrumbList = document.getElementById("context-nav-preview-breadcrumb-list");
const contextNavPreviewBreadcrumbCompact = document.getElementById("context-nav-preview-breadcrumb-compact");
const contextNavPreviewBreadcrumbCompactButton = document.getElementById("context-nav-preview-breadcrumb-compact-button");
const contextNavPreviewBreadcrumbCompactMenu = document.getElementById("context-nav-preview-breadcrumb-compact-menu");
const contextNavPreviewCollapsedItem = document.getElementById("context-nav-preview-collapsed-item");
const contextNavPreviewBreadcrumbCollapseButton = document.getElementById("context-nav-preview-breadcrumb-collapse-button");
const contextNavPreviewBreadcrumbCollapseMenu = document.getElementById("context-nav-preview-breadcrumb-collapse-menu");
const contextNavPreviewSeparatorBeforeCollapsed = document.getElementById("context-nav-preview-separator-before-collapsed");
const contextNavPreviewPageMinusOneItem = document.getElementById("context-nav-preview-page-minus-one-item");
const contextNavPreviewSeparatorBeforePageMinusOne = document.getElementById("context-nav-preview-separator-before-page-minus-one");
const contextNavPreviewPageMinusOneLink = document.getElementById("context-nav-preview-page-minus-one-link");
const contextNavPreviewSearchShell = document.getElementById("context-nav-preview-search-shell");
const contextNavFilterLabel = document.getElementById("context-nav-filter-label");
const contextNavAccessLabel = document.getElementById("context-nav-access-label");
const contextNavMoreLabel = document.getElementById("context-nav-more-label");
const contextNavCanonicalMatchList = document.getElementById("context-nav-canonical-match-list");
const contextNavCanonicalCircumstances = document.getElementById("context-nav-canonical-circumstances");
const contextNavCanonicalCurrent = document.getElementById("context-nav-canonical-current");
const contextNavCanonicalPrev = document.getElementById("context-nav-canonical-prev");
const contextNavCanonicalNext = document.getElementById("context-nav-canonical-next");
const subNavCanonicalMatchList = document.getElementById("sub-nav-canonical-match-list");
const subNavCanonicalCircumstances = document.getElementById("sub-nav-canonical-circumstances");
const subNavCanonicalCurrent = document.getElementById("sub-nav-canonical-current");
const subNavCanonicalPrev = document.getElementById("sub-nav-canonical-prev");
const subNavCanonicalNext = document.getElementById("sub-nav-canonical-next");
const breadcrumbTooltipNodes = Array.from(
  document.querySelectorAll("#breadcrumb-list .breadcrumb-button, #sub-nav-preview-breadcrumb-list .breadcrumb-button"),
);
let subNavPreviewRenderPass = 0;
let subNavCanonicalFitFrame = 0;
let activeSharedTooltipTarget = null;

function getSharedTooltipElement() {
  let tooltip = document.getElementById("shared-floating-tooltip");
  if (tooltip instanceof HTMLElement) {
    return tooltip;
  }

  tooltip = document.createElement("div");
  tooltip.id = "shared-floating-tooltip";
  tooltip.className = "shared-floating-tooltip hidden";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  document.body.append(tooltip);
  return tooltip;
}

const filterOptionSets = {
  status: ["All", "Ready", "Draft", "In Review", "Blocked"],
  surface: ["Navigation", "Forms", "Tables", "Data Entry", "Dashboards"],
  lifecycle: ["Current", "Deprecated", "Experimental", "Archived", "Planned"],
};

const languageOptions = [
  { code: "en", name: "English", detail: "English" },
  { code: "es", name: "Spanish", detail: "Espanol" },
  { code: "fr", name: "French", detail: "Francais" },
  { code: "de", name: "German", detail: "Deutsch" },
  { code: "it", name: "Italian", detail: "Italiano" },
  { code: "pt", name: "Portuguese", detail: "Portugues" },
  { code: "nl", name: "Dutch", detail: "Nederlands" },
  { code: "pl", name: "Polish", detail: "Polski" },
  { code: "ar", name: "Arabic", detail: "Arabic" },
  { code: "hi", name: "Hindi", detail: "Hindi" },
  { code: "ja", name: "Japanese", detail: "Japanese" },
  { code: "zh-Hans", name: "Chinese (Simplified)", detail: "Simplified Chinese" },
];

const topNavPreviewFixtures = {
  standard: {
    brand: "Kanbien",
    primary: ["Overview", "Foundations", "Components", "Patterns", "Pages", "Resources"],
    profile: "Profile",
    mobileProfile: "Profile",
    menu: ["Language", "Close menu"],
    mobileMenu: ["My Profile", "Preferences", "Language", "Sign Out"],
  },
  "long-labels": {
    brand: "Kanbien Internationalization Operations Console",
    primary: [
      "Overview and Platform Signals",
      "Foundations and System Governance Library",
      "Components and Interaction Contracts",
      "Patterns and Localization Guidance",
      "Templates and Reusable Shell Guidance",
      "Resources and Operational Readiness Notes",
    ],
    profile: "Profile and Personalization Preferences",
    mobileProfile: "Profile and Personalization Preferences",
    menu: ["Language and Regional Preferences", "Close account navigation menu"],
    mobileMenu: [
      "My Administrative Profile Settings",
      "Preferences and Display Controls",
      "Language and Regional Preferences",
      "Sign Out of the Current Session",
    ],
  },
};

let activeFilterCategory = "status";
let activeLanguageCode = "en";
let languageModalReturnFocusTarget = null;
let accessibilityDrawerReturnFocusTarget = null;
let activeTopNavPreviewFixture = "standard";
let activeTopNavPreviewOpenState = "closed";
let pageShellBannerDemoVisible = false;
let pageShellTopNavMenuVisible = true;
let pageShellProfileVisible = false;
let pageShellProfileMenuOpen = false;
const topNavSurfaceMode = document.body.dataset.topNavSurface ?? "exploration";
const contextNavSurfaceMode = document.body.dataset.contextNavSurface ?? "inactive";
const subNavSurfaceMode = document.body.dataset.subNavSurface ?? "exploration";
const pageShellBannerDemoController = pageShellBannerDemoRoot instanceof HTMLElement
  ? createPageShellBannerController(pageShellBannerDemoRoot, {
    visible: false,
    ariaLabel: pageShellBannerDemoRoot.getAttribute("aria-label") ?? "Shell banner demo",
    onVisibilityChange(nextVisible) {
      pageShellBannerDemoVisible = nextVisible;
      syncPageShellBannerDemo();
    },
  })
  : null;
const asyncActivityDrawerController = asyncActivityDrawer instanceof HTMLElement
  ? createAsyncActivityDrawerController(asyncActivityDrawer, {
    launcher: asyncActivityButton instanceof HTMLElement ? asyncActivityButton : null,
    jobs: asyncActivityDrawerDemoJobs,
  })
  : null;

function usesLocalCanonicalAppearanceScope() {
  return topNavSurfaceMode === "canonical" || subNavSurfaceMode === "canonical" || contextNavSurfaceMode === "canonical";
}

function getLocalCanonicalAppearanceScope() {
  return topNavPreviewCanvas
    ?? subNavPreviewShell
    ?? contextNavPreviewShell
    ?? topNavCanonicalRenderLayout
    ?? subNavCanonicalRenderLayout
    ?? contextNavCanonicalRenderLayout
    ?? null;
}

function getAppearanceScopeNode() {
  if (usesLocalCanonicalAppearanceScope()) {
    return getLocalCanonicalAppearanceScope() ?? document.documentElement;
  }

  return document.documentElement;
}

function getCurrentSurfaceTheme() {
  const scopeNode = getAppearanceScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    return scopeNode.dataset.themeScope ?? document.documentElement.dataset.theme ?? topNavPreviewDefaults.theme;
  }

  return document.documentElement.dataset.theme ?? topNavPreviewDefaults.theme;
}

function getLocalCanonicalMagnificationScope() {
  return topNavPreviewCanvas ?? subNavPreviewShell ?? contextNavPreviewShell ?? getLocalCanonicalAppearanceScope() ?? null;
}

function getMagnificationScopeNode() {
  if (usesLocalCanonicalAppearanceScope()) {
    return getLocalCanonicalMagnificationScope() ?? document.documentElement;
  }

  return document.documentElement;
}

function getCurrentDocumentDirection() {
  return document.documentElement.getAttribute("dir") ?? topNavPreviewDefaults.direction;
}

function getTopNavSurfaceDirection() {
  return topNavPreviewCanvas?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? topNavPreviewDefaults.direction;
}

function shouldUseLocalCanonicalDirection() {
  return topNavSurfaceMode === "canonical"
    || subNavSurfaceMode === "canonical"
    || contextNavSurfaceMode === "canonical";
}

function getSubNavSurfaceDirection() {
  return subNavPreviewShell?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? subNavPreviewDefaults.direction;
}

function getContextNavSurfaceDirection() {
  return contextNavPreviewShell?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? contextNavPreviewDefaults.direction;
}

function shouldTrackHostContextNavOffset() {
  return Boolean(designSystemShell && (shellTopNav || shellSubNav));
}
const previewAccentPalette = [
  "#635bff",
  "#2563eb",
  "#0891b2",
  "#0f766e",
  "#2f855a",
  "#65a30d",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#e11d48",
  "#c026d3",
  "#7c3aed",
];
const topNavPreviewDefaults = {
  width: 1120,
  fixture: "standard",
  open: "closed",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  accent: "#635bff",
};
const validPreviewThemes = new Set(["normal", "dark", "desert"]);
const validPreviewDirections = new Set(["ltr", "rtl"]);
const validPreviewFixtures = new Set(Object.keys(topNavPreviewFixtures));
const validPreviewOpenStates = new Set(["closed", "overflow", "profile", "mobile"]);
const validPreviewMagnificationValues = new Set([-100, -50, 0, 50, 100]);
const validPreviewAccents = new Set(previewAccentPalette);
const displaySettingsCopy = {
  ltr: {
    eyebrow: "Display",
    title: "Display Settings",
    "theme-group": "Theme",
    "theme-normal": "Normal",
    "theme-dark": "Dark",
    "theme-desert": "Desert",
    "magnification-group": "Magnification",
    "accent-group": "Primary Colour",
    "direction-group": "Direction",
    "direction-ltr": "Left to right",
    "direction-rtl": "Right to left",
    "banner-group": "Banner Demo",
    "banner-show": "Show banners",
    "banner-hide": "Hide banners",
  },
  rtl: {
    eyebrow: "العرض",
    title: "إعدادات العرض",
    "theme-group": "المظهر",
    "theme-normal": "عادي",
    "theme-dark": "داكن",
    "theme-desert": "صحراوي",
    "magnification-group": "التكبير",
    "accent-group": "اللون الأساسي",
    "direction-group": "الاتجاه",
    "direction-ltr": "من اليسار إلى اليمين",
    "direction-rtl": "من اليمين إلى اليسار",
    "banner-group": "عرض اللافتات",
    "banner-show": "إظهار اللافتات",
    "banner-hide": "إخفاء اللافتات",
  },
};
const displaySettingsAriaLabels = {
  ltr: {
    close: "Close display settings",
  },
  rtl: {
    close: "إغلاق إعدادات العرض",
  },
};
const displaySettingsAccentLabels = {
  ltr: {
    "#635bff": "Indigo",
    "#2563eb": "Blue",
    "#0891b2": "Cyan",
    "#0f766e": "Teal",
    "#2f855a": "Green",
    "#65a30d": "Lime",
    "#ca8a04": "Gold",
    "#ea580c": "Orange",
    "#dc2626": "Red",
    "#e11d48": "Rose",
    "#c026d3": "Fuchsia",
    "#7c3aed": "Violet",
  },
  rtl: {
    "#635bff": "نيلي",
    "#2563eb": "أزرق",
    "#0891b2": "سماوي",
    "#0f766e": "فيروزي",
    "#2f855a": "أخضر",
    "#65a30d": "ليموني",
    "#ca8a04": "ذهبي",
    "#ea580c": "برتقالي",
    "#dc2626": "أحمر",
    "#e11d48": "وردي",
    "#c026d3": "فوشيا",
    "#7c3aed": "بنفسجي",
  },
};
const topNavCanonicalReferenceStates = [
  { ref: "TRP-001", label: "Desktop default", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop baseline with full primary navigation visible, profile controls closed, and no overflow pressure." },
  { ref: "TRP-002", label: "Desktop overflow", fixture: "standard", width: 880, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", maxVisiblePrimaryItems: 3, circumstance: "Desktop shell under width pressure where overflow activates before overlap or utility collision." },
  { ref: "TRP-003", label: "Desktop threshold before mobile", fixture: "standard", width: 760, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", maxVisiblePrimaryItems: 2, circumstance: "Desktop threshold state that must not degrade into the disallowed `1 item + More` layout." },
  { ref: "TRP-004", label: "Mobile shell closed", fixture: "standard", width: 560, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", forceMobileShell: true, circumstance: "Mobile shell with the collapsed navigation chrome closed." },
  { ref: "TRP-005", label: "Mobile shell open", fixture: "standard", width: 560, open: "mobile", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", forceMobileShell: true, circumstance: "Mobile shell with the primary navigation exposed as the full open mobile menu." },
  { ref: "TRP-006", label: "Profile menu open", fixture: "standard", width: 1120, open: "profile", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop shell with the profile menu open and anchored to the utility region." },
  { ref: "TRP-007", label: "Overflow menu open", fixture: "standard", width: 880, open: "overflow", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", maxVisiblePrimaryItems: 3, circumstance: "Desktop overflow state with the `More` menu open and derived from the hidden primary destinations." },
  { ref: "TRP-008", label: "RTL desktop", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL desktop shell with native-feeling mirrored alignment and preserved utility separation." },
  { ref: "TRP-009", label: "RTL mobile", fixture: "standard", width: 560, open: "mobile", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", forceMobileShell: true, circumstance: "RTL mobile shell with the open mobile navigation and mirrored utility grammar." },
  { ref: "TRP-010", label: "Magnified desktop", fixture: "long-labels", width: 880, open: "closed", theme: "normal", direction: "ltr", magnification: 100, accent: "#635bff", circumstance: "Magnified desktop shell with long labels, requiring overflow or mobile fallback before crowding." },
  { ref: "TRP-011", label: "Long brand label", fixture: "long-labels", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop shell with an intentionally long brand label that must yield without distorting the brand mark." },
  { ref: "TRP-012", label: "Long primary label", fixture: "long-labels", width: 880, open: "overflow", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", maxVisiblePrimaryItems: 2, circumstance: "Desktop overflow state with long primary destination labels preserved through overflow rather than overlap." },
  { ref: "TRP-013", label: "Long profile label", fixture: "long-labels", width: 1120, open: "profile", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop shell with long profile and menu labels open in the utility menu." },
  { ref: "TRP-014A", label: "Theme normal", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Normal theme baseline for top-nav readability and contrast." },
  { ref: "TRP-014B", label: "Theme dark", fixture: "standard", width: 1120, open: "closed", theme: "dark", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Dark theme top-nav state used for cross-theme readability review." },
  { ref: "TRP-014C", label: "Theme desert", fixture: "standard", width: 1120, open: "closed", theme: "desert", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desert theme top-nav state used for cross-theme readability review." },
  { ref: "TRP-015A", label: "Accent indigo", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Default indigo accent inheritance for the shell." },
  { ref: "TRP-015B", label: "Accent violet", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#7c3aed", circumstance: "Alternate violet accent inheritance for the shell." },
];
const subNavPreviewDefaults = {
  width: 1560,
  state: "full",
  search: "inactive",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  locale: "standard",
  accent: "#635bff",
};
const validSubNavStates = new Set(["full", "shallow", "reduced-page-minus-one", "reduced-middle", "compact", "mobile"]);
const validSubNavSearchStates = new Set(["inactive", "active"]);
const contextNavPreviewDefaults = {
  width: 1120,
  height: 760,
  stack: "standard",
  labels: "standard",
  open: "closed",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  accent: "#635bff",
};
const validContextNavStacks = new Set(["standard", "tall"]);
const validContextNavLabels = new Set(["standard", "long"]);
const validContextNavOpenStates = new Set(["closed", "more", "filter", "accessibility"]);
const contextNavPrimaryFixtures = {
  standard: [
    { key: "overview", href: "/design-system", standard: "Overview", long: "Overview and Signals", active: true, icon: "home" },
    { key: "components", href: "/design-system/components", standard: "Components", long: "Components Library", icon: "grid" },
    { key: "patterns", href: "/design-system/patterns", standard: "Patterns", long: "Pattern Guidance", icon: "list" },
    { key: "templates", href: "/design-system/templates", standard: "Templates", long: "Template Guidance", icon: "doc" },
  ],
  tall: [
    { key: "overview", href: "/design-system", standard: "Overview", long: "Overview and Signals", active: true, icon: "home" },
    { key: "components", href: "/design-system/components", standard: "Components", long: "Components Library", icon: "grid" },
    { key: "patterns", href: "/design-system/patterns", standard: "Patterns", long: "Pattern Guidance", icon: "list" },
    { key: "templates", href: "/design-system/templates", standard: "Templates", long: "Template Guidance", icon: "doc" },
    { key: "tokens", href: "/design-system/tokens", standard: "Tokens", long: "Semantic Tokens", icon: "token" },
    { key: "motion", href: "/design-system/motion", standard: "Motion", long: "Motion Behavior", icon: "spark" },
    { key: "content", href: "/design-system/content", standard: "Content", long: "Content Contracts", icon: "text" },
    { key: "quality", href: "/design-system/quality", standard: "Quality", long: "Quality Gates", icon: "shield" },
    { key: "locales", href: "/design-system/localization", standard: "Locales", long: "Localization Review", icon: "globe" },
  ],
};
const contextNavBottomFixtures = {
  filter: { standard: "Filters", long: "Filter Controls", tooltip: "Filters" },
  accessibility: { standard: "Access", long: "Accessibility Tools", tooltip: "Accessibility" },
  more: { standard: "More", long: "More Actions", tooltip: "More" },
};
const contextNavCanonicalReferenceStates = [
  { ref: "CNR-001", label: "Desktop rail baseline", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop baseline review with a shell-attached rail, standard labels, stable top and bottom zones, and no transient surfaces open." },
  { ref: "CNR-002", label: "Tall top-stack scroll", width: 1120, height: 620, stack: "tall", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop scroll review where the top stack is tall enough to scroll while the bottom zone remains anchored and center alignment stays intact beside a thin scrollbar." },
  { ref: "CNR-003", label: "Desktop tooltip hover target", width: 1120, height: 760, stack: "standard", labels: "long", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop hover-target review where long labels remain hidden in the rail and the governed tooltip layer is ready to reveal the full label on hover." },
  { ref: "CNR-004", label: "Short-height scroll pressure", width: 1120, height: 460, stack: "tall", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Short-height desktop review where the tall top zone remains scrollable under stronger height pressure while the bottom utility zone stays pinned and aligned." },
  { ref: "CNR-005", label: "Mobile bottom-nav baseline", width: 560, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile baseline review where the rail converts into a bottom bar with visible labels and the current destination remains identifiable." },
  { ref: "CNR-006", label: "Mobile More menu open", width: 560, height: 760, stack: "tall", labels: "standard", open: "more", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile overflow review where extra top actions and bottom utility actions move into the More menu instead of crowding the primary lane." },
  { ref: "CNR-007", label: "Context-nav drawer launch", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile action review where the context-nav drawer launches from the governed utility path and layers cleanly above the bottom bar." },
  { ref: "CNR-008", label: "RTL right-edge rail", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL desktop review where the context-nav mirrors to the full right edge and preserves native-feeling anchoring for menus, drawers, and tooltips." },
  { ref: "CNR-009", label: "Magnified long-label desktop", width: 1120, height: 760, stack: "standard", labels: "long", open: "closed", theme: "normal", direction: "ltr", magnification: 100, accent: "#635bff", circumstance: "Magnified desktop review where long labels still truncate cleanly, the rail geometry stays stable, and tooltip-trigger affordances remain honest." },
  { ref: "CNR-010", label: "Theme and accent readability", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "dark", direction: "ltr", magnification: 0, accent: "#7c3aed", circumstance: "Theme and accent review where the context-nav keeps its locked behavior while contrast, emphasis, and active states inherit the shared design-system styling." },
  { ref: "CDR-001", label: "Desktop attached drawer open", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop context-nav drawer review where the drawer opens as a shell-attached side panel, overlays the content area, preserves the governed close-control grammar, and remains directly tied to the launching rail." },
  { ref: "CDR-002", label: "RTL right-edge attached drawer", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL context-nav drawer review where the drawer mirrors to the right-edge shell presentation and preserves native-feeling anchoring relative to the mirrored rail." },
  { ref: "CDR-003", label: "Mobile bottom-sheet drawer open", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile context-nav drawer review where the drawer opens as a bottom-attached sheet, fills the lane to the top edge of the bottom bar, and remains layered above the mobile shell chrome." },
  { ref: "CDR-004", label: "Mobile tall-stack utility path", width: 560, height: 760, stack: "tall", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile tall-stack review where the context-nav drawer still launches truthfully through the constrained utility path without collapsing the governed bottom-bar model." },
  { ref: "CDR-005", label: "Dark theme with magnification", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "dark", direction: "ltr", magnification: 100, accent: "#7c3aed", circumstance: "Context-nav-drawer stress review under dark theme and magnification where focus visibility, contrast, readable control grouping, and structural stability stay intact." },
  { ref: "CDR-006", label: "Long-label readability and alternate theme", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "desert", direction: "ltr", magnification: 50, accent: "#0f766e", circumstance: "Context-nav-drawer readability review under longer labels and an alternate approved theme where the drawer structure stays stable without geometric drift." },
  { ref: "DSR-001", label: "Desktop grouped payload baseline", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Display-settings payload baseline where the grouped runtime controls for theme, magnification, accent, and direction are reviewed inside the signed-off desktop drawer shell." },
  { ref: "DSR-002", label: "Dark theme and enlarged payload", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "dark", direction: "ltr", magnification: 100, accent: "#7c3aed", circumstance: "Display-settings stress review where the grouped payload remains readable and structurally stable under dark theme, enlarged magnification, and the shared drawer shell." },
  { ref: "DSR-003", label: "RTL mirrored payload", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL display-settings review where the payload body mirrors, local copy shifts to Arabic, and the grouped controls feel native inside the mirrored drawer shell." },
  { ref: "DSR-004", label: "Mobile bottom-sheet payload", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile display-settings review where the full grouped payload remains usable inside the bottom-attached sheet without clipping or losing the bottom-bar relationship." },
  { ref: "DSR-005", label: "Reduced magnification and accent sweep", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: -100, accent: "#2563eb", circumstance: "Display-settings range review where the low-end magnification state and non-default accent remain real, reload-safe, and visually legible inside the payload." },
];
const formTemplateCanonicalReferenceStates = [
  { ref: "FTR-001", label: "Desktop no-sidebar baseline", theme: "normal", direction: "ltr", magnification: 0, errors: false, disabled: false, mobile: false },
  { ref: "FTR-010", label: "Normal-theme error review", theme: "normal", direction: "ltr", magnification: 0, errors: true, disabled: false, mobile: false },
  { ref: "FTR-011", label: "Dark-theme error review", theme: "dark", direction: "ltr", magnification: 0, errors: true, disabled: false, mobile: false },
  { ref: "FTR-012", label: "Normal-theme disabled review", theme: "normal", direction: "ltr", magnification: 0, errors: false, disabled: true, mobile: false },
  { ref: "FTR-013", label: "Dark-theme disabled review", theme: "dark", direction: "ltr", magnification: 0, errors: false, disabled: true, mobile: false },
  { ref: "FTR-014", label: "Error plus disabled review", theme: "normal", direction: "ltr", magnification: 0, errors: true, disabled: true, mobile: false },
  { ref: "FTR-015", label: "Mobile error review", theme: "normal", direction: "ltr", magnification: 0, errors: true, disabled: false, mobile: true },
  { ref: "FTR-016", label: "Mobile disabled review", theme: "normal", direction: "ltr", magnification: 0, errors: false, disabled: true, mobile: true },
  { ref: "FTR-017", label: "RTL desktop review", theme: "normal", direction: "rtl", magnification: 0, errors: false, disabled: false, mobile: false },
  { ref: "FTR-018", label: "RTL mobile review", theme: "normal", direction: "rtl", magnification: 0, errors: false, disabled: false, mobile: true },
  { ref: "FTR-019", label: "RTL magnified review", theme: "normal", direction: "rtl", magnification: 100, errors: false, disabled: false, mobile: false },
  { ref: "FTR-020", label: "Upload in-progress review", theme: "normal", direction: "ltr", magnification: 0, errors: false, disabled: false, mobile: false, upload: "uploading" },
  { ref: "FTR-021", label: "Upload error review", theme: "normal", direction: "ltr", magnification: 0, errors: true, disabled: false, mobile: false, upload: "error" },
];
const validSubNavLocales = new Set(["standard", "long-latin", "long-latin-truncation", "rtl", "rtl-long", "rtl-long-truncation", "cjk", "symbols"]);
const subNavPreviewLocales = {
  standard: {
    placeholder: "Search components, patterns, or docs",
    home: "Home",
    middleA: "Library",
    middleB: "Navigation",
    pageMinusOne: "Sub-nav",
    pageMinusOneShort: "Previous",
    current: "Search",
  },
  "long-latin": {
    placeholder: "Search components, patterns, documentation, and operational references",
    home: "Home",
    middleA: "Design System",
    middleB: "Navigation Hierarchy",
    pageMinusOne: "Sub-navigation Workspace",
    pageMinusOneShort: "Previous",
    current: "Search and Discovery",
  },
  "long-latin-truncation": {
    placeholder: "Search components, patterns, or docs",
    home: "Home",
    middleA: "Design System",
    middleB: "Navigation Hierarchy",
    pageMinusOne: "Sub-navigation governance workspace",
    pageMinusOneShort: "Previous",
    current: "Search discovery documentation",
  },
  rtl: {
    placeholder: "ابحث في المكونات والأنماط والوثائق",
    home: "الرئيسية",
    middleA: "المكتبة",
    middleB: "التنقل",
    pageMinusOne: "الشريط الفرعي",
    pageMinusOneShort: "السابق",
    current: "البحث",
  },
  "rtl-long": {
    placeholder: "ابحث في المكونات والأنماط والوثائق المرجعية والتشغيلية",
    home: "الصفحة الرئيسية",
    middleA: "مكتبة التصميم",
    middleB: "التنقل الهيكلي",
    pageMinusOne: "مساحة التنقل الفرعي",
    pageMinusOneShort: "السابق",
    current: "البحث والاستكشاف",
  },
  "rtl-long-truncation": {
    placeholder: "ابحث في المكونات والأنماط والوثائق",
    home: "الرئيسية",
    middleA: "مكتبة التصميم",
    middleB: "التنقل الهيكلي",
    pageMinusOne: "مساحة التنقل والمراجعة",
    pageMinusOneShort: "السابق",
    current: "البحث والاستكشاف المرجعي",
  },
  cjk: {
    placeholder: "搜索组件、模式和文档",
    home: "首页",
    middleA: "设计系统",
    middleB: "导航",
    pageMinusOne: "子导航",
    pageMinusOneShort: "上一页",
    current: "搜索",
  },
  symbols: {
    placeholder: "Search components / patterns / docs & tokens",
    home: "Home",
    middleA: "Patterns & Docs",
    middleB: "Search / Tokens",
    pageMinusOne: "Sub-nav / Search",
    pageMinusOneShort: "Previous",
    current: "Query & Filter",
  },
};
const subNavCanonicalReferenceStates = [
  { ref: "SNR-001", label: "Desktop default row", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop baseline row review with the full breadcrumb trail visible, centered search inactive, standard locale copy, normal theme, and LTR layout." },
  { ref: "SNR-002", label: "Compressed desktop row", width: 1160, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Reduced desktop row review where breadcrumb pressure removes Page -1 while the middle segment still remains visible and search stays centered and inactive." },
  { ref: "SNR-003", label: "Desktop active search", width: 1560, state: "full", search: "active", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop full-row review with active search focus, Enter hint visible, and the full breadcrumb trail retained." },
  { ref: "SNR-004", label: "Mobile fallback row", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile fallback review where breadcrumb is absent and search expands to the full sub-nav width." },
  { ref: "SNR-005", label: "RTL row", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "Desktop RTL row review at the widened full canonical width so the collapsed middle breadcrumb and RTL locale copy remain honestly visible together." },
  { ref: "SNR-006", label: "Theme readability row", width: 1560, state: "full", search: "inactive", theme: "dark", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop full-row review in dark theme to confirm the shared row remains readable without changing composition." },
  { ref: "SNR-007", label: "Magnified long-content row", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 100, locale: "long-latin", circumstance: "Magnified row review with long Latin content and reduced breadcrumb pressure so placeholder and breadcrumb fit can be judged together." },
  { ref: "SNR-008", label: "RTL reduced row", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL transition row review where Page -1 has already yielded so the remaining breadcrumb structure, separators, and search lane can be judged under medium-width pressure." },
  { ref: "BCR-001", label: "Full breadcrumb trail", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Wide breadcrumb baseline showing home, collapsed middle path, Page -1, and current page under standard desktop conditions." },
  { ref: "BCR-002", label: "Shallow home breadcrumb", width: 1320, state: "shallow", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Shallow-navigation review where only the home breadcrumb appears because there is no real middle path or Page -1 depth." },
  { ref: "BCR-003", label: "Reduced breadcrumb without Page -1", width: 1160, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Responsive breadcrumb reduction review where Page -1 has yielded while the middle segment still remains visible beside the centered search lane." },
  { ref: "BCR-004", label: "Reduced breadcrumb without middle segment", width: 700, state: "reduced-middle", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Responsive breadcrumb reduction review where the middle segment has yielded and the remaining structure stays out of the search lane." },
  { ref: "BCR-005", label: "Compact signpost mode", width: 640, state: "compact", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Compact signpost review where breadcrumb compresses to a single protected icon/menu and search yields around that dedicated lane." },
  { ref: "BCR-006", label: "RTL breadcrumb", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL breadcrumb review at the widened full canonical width so the collapsed middle path, separators, and anchoring remain visible under RTL copy." },
  { ref: "BCR-007", label: "Long-label breadcrumb", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin", circumstance: "Long-label breadcrumb review where long Latin labels must yield through the approved reduction path instead of wrapping or overlapping search." },
  { ref: "BCR-008", label: "Mobile breadcrumb absence", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile review confirming breadcrumb disappears entirely and does not leave residual structure behind." },
  { ref: "BCR-009", label: "RTL reduced breadcrumb", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL breadcrumb transition review where Page -1 has yielded and the mirrored collapsed-middle structure must still anchor correctly under narrower width pressure." },
  { ref: "BCR-010", label: "RTL compact breadcrumb", width: 760, state: "compact", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL compact signpost review where the breadcrumb has collapsed to its protected recovery trigger and mirrored menu behavior remains intact." },
  { ref: "BCR-011", label: "LTR truncated breadcrumb labels", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin-truncation", circumstance: "LTR breadcrumb truncation review at full desktop width where deliberately oversized button labels must ellipsize honestly, surface tooltips, and remain visible without forcing the row into a reduced breadcrumb state." },
  { ref: "BCR-012", label: "RTL truncated breadcrumb labels", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl-long-truncation", circumstance: "RTL breadcrumb truncation review at full desktop width where deliberately oversized mirrored button labels must ellipsize honestly, surface tooltips, and remain visible without forcing the row into a reduced breadcrumb state." },
  { ref: "SSR-001", label: "Desktop empty search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop search-shell baseline with full row support, inactive search field, and standard placeholder copy." },
  { ref: "SSR-002", label: "Desktop active search", width: 1560, state: "full", search: "active", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop active-search review showing focus treatment and Enter hint inside the full supported row." },
  { ref: "SSR-003", label: "Compressed desktop search", width: 1160, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Reduced desktop review where search must remain bounded and clear while the breadcrumb has yielded Page -1 but preserved the middle segment." },
  { ref: "SSR-004", label: "Mobile search", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile search review where the field fills the sub-nav width and the Enter hint is absent." },
  { ref: "SSR-005", label: "RTL search", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL search-shell review at the widened full canonical width so the search field stays paired with the full supported breadcrumb structure under RTL content." },
  { ref: "SSR-006", label: "Theme readability search", width: 1560, state: "full", search: "inactive", theme: "dark", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Dark-theme search-shell review focused on placeholder, border, and focus readability." },
  { ref: "SSR-007", label: "Magnified long-placeholder search", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 100, locale: "long-latin", circumstance: "Magnified long-placeholder review where long Latin guidance text must yield cleanly without pretending the full breadcrumb still fits." },
  { ref: "SSR-008", label: "Localized long Latin search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin", circumstance: "Wide search-shell review with long Latin placeholder copy under full row support." },
  { ref: "SSR-009", label: "Localized RTL search", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "Wide RTL search-shell review at the widened full canonical width with localized RTL placeholder content and the full breadcrumb structure retained." },
  { ref: "SSR-010", label: "Localized CJK search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "cjk", circumstance: "Wide search-shell review with dense CJK placeholder content to confirm glyph rendering and spacing." },
  { ref: "SSR-011", label: "Symbol-heavy search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "symbols", circumstance: "Wide search-shell review with punctuation-heavy placeholder guidance to verify symbol spacing and yield behavior." },
  { ref: "SSR-012", label: "RTL reduced search", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL search-shell transition review where the field must remain readable and centered while the mirrored breadcrumb has already yielded Page -1." },
];

if (breadcrumbPageMinusOneLink) {
  const fullLabel = breadcrumbPageMinusOneLink.textContent?.trim() ?? "Page -1";
  const normalizedPath = normalizePathname(window.location.pathname);
  const preserveCanonicalBreadcrumbLabel =
    normalizedPath === "/design-system/canonicals"
    || normalizedPath.startsWith("/design-system/canonicals/")
    || normalizedPath.startsWith("/design-system/patterns/hierarchy-tree/render")
    || (
      normalizedPath.startsWith("/design-system/components/")
      && normalizedPath !== "/design-system/components"
    );

  breadcrumbPageMinusOneLink.dataset.fullLabel = fullLabel;
  breadcrumbPageMinusOneLink.dataset.shortLabel = preserveCanonicalBreadcrumbLabel
    ? fullLabel
    : "Previous";
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function normalizePreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 480, 1320, topNavPreviewDefaults.width),
    fixture: validPreviewFixtures.has(rawState.fixture) ? rawState.fixture : topNavPreviewDefaults.fixture,
    open: validPreviewOpenStates.has(rawState.open) ? rawState.open : topNavPreviewDefaults.open,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : topNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : topNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : topNavPreviewDefaults.magnification,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : topNavPreviewDefaults.accent,
  };

  if (normalized.open === "overflow" && normalized.width > 880) {
    normalized.width = 880;
  }

  if (normalized.open === "mobile") {
    normalized.width = 560;
  }

  if (normalized.open === "profile" && normalized.width < 880) {
    normalized.width = 1120;
  }

  return normalized;
}

function normalizeSubNavPreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 480, 1920, subNavPreviewDefaults.width),
    state: validSubNavStates.has(rawState.state) ? rawState.state : subNavPreviewDefaults.state,
    search: validSubNavSearchStates.has(rawState.search) ? rawState.search : subNavPreviewDefaults.search,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : subNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : subNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : subNavPreviewDefaults.magnification,
    locale: validSubNavLocales.has(rawState.locale) ? rawState.locale : subNavPreviewDefaults.locale,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : subNavPreviewDefaults.accent,
  };

  if (normalized.state === "full" && normalized.width < 1560) {
    normalized.width = 1560;
  }

  if (normalized.state === "mobile") {
    normalized.width = 560;
  }

  return normalized;
}

function getSubNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return subNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getLegacySubNavCanonicalReference(params) {
  const width = Number(params.get("width"));
  const state = params.get("state");
  const search = params.get("search");
  const theme = params.get("theme");
  const direction = params.get("dir");
  const zoom = Number(params.get("zoom"));
  const locale = params.get("locale");

  if (
    width === 960
    && state === "reduced-middle"
    && search === "inactive"
    && theme === "normal"
    && direction === "ltr"
    && zoom === 0
    && locale === "long-latin"
  ) {
    return getSubNavCanonicalReferenceByRef("BCR-011");
  }

  if (
    width === 960
    && state === "reduced-middle"
    && search === "inactive"
    && theme === "normal"
    && direction === "rtl"
    && zoom === 0
    && locale === "rtl-long"
  ) {
    return getSubNavCanonicalReferenceByRef("BCR-012");
  }

  return null;
}

function getSubNavCanonicalMatches(state) {
  return subNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.state === state.state &&
    reference.search === state.search &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification) &&
    reference.locale === state.locale
  ));
}

function getRequestedSubNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref");
}

function buildSubNavCanonicalHref(reference, accent = subNavPreviewDefaults.accent) {
  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("state", reference.state);
  params.set("search", reference.search);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("locale", reference.locale);
  params.set("accent", accent);
  params.set("ref", reference.ref);
  return `/design-system/components/sub-nav?${params.toString()}`;
}

function getActiveSubNavCanonicalReference(matches) {
  const requestedRef = getRequestedSubNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function updateSubNavCanonicalStepper(state, matches) {
  if (!subNavCanonicalCurrent && !subNavCanonicalPrev && !subNavCanonicalNext) {
    return;
  }

  const activeReference = getActiveSubNavCanonicalReference(matches);
  const activeIndex = activeReference
    ? subNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref)
    : -1;
  const previousReference = activeIndex > 0 ? subNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < subNavCanonicalReferenceStates.length - 1
    ? subNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (subNavCanonicalCurrent) {
    subNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical state";
  }

  const accent = state.accent ?? subNavPreviewDefaults.accent;
  for (const [node, reference] of [
    [subNavCanonicalPrev, previousReference],
    [subNavCanonicalNext, nextReference],
  ]) {
    if (!(node instanceof HTMLAnchorElement)) {
      continue;
    }

    if (reference) {
      node.href = buildSubNavCanonicalHref(reference, accent);
      node.setAttribute("aria-disabled", "false");
      node.tabIndex = 0;
    } else {
      node.href = "#";
      node.setAttribute("aria-disabled", "true");
      node.tabIndex = -1;
    }
  }
}

function hideSharedTooltip() {
  const tooltip = getSharedTooltipElement();
  tooltip.classList.add("hidden");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.textContent = "";
  tooltip.removeAttribute("data-placement");
  tooltip.style.removeProperty("left");
  tooltip.style.removeProperty("top");
  tooltip.style.removeProperty("transform");
  activeSharedTooltipTarget = null;
}

function positionSharedTooltip(target) {
  if (!(target instanceof HTMLElement)) {
    hideSharedTooltip();
    return;
  }

  const label = getTooltipLabelForTarget(target);
  if (!label) {
    hideSharedTooltip();
    return;
  }

  const tooltip = getSharedTooltipElement();
  tooltip.textContent = label;
  tooltip.classList.remove("hidden");
  tooltip.setAttribute("aria-hidden", "false");

  const rect = target.getBoundingClientRect();
  const isBreadcrumbTooltip =
    target.classList.contains("breadcrumb-button")
    || target.classList.contains("breadcrumb-current")
    || target.id === "sub-nav-preview-current-label";
  const isContextNavTooltip = target.classList.contains("context-nav-item");
  const direction = topNavPreviewCanvas?.getAttribute("dir") === "rtl" || document.documentElement.getAttribute("dir") === "rtl"
    ? "rtl"
    : "ltr";
  const viewportPadding = 8;
  const tooltipGap = 12;
  let left = 0;
  let top = 0;

  if (isBreadcrumbTooltip) {
    tooltip.dataset.placement = "below";
    tooltip.style.transform = "none";
    const tooltipRect = tooltip.getBoundingClientRect();
    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    top = rect.bottom + tooltipGap;
  } else if (isContextNavTooltip) {
    tooltip.dataset.placement = direction === "rtl" ? "left" : "right";
    tooltip.style.transform = "none";
    const tooltipRect = tooltip.getBoundingClientRect();
    if (direction === "rtl") {
      left = rect.left - tooltipGap - tooltipRect.width;
      top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
    } else {
      left = rect.right + tooltipGap;
      top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
    }
  } else {
    tooltip.dataset.placement = "above";
    tooltip.style.transform = "none";
    const tooltipRect = tooltip.getBoundingClientRect();
    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    top = rect.top - tooltipGap - tooltipRect.height;
  }

  const measuredTooltip = tooltip.getBoundingClientRect();
  const maxLeft = window.innerWidth - measuredTooltip.width - viewportPadding;
  const maxTop = window.innerHeight - measuredTooltip.height - viewportPadding;
  const clampedLeft = Math.min(Math.max(left, viewportPadding), Math.max(viewportPadding, maxLeft));
  const clampedTop = Math.min(Math.max(top, viewportPadding), Math.max(viewportPadding, maxTop));
  tooltip.style.left = `${clampedLeft}px`;
  tooltip.style.top = `${clampedTop}px`;

  activeSharedTooltipTarget = target;
}

function getTooltipTargetFromNode(node) {
  if (!(node instanceof Element)) {
    return null;
  }

  return node.closest(
    ".tooltip-anchor[data-tooltip], .context-nav-item[data-tooltip], .form-icon-grid-option[data-tooltip], .breadcrumb-button, .breadcrumb-current",
  );
}

function getTooltipLabelForTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return "";
  }

  const explicitLabel = target.dataset.tooltip?.trim();
  if (explicitLabel) {
    return explicitLabel;
  }

  const isBreadcrumbTarget =
    target.classList.contains("breadcrumb-button")
    || target.classList.contains("breadcrumb-current");

  if (!isBreadcrumbTarget) {
    return "";
  }

  const labelNode = ensureBreadcrumbLabel(target) ?? target;
  const label = target.dataset.fullLabel?.trim() || labelNode.textContent?.trim() || "";
  if (!label) {
    return "";
  }

  const parentItem = target.closest("li");
  const nodeTruncated = labelNode.scrollWidth > labelNode.clientWidth + 1;
  const parentTruncated =
    parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
  const isTruncated =
    target.classList.contains("breadcrumb-home-icon-only")
    || nodeTruncated
    || parentTruncated;

  return isTruncated ? label : "";
}

function getTooltipTargetFromEvent(event) {
  if (!event || typeof event.composedPath !== "function") {
    return getTooltipTargetFromNode(event?.target);
  }

  for (const entry of event.composedPath()) {
    if (entry instanceof Element) {
      const target = getTooltipTargetFromNode(entry);
      if (target) {
        return target;
      }
    }
  }

  return null;
}

function wireSharedTooltipSystem() {
  document.addEventListener("mouseover", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement)) {
      return;
    }

    positionSharedTooltip(target);
  });

  document.addEventListener("mouseout", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement) || target !== activeSharedTooltipTarget) {
      return;
    }

    const nextTarget = getTooltipTargetFromNode(event.relatedTarget);
    if (nextTarget === target) {
      return;
    }

    hideSharedTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (target instanceof HTMLElement && !target.classList.contains("context-nav-item")) {
      positionSharedTooltip(target);
    }
  });

  document.addEventListener("focusout", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement) || target.classList.contains("context-nav-item") || target !== activeSharedTooltipTarget) {
      return;
    }

    const nextTarget = getTooltipTargetFromNode(event.relatedTarget);
    if (nextTarget === target) {
      return;
    }

    hideSharedTooltip();
  });

  window.addEventListener("scroll", () => {
    if (activeSharedTooltipTarget instanceof HTMLElement) {
      positionSharedTooltip(activeSharedTooltipTarget);
    }
  }, true);
  window.addEventListener("resize", () => {
    if (activeSharedTooltipTarget instanceof HTMLElement) {
      positionSharedTooltip(activeSharedTooltipTarget);
    }
  });
}

function describeSubNavCanonicalCircumstances(state, matches) {
  if (matches.length > 0) {
    return matches.map((match) => match.circumstance).join(" ");
  }

  const viewportLabel = state.state === "mobile" ? "mobile" : "desktop";
  const searchLabel = state.search === "active" ? "active search" : "inactive search";
  const directionLabel = state.direction.toUpperCase();
  const themeLabel = state.theme;
  const zoomLabel = `${Number(state.magnification)}% magnification`;
  return `Ad hoc ${viewportLabel} canonical view using the ${state.state} row state, ${searchLabel}, ${state.locale} locale copy, ${directionLabel} direction, ${themeLabel} theme, ${zoomLabel}, and ${state.width}px frame width.`;
}

function getContextNavIconMarkup(icon) {
  if (icon === "more") {
    return '<path d="M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z" />';
  }

  return designSystemIconMarkupByKey[icon] ?? designSystemIconMarkupByKey.grid;
}

function normalizeContextNavPreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 560, 1320, contextNavPreviewDefaults.width),
    height: clampNumber(rawState.height, 420, 980, contextNavPreviewDefaults.height),
    stack: validContextNavStacks.has(rawState.stack) ? rawState.stack : contextNavPreviewDefaults.stack,
    labels: validContextNavLabels.has(rawState.labels) ? rawState.labels : contextNavPreviewDefaults.labels,
    open: validContextNavOpenStates.has(rawState.open) ? rawState.open : contextNavPreviewDefaults.open,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : contextNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : contextNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : contextNavPreviewDefaults.magnification,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : contextNavPreviewDefaults.accent,
  };

  return normalized;
}

function getContextNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return contextNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getGeneratedCanonicalPathReferenceId(familyKey) {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/([^/]+)\/([^/]+)$/);
  return match?.[1] === familyKey ? decodeURIComponent(match[2]) : null;
}

function getFormTemplateCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return formTemplateCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getContextNavCanonicalMatches(state) {
  const matches = contextNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.height === state.height &&
    reference.stack === state.stack &&
    reference.labels === state.labels &&
    reference.open === state.open &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification)
  ));

  const requestedRef = getRequestedContextNavCanonicalRef();
  if (!requestedRef) {
    return matches;
  }

  const requestedFamily = requestedRef.split("-")[0];
  const familyMatches = matches.filter((reference) => reference.ref.startsWith(`${requestedFamily}-`));
  return familyMatches.length > 0 ? familyMatches : matches;
}

function getRequestedContextNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref")
    ?? getGeneratedCanonicalPathReferenceId("display-settings");
}

function buildContextNavCanonicalHref(reference, accent = contextNavPreviewDefaults.accent) {
  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("height", String(reference.height));
  params.set("stack", reference.stack);
  params.set("labels", reference.labels);
  params.set("open", reference.open);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("accent", accent);
  params.set("ref", reference.ref);
  if (
    window.location.pathname.startsWith("/design-system/canonical-renderings/display-settings/")
    && reference.ref.startsWith("DSR-")
  ) {
    return `/design-system/canonical-renderings/display-settings/${encodeURIComponent(reference.ref)}`;
  }

  return `/design-system/components/context-nav?${params.toString()}`;
}

function updateDisplaySettingsCopy(direction) {
  const copySet = displaySettingsCopy[direction] ?? displaySettingsCopy.ltr;
  const ariaLabelSet = displaySettingsAriaLabels[direction] ?? displaySettingsAriaLabels.ltr;
  const accentLabelSet = displaySettingsAccentLabels[direction] ?? displaySettingsAccentLabels.ltr;

  for (const node of displaySettingsCopyNodes) {
    const key = node.dataset.displaySettingsCopy;
    if (!key) {
      continue;
    }
    const nextCopy = copySet[key];
    if (typeof nextCopy === "string") {
      node.textContent = nextCopy;
    }
  }

  for (const node of displaySettingsAriaLabelNodes) {
    const key = node.dataset.displaySettingsAriaLabel;
    if (!key) {
      continue;
    }
    const nextLabel = ariaLabelSet[key];
    if (typeof nextLabel === "string") {
      node.setAttribute("aria-label", nextLabel);
    }
  }

  for (const button of accentButtons) {
    const accent = (button.dataset.accent ?? "").toLowerCase();
    const nextLabel = accentLabelSet[accent];
    if (typeof nextLabel === "string") {
      button.setAttribute("aria-label", nextLabel);
    }
  }
}

function syncPageShellBannerDemo() {
  if (!pageShellBannerDemoController) {
    return;
  }

  for (const button of pageShellBannerVisibilityButtons) {
    const mode = button.dataset.pageShellBannerVisibility ?? "hide";
    const isActive = mode === (pageShellBannerDemoVisible ? "show" : "hide");
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function syncPageShellVisibilityButtons(buttons, activeValue, datasetKey) {
  for (const button of buttons) {
    const isActive = button.dataset[datasetKey] === activeValue;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function setPageShellBannerDemoVisible(visible) {
  pageShellBannerDemoVisible = visible;
  if (pageShellBannerDemoController) {
    if (visible) {
      pageShellBannerDemoController.showAll();
    } else {
      pageShellBannerDemoController.hide();
    }
  }
  syncPageShellBannerDemo();
}

function setPageShellTopNavMenuVisible(visible) {
  pageShellTopNavMenuVisible = visible;
  const shellPrimaryNav = shellTopNav?.querySelector(":scope > .primary-nav");
  shellPrimaryNav?.classList.toggle("hidden", !visible);

  if (!visible) {
    setPrimaryNavOverflowOpen(false);
    setMobileNavOpen(false);
  }

  syncPageShellVisibilityButtons(
    pageShellTopNavVisibilityButtons,
    visible ? "show" : "hide",
    "pageShellTopNavVisibility",
  );
  scheduleContextNavOffsetUpdate();
  window.requestAnimationFrame(() => {
    updatePrimaryNavOverflow();
    updateBreadcrumbOverflow();
  });
}

function ensurePageShellDemoProfile() {
  if (!(shellTopNav instanceof HTMLElement)) {
    return null;
  }

  let navUtilities = shellTopNav.querySelector(":scope > .nav-utilities");
  if (!(navUtilities instanceof HTMLElement)) {
    shellTopNav.insertAdjacentHTML("beforeend", '<div class="nav-utilities" data-page-shell-demo-profile></div>');
    navUtilities = shellTopNav.querySelector(":scope > .nav-utilities");
  }

  if (!(navUtilities instanceof HTMLElement)) {
    return null;
  }

  if (!navUtilities.querySelector(".profile-button")) {
    navUtilities.insertAdjacentHTML(
      "afterbegin",
      `
      <button
        id="profile-menu-button"
        class="profile-button"
        type="button"
        aria-expanded="false"
        aria-controls="profile-menu"
        data-page-shell-demo-profile-button
      >
        <span class="profile-avatar" aria-hidden="true">PR</span>
        <span class="profile-meta"><strong>Profile</strong></span>
      </button>
    `,
    );
  }

  if (!navUtilities.querySelector(".profile-menu")) {
    navUtilities.insertAdjacentHTML(
      "beforeend",
      `
      <div
        id="profile-menu"
        class="profile-menu hidden"
        role="menu"
        aria-labelledby="profile-menu-button"
        data-page-shell-demo-profile-menu
      >
        <button id="profile-language-button" class="menu-item menu-item-button" type="button" role="menuitem">
          Language settings
        </button>
        <a class="menu-item" href="#profile-settings-preview" role="menuitem">Profile settings</a>
        <button id="close-profile-menu" class="menu-item menu-item-button" type="button" role="menuitem">
          Logout
        </button>
      </div>
    `,
    );
  }

  const demoProfileButton = navUtilities.querySelector("[data-page-shell-demo-profile-button]");
  if (demoProfileButton instanceof HTMLButtonElement && demoProfileButton.dataset.pageShellDemoProfileBound !== "true") {
    demoProfileButton.dataset.pageShellDemoProfileBound = "true";
    demoProfileButton.addEventListener("click", () => {
      setPageShellProfileMenuOpen(!pageShellProfileMenuOpen);
    });
  }

  return navUtilities;
}

function setPageShellProfileMenuOpen(open) {
  pageShellProfileMenuOpen = open;
  if (open && !pageShellProfileVisible) {
    setPageShellProfileVisible(true);
  }

  const demoProfileButton = shellTopNav?.querySelector("[data-page-shell-demo-profile-button]");
  const demoProfileMenu = shellTopNav?.querySelector("[data-page-shell-demo-profile-menu]");
  demoProfileButton?.setAttribute("aria-expanded", String(open));
  demoProfileMenu?.classList.toggle("hidden", !open);

  syncPageShellVisibilityButtons(
    pageShellProfileMenuStateButtons,
    open ? "open" : "collapsed",
    "pageShellProfileMenuState",
  );
}

function setPageShellProfileVisible(visible) {
  pageShellProfileVisible = visible;

  if (visible) {
    ensurePageShellDemoProfile();
    setPageShellProfileMenuOpen(pageShellProfileMenuOpen);
  } else if (shellTopNav instanceof HTMLElement) {
    pageShellProfileMenuOpen = false;
    shellTopNav.querySelector("[data-page-shell-demo-profile-button]")?.remove();
    shellTopNav.querySelector("[data-page-shell-demo-profile-menu]")?.remove();
    const demoUtilities = shellTopNav.querySelector("[data-page-shell-demo-profile]");
    if (demoUtilities instanceof HTMLElement && demoUtilities.children.length === 0) {
      demoUtilities.remove();
    }
  }

  normalizeTopNavUtilityPresence();
  syncPageShellVisibilityButtons(
    pageShellProfileVisibilityButtons,
    visible ? "show" : "hide",
    "pageShellProfileVisibility",
  );
  syncPageShellVisibilityButtons(
    pageShellProfileMenuStateButtons,
    pageShellProfileMenuOpen ? "open" : "collapsed",
    "pageShellProfileMenuState",
  );
  window.requestAnimationFrame(() => updatePrimaryNavOverflow());
}

function getActiveContextNavCanonicalReference(matches) {
  const requestedRef = getRequestedContextNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function describeContextNavCanonicalCircumstances(state, matches) {
  const activeReference = getActiveContextNavCanonicalReference(matches);
  if (activeReference?.circumstance) {
    return activeReference.circumstance;
  }

  const viewportLabel = state.width <= 980 ? "mobile" : "desktop";
  const stackLabel = state.stack === "tall" ? "tall top stack" : "standard top stack";
  return `Ad hoc ${viewportLabel} context-nav view using ${stackLabel}, ${state.labels} labels, ${state.open} open state, ${state.direction.toUpperCase()} direction, ${state.theme} theme, ${Number(state.magnification)}% magnification, ${state.width}px width, and ${state.height}px height.`;
}

function getTopNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedReference = getTopNavCanonicalReferenceByRef(getRequestedTopNavCanonicalRef());

  if (requestedReference) {
    return normalizePreviewState({
      width: requestedReference.width,
      fixture: requestedReference.fixture,
      open: requestedReference.open,
      theme: requestedReference.theme,
      direction: requestedReference.direction,
      magnification: requestedReference.magnification,
      accent: requestedReference.accent ?? params.get("accent") ?? topNavPreviewDefaults.accent,
    });
  }

  return normalizePreviewState({
    width: params.get("width") ?? topNavPreviewDefaults.width,
    fixture: params.get("fixture") ?? topNavPreviewDefaults.fixture,
    open: params.get("open") ?? topNavPreviewDefaults.open,
    theme: params.get("theme") ?? topNavPreviewDefaults.theme,
    direction: params.get("dir") ?? topNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? topNavPreviewDefaults.magnification,
    accent: params.get("accent") ?? topNavPreviewDefaults.accent,
  });
}

function getSubNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedReference = getSubNavCanonicalReferenceByRef(params.get("ref")) ?? getLegacySubNavCanonicalReference(params);

  if (requestedReference) {
    return normalizeSubNavPreviewState({
      width: requestedReference.width,
      state: requestedReference.state,
      search: requestedReference.search,
      theme: requestedReference.theme,
      direction: requestedReference.direction,
      magnification: requestedReference.magnification,
      locale: requestedReference.locale,
      accent: params.get("accent") ?? subNavPreviewDefaults.accent,
    });
  }

  return normalizeSubNavPreviewState({
    width: params.get("width") ?? subNavPreviewDefaults.width,
    state: params.get("state") ?? subNavPreviewDefaults.state,
    search: params.get("search") ?? subNavPreviewDefaults.search,
    theme: params.get("theme") ?? subNavPreviewDefaults.theme,
    direction: params.get("dir") ?? subNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? subNavPreviewDefaults.magnification,
    locale: params.get("locale") ?? subNavPreviewDefaults.locale,
    accent: params.get("accent") ?? subNavPreviewDefaults.accent,
  });
}

function getContextNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedReference = getContextNavCanonicalReferenceByRef(getRequestedContextNavCanonicalRef());
  const requestedFormTemplateReference = getFormTemplateCanonicalReferenceByRef(
    getGeneratedCanonicalPathReferenceId("form-template"),
  );

  if (requestedFormTemplateReference) {
    return normalizeContextNavPreviewState({
      width: contextNavPreviewDefaults.width,
      height: contextNavPreviewDefaults.height,
      stack: contextNavPreviewDefaults.stack,
      labels: contextNavPreviewDefaults.labels,
      open: contextNavPreviewDefaults.open,
      theme: requestedFormTemplateReference.theme,
      direction: requestedFormTemplateReference.direction,
      magnification: requestedFormTemplateReference.magnification,
      accent: contextNavPreviewDefaults.accent,
    });
  }

  if (requestedReference) {
    return normalizeContextNavPreviewState({
      width: params.get("width") ?? requestedReference.width,
      height: params.get("height") ?? requestedReference.height,
      stack: params.get("stack") ?? requestedReference.stack,
      labels: params.get("labels") ?? requestedReference.labels,
      open: params.get("open") ?? requestedReference.open,
      theme: params.get("theme") ?? requestedReference.theme,
      direction: params.get("dir") ?? requestedReference.direction,
      magnification: params.get("zoom") ?? requestedReference.magnification,
      accent: params.get("accent") ?? requestedReference.accent,
    });
  }

  return normalizeContextNavPreviewState({
    width: params.get("width") ?? contextNavPreviewDefaults.width,
    height: params.get("height") ?? contextNavPreviewDefaults.height,
    stack: params.get("stack") ?? contextNavPreviewDefaults.stack,
    labels: params.get("labels") ?? contextNavPreviewDefaults.labels,
    open: params.get("open") ?? contextNavPreviewDefaults.open,
    theme: params.get("theme") ?? contextNavPreviewDefaults.theme,
    direction: params.get("dir") ?? contextNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? contextNavPreviewDefaults.magnification,
    accent: params.get("accent") ?? contextNavPreviewDefaults.accent,
  });
}

function getTopNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return topNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getGeneratedTopNavCanonicalPathReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/top-nav\/([^/]+)$/);
  return match?.[1] ?? null;
}

function getRequestedTopNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref") ?? getGeneratedTopNavCanonicalPathReferenceId();
}

function getRequestedTopNavCanonicalReference() {
  return getTopNavCanonicalReferenceByRef(getRequestedTopNavCanonicalRef());
}

function getTopNavCanonicalMatches(state) {
  return topNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.fixture === state.fixture &&
    reference.open === state.open &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification)
  ));
}

function getActiveTopNavCanonicalReference(matches) {
  const requestedRef = getRequestedTopNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function buildTopNavCanonicalHref(reference, accent = topNavPreviewDefaults.accent) {
  if (getGeneratedTopNavCanonicalPathReferenceId()) {
    return `/design-system/canonical-renderings/top-nav/${encodeURIComponent(reference.ref)}`;
  }

  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("fixture", reference.fixture);
  params.set("open", reference.open);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("accent", accent);
  params.set("ref", reference.ref);
  return `/design-system/components/top-nav?${params.toString()}`;
}

function getCurrentTopNavPreviewState(overrides = {}) {
  const requestedReference = getRequestedTopNavCanonicalReference();
  const currentWidth = previewWidthInput?.value
    ?? previewFrame?.style.getPropertyValue("--top-nav-preview-width").replace("px", "").trim()
    ?? requestedReference?.width
    ?? topNavPreviewDefaults.width;
  const currentTheme = topNavSurfaceMode === "canonical"
    ? requestedReference?.theme ?? getCurrentSurfaceTheme()
    : getCurrentSurfaceTheme();
  const currentDirection = topNavSurfaceMode === "canonical"
    ? requestedReference?.direction ?? getTopNavSurfaceDirection()
    : getTopNavSurfaceDirection();
  const currentMagnification = Array.from(magnificationButtons).find((button) => button.classList.contains("active"))
    ?.dataset.magnificationOption
    ?? new URLSearchParams(window.location.search).get("zoom")
    ?? requestedReference?.magnification
    ?? String(topNavPreviewDefaults.magnification);
  const currentAccent = Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
    ?? new URLSearchParams(window.location.search).get("accent")
    ?? requestedReference?.accent
    ?? topNavPreviewDefaults.accent;

  return normalizePreviewState({
    width: overrides.width ?? currentWidth,
    fixture: overrides.fixture ?? requestedReference?.fixture ?? activeTopNavPreviewFixture,
    open: overrides.open ?? requestedReference?.open ?? activeTopNavPreviewOpenState,
    theme: overrides.theme ?? currentTheme,
    direction: overrides.direction ?? currentDirection,
    magnification: overrides.magnification ?? currentMagnification,
    accent: overrides.accent ?? currentAccent,
  });
}

function describeTopNavCanonicalCircumstances(state, matches) {
  const activeReference = getActiveTopNavCanonicalReference(matches);
  if (activeReference?.circumstance) {
    return activeReference.circumstance;
  }

  const viewportLabel = state.width <= 560 || state.open === "mobile" ? "mobile" : "desktop";
  return `Ad hoc ${viewportLabel} top-nav view using the ${state.fixture} fixture, ${state.open} open state, ${state.direction.toUpperCase()} direction, ${state.theme} theme, ${Number(state.magnification)}% magnification, and ${state.width}px frame width.`;
}

function syncTopNavCanonicalUrl(reference, accent = topNavPreviewDefaults.accent) {
  if (topNavSurfaceMode !== "canonical" || !reference || !window.history?.replaceState) {
    return;
  }

  const nextUrl = buildTopNavCanonicalHref(reference, accent);
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function updateTopNavCanonicalMeta(state) {
  const matches = getTopNavCanonicalMatches(state);
  const activeReference = getActiveTopNavCanonicalReference(matches);
  const activeIndex = activeReference ? topNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref) : -1;
  const prevReference = activeIndex > 0 ? topNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < topNavCanonicalReferenceStates.length - 1
    ? topNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (topNavCanonicalMatchList) {
    topNavCanonicalMatchList.textContent = matches.length > 0
      ? matches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }

  if (topNavCanonicalCircumstances) {
    topNavCanonicalCircumstances.textContent = describeTopNavCanonicalCircumstances(state, matches);
  }

  if (topNavCanonicalCurrent) {
    topNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical";
  }

  if (topNavCanonicalPrev) {
    if (prevReference) {
      topNavCanonicalPrev.href = buildTopNavCanonicalHref(prevReference, state.accent);
      topNavCanonicalPrev.removeAttribute("aria-disabled");
    } else {
      topNavCanonicalPrev.href = "#";
      topNavCanonicalPrev.setAttribute("aria-disabled", "true");
    }
  }

  if (topNavCanonicalNext) {
    if (nextReference) {
      topNavCanonicalNext.href = buildTopNavCanonicalHref(nextReference, state.accent);
      topNavCanonicalNext.removeAttribute("aria-disabled");
    } else {
      topNavCanonicalNext.href = "#";
      topNavCanonicalNext.setAttribute("aria-disabled", "true");
    }
  }

  syncTopNavCanonicalUrl(activeReference, state.accent);
}

function syncSubNavPreviewUrl(state) {
  if (subNavSurfaceMode !== "exploration" || !subNavPreviewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const activeState = normalizeSubNavPreviewState({
    ...state,
    width: state?.width ?? subNavPreviewWidthInput?.value ?? subNavPreviewDefaults.width,
    theme: state?.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: state?.direction ?? getSubNavSurfaceDirection(),
    magnification:
      state?.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    locale:
      state?.locale
      ?? subNavPreviewLocaleButtons.find((button) => button.classList.contains("active"))?.dataset.subNavLocale
      ?? subNavPreviewDefaults.locale,
    accent:
      state?.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });

  params.set("width", String(activeState.width));
  params.set("state", activeState.state);
  params.set("search", activeState.search);
  params.set("theme", activeState.theme);
  params.set("dir", activeState.direction);
  params.set("zoom", String(Number(activeState.magnification)));
  params.set("locale", activeState.locale);
  params.set("accent", activeState.accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncCanonicalRenderUrl(reference, accent = subNavPreviewDefaults.accent) {
  if (subNavSurfaceMode !== "canonical" || !reference || !window.history?.replaceState) {
    return;
  }

  const nextUrl = buildSubNavCanonicalHref(reference, accent);
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function syncContextNavPreviewUrl(state) {
  if (contextNavSurfaceMode !== "exploration" || !contextNavPreviewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const activeState = normalizeContextNavPreviewState(state ?? getCurrentContextNavPreviewState());
  params.set("width", String(activeState.width));
  params.set("height", String(activeState.height));
  params.set("stack", activeState.stack);
  params.set("labels", activeState.labels);
  params.set("open", activeState.open);
  params.set("theme", activeState.theme);
  params.set("dir", activeState.direction);
  params.set("zoom", String(Number(activeState.magnification)));
  params.set("accent", activeState.accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncTopNavPreviewUrl() {
  if (topNavSurfaceMode !== "exploration" || !previewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const width = clampNumber(previewWidthInput?.value, 480, 1320, topNavPreviewDefaults.width);
  const theme = getCurrentSurfaceTheme();
  const direction = getTopNavSurfaceDirection();
  const magnification = Array.from(magnificationButtons).find((button) => button.classList.contains("active"))
    ?.dataset.magnificationOption ?? String(topNavPreviewDefaults.magnification);
  const accent = Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
    ?? topNavPreviewDefaults.accent;

  params.set("width", String(width));
  params.set("fixture", activeTopNavPreviewFixture);
  params.set("open", activeTopNavPreviewOpenState);
  params.set("theme", theme);
  params.set("dir", direction);
  params.set("zoom", String(Number(magnification)));
  params.set("accent", accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function setCanonicalRenderLayoutWidth(layoutNode, width) {
  if (!(layoutNode instanceof HTMLElement)) {
    return;
  }

  layoutNode.style.setProperty("--canonical-render-layout-width", `${width}px`);
}

function updateContextNavReviewFrameOffset() {
  if (!(contextNavPreviewFrame instanceof HTMLElement) || !(shellTopNav instanceof HTMLElement)) {
    return;
  }

  const shellTopNavHeight = shellTopNav.offsetHeight;
  const shellSubNavHeight = shellSubNav instanceof HTMLElement ? shellSubNav.offsetHeight : 0;
  const reviewOffset = shellTopNavHeight + shellSubNavHeight + 16;

  contextNavPreviewFrame.style.setProperty("--context-nav-review-top", `${Math.ceil(reviewOffset)}px`);
}

function applySubNavPreviewState(state) {
  if (!subNavPreviewFrame || !subNavPreviewSearchInput || !subNavPreviewShell) {
    return;
  }

  const normalizedState = normalizeSubNavPreviewState({
    ...state,
    theme: state.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: state.direction ?? getSubNavSurfaceDirection(),
    magnification:
      state.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    accent:
      state.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });
  const locale = subNavPreviewLocales[normalizedState.locale] ?? subNavPreviewLocales.standard;
  document.body.dataset.renderStatus = "settling";
  subNavPreviewShell.dataset.renderStatus = "settling";
  subNavPreviewShell.dataset.canonicalState = [
    normalizedState.state,
    normalizedState.search,
    normalizedState.locale,
    normalizedState.direction,
    normalizedState.theme,
    String(normalizedState.width),
  ].join(":");
  subNavPreviewShell.setAttribute("dir", normalizedState.direction);
  subNavPreviewFrame.style.setProperty("--sub-nav-preview-width", `${normalizedState.width}px`);
  setCanonicalRenderLayoutWidth(subNavCanonicalRenderLayout, normalizedState.width + 96);
  subNavPreviewSearchInput.placeholder = locale.placeholder;
  if (subNavPreviewHomeLink) {
    subNavPreviewHomeLink.textContent = locale.home;
  }
  if (subNavPreviewMiddleALink) {
    subNavPreviewMiddleALink.textContent = locale.middleA;
  }
  if (subNavPreviewMiddleBLink) {
    subNavPreviewMiddleBLink.textContent = locale.middleB;
  }
  if (subNavPreviewPageMinusOneLink) {
    subNavPreviewPageMinusOneLink.dataset.fullLabel = locale.pageMinusOne;
    subNavPreviewPageMinusOneLink.dataset.shortLabel = locale.pageMinusOneShort ?? locale.pageMinusOne;
    setBreadcrumbButtonLabel(subNavPreviewPageMinusOneLink, locale.pageMinusOne);
  }
  if (subNavPreviewCurrentLabel) {
    subNavPreviewCurrentLabel.textContent = locale.current;
  }
  if (subNavPreviewCompactHome) {
    subNavPreviewCompactHome.textContent = locale.home;
  }
  if (subNavPreviewCompactMiddleA) {
    subNavPreviewCompactMiddleA.textContent = locale.middleA;
  }
  if (subNavPreviewCompactMiddleB) {
    subNavPreviewCompactMiddleB.textContent = locale.middleB;
  }
  if (subNavPreviewCompactPageMinusOne) {
    subNavPreviewCompactPageMinusOne.textContent = locale.pageMinusOne;
  }
  if (subNavPreviewCompactCurrent) {
    subNavPreviewCompactCurrent.textContent = locale.current;
  }

  subNavPreviewShell.classList.toggle("sub-nav-preview-mobile", normalizedState.state === "mobile");
  subNavPreviewBreadcrumbNav?.classList.toggle("hidden", false);
  subNavPreviewBreadcrumbCompact?.classList.add("hidden");
  subNavPreviewBreadcrumbList?.classList.remove("hidden");
  subNavPreviewCollapsedItem?.classList.remove("hidden");
  subNavPreviewSeparatorBeforeCollapsed?.classList.remove("hidden");
  subNavPreviewPageMinusOneItem?.classList.remove("hidden");
  subNavPreviewSeparatorBeforePageMinusOne?.classList.remove("hidden");
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);

  if (normalizedState.state === "shallow") {
    subNavPreviewCollapsedItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforeCollapsed?.classList.add("hidden");
    subNavPreviewPageMinusOneItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforePageMinusOne?.classList.add("hidden");
  }

  if (normalizedState.state === "reduced-page-minus-one") {
    subNavPreviewPageMinusOneItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforePageMinusOne?.classList.add("hidden");
  }

  if (normalizedState.state === "reduced-middle") {
    subNavPreviewCollapsedItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforeCollapsed?.classList.add("hidden");
  }

  if (normalizedState.state === "compact") {
    subNavPreviewBreadcrumbList?.classList.add("hidden");
    subNavPreviewBreadcrumbCompact?.classList.remove("hidden");
  }

  if (normalizedState.state === "mobile") {
    subNavPreviewBreadcrumbNav?.classList.add("hidden");
  }

  syncSubNavPreviewRowLayout(normalizedState.state);

  subNavPreviewSearchInput.value = "";
  if (subNavPreviewWidthInput) {
    subNavPreviewWidthInput.value = String(normalizedState.width);
  }
  if (subNavPreviewWidthReadout) {
    subNavPreviewWidthReadout.textContent = `Preview width: ${normalizedState.width}px`;
  }
  for (const button of subNavPreviewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.subNavWidthPreset === String(normalizedState.width));
  }
  for (const button of subNavPreviewStateButtons) {
    button.classList.toggle("active", button.dataset.subNavState === normalizedState.state);
  }
  for (const button of subNavPreviewSearchStateButtons) {
    button.classList.toggle("active", button.dataset.subNavSearchState === normalizedState.search);
  }
  for (const button of subNavPreviewLocaleButtons) {
    button.classList.toggle("active", button.dataset.subNavLocale === normalizedState.locale);
  }
  if (subNavPreviewSummary) {
    const searchLabel = normalizedState.search === "active" ? "active search" : "inactive search";
    subNavPreviewSummary.textContent = `State: ${normalizedState.state}, ${searchLabel}, locale: ${normalizedState.locale}, width: ${normalizedState.width}px`;
  }
  const canonicalMatches = getSubNavCanonicalMatches(normalizedState);
  const activeCanonicalReference = getActiveSubNavCanonicalReference(canonicalMatches);
  subNavPreviewShell.dataset.breadcrumbCanonicalMode =
    activeCanonicalReference && (activeCanonicalReference.ref === "BCR-011" || activeCanonicalReference.ref === "BCR-012")
      ? "button-truncation"
      : "default";
  if (subNavCanonicalMatchList) {
    subNavCanonicalMatchList.textContent = canonicalMatches.length > 0
      ? canonicalMatches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }
  if (subNavCanonicalCircumstances) {
    subNavCanonicalCircumstances.textContent = describeSubNavCanonicalCircumstances(normalizedState, canonicalMatches);
  }
  updateSubNavCanonicalStepper(normalizedState, canonicalMatches);
  syncCanonicalRenderUrl(activeCanonicalReference, normalizedState.accent);
  hideSharedTooltip();

  syncSubNavPreviewUrl(normalizedState);
  const renderPass = ++subNavPreviewRenderPass;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (renderPass !== subNavPreviewRenderPass) {
        return;
      }

      document.body.dataset.renderStatus = "ready";
      subNavPreviewShell.dataset.renderStatus = "ready";

      if (normalizedState.state !== "mobile" && normalizedState.state !== "compact") {
        applyResponsiveBreadcrumbPriority({
          list: subNavPreviewBreadcrumbList,
          container: subNavPreviewBreadcrumbList?.parentElement,
          pageMinusOneLink: subNavPreviewPageMinusOneLink,
          pageMinusOneItem: subNavPreviewPageMinusOneItem,
          separatorBeforePageMinusOne: subNavPreviewSeparatorBeforePageMinusOne,
          collapsedItem: subNavPreviewCollapsedItem,
          separatorBeforeCollapsed: subNavPreviewSeparatorBeforeCollapsed,
          compact: subNavPreviewBreadcrumbCompact,
          allowPageMinusOne: normalizedState.state !== "reduced-page-minus-one" && normalizedState.state !== "shallow",
          allowCollapsed: normalizedState.state !== "reduced-middle" && normalizedState.state !== "shallow",
          closeExpandedMenus: () => {
            setSubNavPreviewBreadcrumbMenuOpen(false);
            setSubNavPreviewBreadcrumbCompactMenuOpen(false);
          },
        });
      } else {
        updateBreadcrumbOverflowTooltips();
      }

      scheduleSubNavCanonicalFitScaleUpdate();
    });
  });

  if (normalizedState.search === "active") {
    window.requestAnimationFrame(() => {
      subNavPreviewSearchInput.focus();
      subNavPreviewSearchInput.setSelectionRange(0, 0);
    });
  } else {
    subNavPreviewSearchInput.blur();
  }
}

wireSharedTooltipSystem();

function getCurrentSubNavPreviewState(overrides = {}) {
  return normalizeSubNavPreviewState({
    width: overrides.width ?? subNavPreviewWidthInput?.value ?? subNavPreviewDefaults.width,
    state:
      overrides.state
      ?? subNavPreviewStateButtons.find((button) => button.classList.contains("active"))?.dataset.subNavState
      ?? subNavPreviewDefaults.state,
    search:
      overrides.search
      ?? subNavPreviewSearchStateButtons.find((button) => button.classList.contains("active"))?.dataset.subNavSearchState
      ?? subNavPreviewDefaults.search,
    theme: overrides.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: overrides.direction ?? getSubNavSurfaceDirection(),
    magnification:
      overrides.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    locale:
      overrides.locale
      ?? subNavPreviewLocaleButtons.find((button) => button.classList.contains("active"))?.dataset.subNavLocale
      ?? subNavPreviewDefaults.locale,
    accent:
      overrides.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });
}

function renderContextNavPreviewNav(state) {
  if (!contextNavPreviewMainItems || !contextNavMoreMenu || !contextNavPreviewShell) {
    return;
  }

  const labelKey = state.labels === "long" ? "long" : "standard";
  const primaryItems = contextNavPrimaryFixtures[state.stack].map((item) => ({ ...item, label: item[labelKey] }));
  const isMobile = state.width <= 980;
  const shouldScrollTop = !isMobile && state.stack === "tall";
  const { visibleItems: visiblePrimaryItems, overflowItems: overflowPrimaryItems } = partitionContextNavItems(primaryItems, {
    isMobile,
    currentItemKey: primaryItems.find((item) => item.active)?.href ?? null,
    maxVisibleItems: 4,
    getItemKey: (item) => item.href,
  });
  const filterLabel = contextNavBottomFixtures.filter[labelKey];
  const accessLabel = contextNavBottomFixtures.accessibility[labelKey];
  const moreLabel = contextNavBottomFixtures.more[labelKey];

  contextNavPreviewMainItems.innerHTML = visiblePrimaryItems.map((item) => {
    const activeClass = item.active ? " active" : "";
    const currentAttr = item.active ? ' aria-current="page"' : "";
    return `
      <a class="context-nav-item${activeClass}" href="${item.href}" data-tooltip="${item.label}"${currentAttr}>
        <span class="context-nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">${getContextNavIconMarkup(item.icon)}</svg>
        </span>
        <span class="context-nav-label">${item.label}</span>
      </a>
    `;
  }).join("");
  contextNavPreviewMainItems.classList.toggle("context-nav-main-scroll", shouldScrollTop);

  if (contextNavFilterLabel) {
    contextNavFilterLabel.textContent = filterLabel;
  }
  if (filterPanelButton) {
    filterPanelButton.dataset.tooltip = contextNavBottomFixtures.filter.tooltip;
  }
  if (contextNavAccessLabel) {
    contextNavAccessLabel.textContent = accessLabel;
  }
  if (accessibilityButton) {
    accessibilityButton.dataset.tooltip = contextNavBottomFixtures.accessibility.tooltip;
  }
  if (contextNavMoreLabel) {
    contextNavMoreLabel.textContent = moreLabel;
  }

  contextNavMoreMenu.innerHTML = (
    isMobile
      ? [
          ...overflowPrimaryItems.map((item) => `<a class="menu-item" href="${item.href}" role="menuitem">${item.label}</a>`),
          '<button id="context-nav-more-filter" class="menu-item menu-item-button" type="button" role="menuitem">Filters</button>',
          '<button id="context-nav-more-accessibility" class="menu-item menu-item-button" type="button" role="menuitem">Accessibility</button>',
        ].join("")
      : ""
  );

  contextNavPreviewShell.classList.toggle("context-nav-preview-mobile", isMobile);
  contextNavPreviewShell.classList.toggle("context-nav-preview-desktop", !isMobile);
  contextNavPreviewShell.dataset.contextNavStack = state.stack;
  contextNavPreviewShell.dataset.contextNavLabels = state.labels;
  contextNavPreviewShell.dataset.contextNavScrollable = String(shouldScrollTop);
  if (contextNavPreviewMeta) {
    contextNavPreviewMeta.textContent = "Profile";
  }
}

function updateContextNavCanonicalMeta(state) {
  const matches = getContextNavCanonicalMatches(state);
  const activeReference = getActiveContextNavCanonicalReference(matches);
  const activeIndex = activeReference ? contextNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref) : -1;
  const prevReference = activeIndex > 0 ? contextNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < contextNavCanonicalReferenceStates.length - 1
    ? contextNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (contextNavCanonicalMatchList) {
    contextNavCanonicalMatchList.textContent = matches.length > 0
      ? matches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }

  if (contextNavCanonicalCircumstances) {
    contextNavCanonicalCircumstances.textContent = describeContextNavCanonicalCircumstances(state, matches);
  }

  if (contextNavCanonicalCurrent) {
    contextNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical";
  }

  if (contextNavCanonicalPrev) {
    if (prevReference) {
      contextNavCanonicalPrev.href = buildContextNavCanonicalHref(prevReference, state.accent);
      contextNavCanonicalPrev.removeAttribute("aria-disabled");
    } else {
      contextNavCanonicalPrev.href = "#";
      contextNavCanonicalPrev.setAttribute("aria-disabled", "true");
    }
  }

  if (contextNavCanonicalNext) {
    if (nextReference) {
      contextNavCanonicalNext.href = buildContextNavCanonicalHref(nextReference, state.accent);
      contextNavCanonicalNext.removeAttribute("aria-disabled");
    } else {
      contextNavCanonicalNext.href = "#";
      contextNavCanonicalNext.setAttribute("aria-disabled", "true");
    }
  }
}

function applyContextNavPreviewState(state) {
  if (!contextNavPreviewFrame || !contextNavPreviewShell) {
    return;
  }

  const normalizedState = normalizeContextNavPreviewState({
    ...state,
    theme: state.theme ?? getCurrentSurfaceTheme() ?? contextNavPreviewDefaults.theme,
    direction: state.direction ?? getContextNavSurfaceDirection(),
    magnification:
      state.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? contextNavPreviewDefaults.magnification,
    accent:
      state.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? contextNavPreviewDefaults.accent,
  });

  document.body.dataset.renderStatus = "settling";
  contextNavPreviewShell.setAttribute("dir", normalizedState.direction);
  contextNavPreviewFrame.style.setProperty("--context-nav-preview-width", `${normalizedState.width}px`);
  contextNavPreviewFrame.style.setProperty("--context-nav-preview-height", `${normalizedState.height}px`);
  setCanonicalRenderLayoutWidth(contextNavCanonicalRenderLayout, normalizedState.width + 96);

  renderContextNavPreviewNav(normalizedState);
  setContextNavMoreOpen(false);
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(false);

  if (contextNavPreviewWidthInput) {
    contextNavPreviewWidthInput.value = String(normalizedState.width);
  }
  if (contextNavPreviewHeightInput) {
    contextNavPreviewHeightInput.value = String(normalizedState.height);
  }
  for (const button of contextNavPreviewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.contextNavWidthPreset === String(normalizedState.width));
  }
  for (const button of contextNavPreviewHeightPresetButtons) {
    button.classList.toggle("active", button.dataset.contextNavHeightPreset === String(normalizedState.height));
  }
  for (const button of contextNavPreviewStackButtons) {
    button.classList.toggle("active", button.dataset.contextNavStack === normalizedState.stack);
  }
  for (const button of contextNavPreviewLabelButtons) {
    button.classList.toggle("active", button.dataset.contextNavLabels === normalizedState.labels);
  }
  for (const button of contextNavPreviewOpenButtons) {
    button.classList.toggle("active", button.dataset.contextNavOpen === normalizedState.open);
  }

  if (contextNavPreviewSummary) {
    contextNavPreviewSummary.textContent = `State: ${normalizedState.stack} stack, ${normalizedState.labels} labels, ${normalizedState.open} open state, ${normalizedState.width}px by ${normalizedState.height}px`;
  }

  updateContextNavCanonicalMeta(normalizedState);
  syncContextNavPreviewUrl(normalizedState);
  hideSharedTooltip();

  window.requestAnimationFrame(() => {
    updateContextNavPreviewShellLayout();
    if (shouldTrackHostContextNavOffset()) {
      updateContextNavOffset();
    }
    if (normalizedState.open === "more") {
      setContextNavMoreOpen(true);
    }
    if (normalizedState.open === "filter") {
      setFilterPanelOpen(true);
    }
    if (normalizedState.open === "accessibility") {
      setAccessibilityDrawerOpen(true);
    }

    document.body.dataset.renderStatus = "ready";
  });
}

function getCurrentContextNavPreviewState(overrides = {}) {
  const liveOpenState = isAccessibilityDrawerOpen()
    ? "accessibility"
    : isFilterOptionsPanelOpen()
      ? "filter"
      : isFilterPanelOpen()
        ? "filter"
        : isContextNavMoreOpen()
          ? "more"
          : null;

  return normalizeContextNavPreviewState({
    width: overrides.width ?? contextNavPreviewWidthInput?.value ?? contextNavPreviewDefaults.width,
    height: overrides.height ?? contextNavPreviewHeightInput?.value ?? contextNavPreviewDefaults.height,
    stack:
      overrides.stack
      ?? contextNavPreviewStackButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavStack
      ?? contextNavPreviewDefaults.stack,
    labels:
      overrides.labels
      ?? contextNavPreviewLabelButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavLabels
      ?? contextNavPreviewDefaults.labels,
    open:
      overrides.open
      ?? liveOpenState
      ?? contextNavPreviewOpenButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavOpen
      ?? contextNavPreviewDefaults.open,
    theme: overrides.theme ?? getCurrentSurfaceTheme() ?? contextNavPreviewDefaults.theme,
    direction: overrides.direction ?? getContextNavSurfaceDirection(),
    magnification:
      overrides.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? contextNavPreviewDefaults.magnification,
    accent:
      overrides.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? contextNavPreviewDefaults.accent,
  });
}

function setPrimaryNavOverflowOpen(open) {
  primaryNavOverflowButton?.setAttribute("aria-expanded", String(open));
  primaryNavOverflowMenu?.classList.toggle("hidden", !open);
}

function isPrimaryNavOverflowOpen() {
  return primaryNavOverflowButton?.getAttribute("aria-expanded") === "true";
}

function setPrimaryNavLinkHidden(node, hidden) {
  node.classList.toggle("hidden", hidden);
}

function renderPrimaryNavOverflowMenu(links) {
  if (!primaryNavOverflowMenu) {
    return;
  }

  primaryNavOverflowMenu.innerHTML = links
    .map((link) => {
      const href = link.getAttribute("href") ?? "#";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      return `<a class="menu-item" href="${href}" role="menuitem"${currentAttr}>${label}</a>`;
    })
    .join("");
}

function measurePrimaryNavOverflowButton(label) {
  if (!primaryNavOverflow || !primaryNavOverflowButton) {
    return 0;
  }

  primaryNavOverflow.classList.remove("hidden");
  primaryNavOverflow.classList.add("primary-nav-overflow-measuring");
  primaryNavOverflowButton.textContent = label;
  const width = primaryNavOverflow.getBoundingClientRect().width;
  primaryNavOverflow.classList.add("hidden");
  primaryNavOverflow.classList.remove("primary-nav-overflow-measuring");
  return width;
}

function getVisiblePrimaryNavLinks() {
  return primaryNavLinks.filter((link) => !link.classList.contains("hidden"));
}

function primaryNavFits() {
  if (!previewPrimaryNav) {
    return true;
  }

  return previewPrimaryNav.scrollWidth <= previewPrimaryNav.clientWidth;
}

function primaryNavOverlapsUtilities() {
  const currentNavUtilities = previewFrame?.querySelector(".nav-utilities") ?? document.querySelector(".nav-utilities");
  if (!currentNavUtilities) {
    return false;
  }

  const navUtilitiesRect = currentNavUtilities.getBoundingClientRect();
  const visibleLinks = getVisiblePrimaryNavLinks();

  for (const link of visibleLinks) {
    if (horizontalRectsOverlap(link.getBoundingClientRect(), navUtilitiesRect)) {
      return true;
    }
  }

  if (primaryNavOverflowButton && !primaryNavOverflow.classList.contains("hidden")) {
    const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
    if (horizontalRectsOverlap(overflowRect, navUtilitiesRect)) {
      return true;
    }
  }
  return false;
}

function primaryNavOverflowOverlapsVisibleLinks() {
  if (!primaryNavOverflowButton || primaryNavOverflow.classList.contains("hidden")) {
    return false;
  }

  const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
  return getVisiblePrimaryNavLinks().some((link) => horizontalRectsOverlap(link.getBoundingClientRect(), overflowRect));
}

function updatePrimaryNavOverflow() {
  if (!previewPrimaryNav || !previewTopNav || primaryNavLinks.length === 0 || !primaryNavOverflow || !primaryNavOverflowButton) {
    return;
  }

  const requestedReference = getRequestedTopNavCanonicalReference();
  const maxVisiblePrimaryItems = typeof requestedReference?.maxVisiblePrimaryItems === "number"
    ? requestedReference.maxVisiblePrimaryItems
    : null;
  const forceMobileShell = requestedReference?.forceMobileShell === true;

  previewTopNav.classList.remove("force-mobile-nav");
  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  primaryNavOverflowButton.textContent = "More";
  renderPrimaryNavOverflowMenu([]);

  for (const link of primaryNavLinks) {
    setPrimaryNavLinkHidden(link, false);
  }

  if (forceMobileShell) {
    previewTopNav.classList.add("force-mobile-nav");
    return;
  }

  if (
    primaryNavFits()
    && !primaryNavOverlapsUtilities()
    && !(typeof maxVisiblePrimaryItems === "number" && getVisiblePrimaryNavLinks().length > maxVisiblePrimaryItems)
  ) {
    return;
  }

  primaryNavOverflowButton.textContent = "More";
  primaryNavOverflow.classList.remove("hidden");

  while (
    getVisiblePrimaryNavLinks().length > 2
    && (
      !primaryNavFits()
      || primaryNavOverlapsUtilities()
      || primaryNavOverflowOverlapsVisibleLinks()
      || (typeof maxVisiblePrimaryItems === "number" && getVisiblePrimaryNavLinks().length > maxVisiblePrimaryItems)
    )
  ) {
    const visibleLinks = getVisiblePrimaryNavLinks();
    const lastVisibleLink = visibleLinks.at(-1);
    if (!lastVisibleLink) {
      break;
    }
    setPrimaryNavLinkHidden(lastVisibleLink, true);
  }

  if (
    primaryNavFits()
    && !primaryNavOverlapsUtilities()
    && !primaryNavOverflowOverlapsVisibleLinks()
    && !(typeof maxVisiblePrimaryItems === "number" && getVisiblePrimaryNavLinks().length > maxVisiblePrimaryItems)
  ) {
    renderPrimaryNavOverflowMenu(primaryNavLinks.filter((link) => link.classList.contains("hidden")));
    return;
  }

  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  previewTopNav.classList.add("force-mobile-nav");
}

function setScopedNavLinkHidden(node, hidden) {
  node?.classList.toggle("hidden", hidden);
}

function renderScopedPrimaryNavOverflowMenu(menu, links) {
  if (!menu) {
    return;
  }

  menu.innerHTML = links
    .map((link) => {
      const href = link.getAttribute("href") ?? "#";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      return `<a class="menu-item" href="${href}" role="menuitem"${currentAttr}>${label}</a>`;
    })
    .join("");
}

function getScopedVisiblePrimaryNavLinks(links) {
  return links.filter((link) => !link.classList.contains("hidden"));
}

function scopedPrimaryNavFits(primaryNavNode) {
  if (!primaryNavNode) {
    return true;
  }

  return primaryNavNode.scrollWidth <= primaryNavNode.clientWidth;
}

function horizontalRectsOverlap(rectA, rectB) {
  return rectA.left < rectB.right && rectA.right > rectB.left;
}

function scopedPrimaryNavOverlapsUtilities(primaryNavNode, links, overflowNode, overflowButtonNode, navUtilitiesNode) {
  if (!navUtilitiesNode) {
    return false;
  }

  const navUtilitiesRect = navUtilitiesNode.getBoundingClientRect();
  const visibleLinks = getScopedVisiblePrimaryNavLinks(links);

  for (const link of visibleLinks) {
    if (horizontalRectsOverlap(link.getBoundingClientRect(), navUtilitiesRect)) {
      return true;
    }
  }

  if (overflowButtonNode && overflowNode && !overflowNode.classList.contains("hidden")) {
    const overflowRect = overflowButtonNode.getBoundingClientRect();
    if (horizontalRectsOverlap(overflowRect, navUtilitiesRect)) {
      return true;
    }
  }

  if (!primaryNavNode) {
    return false;
  }

  const primaryNavRect = primaryNavNode.getBoundingClientRect();
  return horizontalRectsOverlap(primaryNavRect, navUtilitiesRect);
}

function scopedPrimaryNavOverflowOverlapsVisibleLinks(links, overflowNode, overflowButtonNode) {
  if (!overflowNode || !overflowButtonNode || overflowNode.classList.contains("hidden")) {
    return false;
  }

  const overflowRect = overflowButtonNode.getBoundingClientRect();
  return getScopedVisiblePrimaryNavLinks(links).some((link) => horizontalRectsOverlap(link.getBoundingClientRect(), overflowRect));
}

function updateContextNavPreviewShellLayout() {
  if (
    !contextNavPreviewShell
    || !contextNavShellTopNav
    || !contextNavShellPrimaryNav
    || contextNavShellPrimaryNavLinks.length === 0
    || !contextNavShellPrimaryNavOverflow
    || !contextNavShellPrimaryNavOverflowButton
    || !contextNavShellPrimaryNavOverflowMenu
  ) {
    return;
  }

  const writeContextNavPreviewTop = () => {
    window.requestAnimationFrame(() => {
      const previewSubNav = contextNavPreviewBreadcrumbNav?.closest(".sub-nav");
      const shellRect = contextNavPreviewShell.getBoundingClientRect();
      const topNavBottom = contextNavShellTopNav.getBoundingClientRect().bottom - shellRect.top;
      const mobileMenuBottom = contextNavShellMobileNavMenu && !contextNavShellMobileNavMenu.classList.contains("hidden")
        ? contextNavShellMobileNavMenu.getBoundingClientRect().bottom - shellRect.top
        : 0;
      const previewSubNavBottom = previewSubNav instanceof HTMLElement
        ? previewSubNav.getBoundingClientRect().bottom - shellRect.top
        : 0;
      const headerBottom = Math.max(topNavBottom, mobileMenuBottom, previewSubNavBottom);
      const shellScaleValue = Number.parseFloat(getComputedStyle(contextNavPreviewShell).getPropertyValue("--ui-scale"));
      const shellScale = Number.isFinite(shellScaleValue) && shellScaleValue > 0 ? shellScaleValue : 1;

      contextNavPreviewShell.style.setProperty("--context-nav-shell-top-nav-height", `${Math.ceil(contextNavShellTopNav.offsetHeight)}px`);
      contextNavPreviewShell.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
      contextNavPreviewShell.style.setProperty("--context-nav-top-adjusted", `${headerBottom / shellScale}px`);
    });
  };

  contextNavShellTopNav.classList.remove("force-mobile-nav");
  contextNavShellMobileNavButton?.setAttribute("aria-expanded", "false");
  contextNavShellMobileNavMenu?.classList.add("hidden");
  contextNavShellPrimaryNavOverflow.classList.add("hidden");
  contextNavShellPrimaryNavOverflowButton.textContent = "More";
  contextNavShellPrimaryNavOverflowButton.setAttribute("aria-expanded", "false");
  renderScopedPrimaryNavOverflowMenu(contextNavShellPrimaryNavOverflowMenu, []);

  for (const link of contextNavShellPrimaryNavLinks) {
    setScopedNavLinkHidden(link, false);
  }

  if (
    scopedPrimaryNavFits(contextNavShellPrimaryNav)
    && !scopedPrimaryNavOverlapsUtilities(
      contextNavShellPrimaryNav,
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
      contextNavShellNavUtilities,
    )
  ) {
    writeContextNavPreviewTop();
    return;
  }

  contextNavShellPrimaryNavOverflow.classList.remove("hidden");

  while (
    getScopedVisiblePrimaryNavLinks(contextNavShellPrimaryNavLinks).length > 2
    && (
      !scopedPrimaryNavFits(contextNavShellPrimaryNav)
      || scopedPrimaryNavOverlapsUtilities(
        contextNavShellPrimaryNav,
        contextNavShellPrimaryNavLinks,
        contextNavShellPrimaryNavOverflow,
        contextNavShellPrimaryNavOverflowButton,
        contextNavShellNavUtilities,
      )
      || scopedPrimaryNavOverflowOverlapsVisibleLinks(
        contextNavShellPrimaryNavLinks,
        contextNavShellPrimaryNavOverflow,
        contextNavShellPrimaryNavOverflowButton,
      )
    )
  ) {
    const lastVisibleLink = getScopedVisiblePrimaryNavLinks(contextNavShellPrimaryNavLinks).at(-1);
    if (!lastVisibleLink) {
      break;
    }
    setScopedNavLinkHidden(lastVisibleLink, true);
  }

  if (
    scopedPrimaryNavFits(contextNavShellPrimaryNav)
    && !scopedPrimaryNavOverlapsUtilities(
      contextNavShellPrimaryNav,
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
      contextNavShellNavUtilities,
    )
    && !scopedPrimaryNavOverflowOverlapsVisibleLinks(
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
    )
  ) {
    renderScopedPrimaryNavOverflowMenu(
      contextNavShellPrimaryNavOverflowMenu,
      contextNavShellPrimaryNavLinks.filter((link) => link.classList.contains("hidden")),
    );
  } else {
    contextNavShellPrimaryNavOverflow.classList.add("hidden");
    contextNavShellTopNav.classList.add("force-mobile-nav");
  }

  const isPreviewMobile = contextNavShellTopNav.classList.contains("force-mobile-nav");
  contextNavPreviewShell.classList.toggle("context-nav-preview-mobile-frame", isPreviewMobile);
  contextNavPreviewShell.classList.toggle("context-nav-preview-desktop-frame", !isPreviewMobile);

  if (contextNavPreviewBreadcrumbList && contextNavPreviewBreadcrumbCompact) {
    if (isPreviewMobile) {
      contextNavPreviewBreadcrumbList.classList.add("hidden");
      contextNavPreviewBreadcrumbCompact.classList.add("hidden");
      const previewRow = contextNavPreviewBreadcrumbNav?.closest(".sub-nav");
      previewRow?.classList.remove("sub-nav-compact-layout");
    } else {
      applyResponsiveBreadcrumbPriority({
        list: contextNavPreviewBreadcrumbList,
        container: contextNavPreviewBreadcrumbList.parentElement,
        pageMinusOneLink: contextNavPreviewPageMinusOneLink,
        pageMinusOneItem: contextNavPreviewPageMinusOneItem,
        separatorBeforePageMinusOne: contextNavPreviewSeparatorBeforePageMinusOne,
        collapsedItem: contextNavPreviewCollapsedItem,
        separatorBeforeCollapsed: contextNavPreviewSeparatorBeforeCollapsed,
        compact: contextNavPreviewBreadcrumbCompact,
        closeExpandedMenus: () => {
          contextNavPreviewBreadcrumbCollapseButton?.setAttribute("aria-expanded", "false");
          contextNavPreviewBreadcrumbCollapseMenu?.classList.add("hidden");
          contextNavPreviewBreadcrumbCompactButton?.setAttribute("aria-expanded", "false");
          contextNavPreviewBreadcrumbCompactMenu?.classList.add("hidden");
        },
      });
    }
  }

  writeContextNavPreviewTop();
}

function updateContextNavOffset() {
  if (!shouldTrackHostContextNavOffset()) {
    designSystemShell?.style.removeProperty("--context-nav-top");
    return;
  }

  if (!shellTopNav && !shellSubNav) {
    return;
  }

  const headerBottom = Math.max(
    shellTopNav?.getBoundingClientRect().bottom ?? 0,
    shellSubNav?.getBoundingClientRect().bottom ?? 0,
  );

  designSystemShell?.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
}

let shellOffsetFrame = 0;

function scheduleContextNavOffsetUpdate() {
  if (shellOffsetFrame) {
    return;
  }

  shellOffsetFrame = window.requestAnimationFrame(() => {
    shellOffsetFrame = 0;
    updateContextNavOffset();
  });
}

function setBreadcrumbItemHidden(node, hidden) {
  node?.classList.toggle("hidden", hidden);
}

function updateBreadcrumbOverflow() {
  if (!breadcrumbList) {
    return;
  }

  const allowPageMinusOne = Boolean(breadcrumbPageMinusOneLink?.textContent?.trim());
  const allowCollapsed = Boolean(breadcrumbCollapseMenu?.children.length);

  applyResponsiveBreadcrumbPriority({
    list: breadcrumbList,
    container: breadcrumbList.parentElement,
    pageMinusOneLink: breadcrumbPageMinusOneLink,
    pageMinusOneItem: breadcrumbPageMinusOneItem,
    separatorBeforePageMinusOne: breadcrumbSeparatorBeforePageMinusOne,
    collapsedItem: breadcrumbCollapsedItem,
    separatorBeforeCollapsed: breadcrumbSeparatorBeforeCollapsed,
    compact: breadcrumbCompact,
    allowPageMinusOne,
    allowCollapsed,
    closeExpandedMenus: () => {
      setBreadcrumbMenuOpen(false);
      setBreadcrumbCompactMenuOpen(false);
    },
  });
}

function refreshSubNavPreviewResponsiveBreadcrumb() {
  if (!subNavPreviewShell || !subNavPreviewBreadcrumbList) {
    return;
  }

  const currentState = getSubNavPreviewStateFromUrl();

  if (currentState.state !== "mobile" && currentState.state !== "compact") {
    applyResponsiveBreadcrumbPriority({
      list: subNavPreviewBreadcrumbList,
      container: subNavPreviewBreadcrumbList.parentElement,
      pageMinusOneLink: subNavPreviewPageMinusOneLink,
      pageMinusOneItem: subNavPreviewPageMinusOneItem,
      separatorBeforePageMinusOne: subNavPreviewSeparatorBeforePageMinusOne,
      collapsedItem: subNavPreviewCollapsedItem,
      separatorBeforeCollapsed: subNavPreviewSeparatorBeforeCollapsed,
      compact: subNavPreviewBreadcrumbCompact,
      allowPageMinusOne: currentState.state !== "reduced-page-minus-one" && currentState.state !== "shallow",
      allowCollapsed: currentState.state !== "reduced-middle" && currentState.state !== "shallow",
      closeExpandedMenus: () => {
        setSubNavPreviewBreadcrumbMenuOpen(false);
        setSubNavPreviewBreadcrumbCompactMenuOpen(false);
      },
    });
    return;
  }

  syncSubNavPreviewRowLayout(currentState.state);
  updateBreadcrumbOverflowTooltips();
}

function updateSubNavCanonicalFitScale() {
  if (
    subNavSurfaceMode !== "canonical"
    || !(subNavPreviewFrame instanceof HTMLElement)
    || !(subNavPreviewShell instanceof HTMLElement)
    || !(subNavCanonicalRenderScroller instanceof HTMLElement)
  ) {
    return;
  }

  const desiredWidth = Number.parseFloat(
    getComputedStyle(subNavPreviewFrame).getPropertyValue("--sub-nav-preview-width"),
  );
  const uiScale = Number.parseFloat(getComputedStyle(subNavPreviewShell).getPropertyValue("--ui-scale")) || 1;

  if (!Number.isFinite(desiredWidth) || desiredWidth <= 0) {
    return;
  }

  const desiredVisibleWidth = desiredWidth * uiScale;
  const desiredVisibleHeight = subNavPreviewShell.offsetHeight * uiScale;
  const availableWidth = subNavCanonicalRenderScroller.clientWidth;
  const scale = availableWidth > 0 ? Math.min(1, availableWidth / desiredVisibleWidth) : 1;
  const fittedWidth = Math.ceil(desiredVisibleWidth * scale);
  const fittedHeight = Math.ceil(desiredVisibleHeight * scale);

  subNavPreviewFrame.style.setProperty("--sub-nav-canonical-fit-scale", String(scale));
  subNavPreviewFrame.style.setProperty("--sub-nav-preview-fitted-width", `${fittedWidth}px`);
  subNavPreviewFrame.style.setProperty("--sub-nav-preview-fitted-height", `${fittedHeight}px`);
}

function scheduleSubNavCanonicalFitScaleUpdate() {
  if (subNavCanonicalFitFrame) {
    return;
  }

  subNavCanonicalFitFrame = window.requestAnimationFrame(() => {
    subNavCanonicalFitFrame = 0;
    updateSubNavCanonicalFitScale();
  });
}

function setMenuOpen(open) {
  profileButton?.setAttribute("aria-expanded", String(open));
  profileMenu?.classList.toggle("hidden", !open);
}

function isMenuOpen() {
  return profileButton?.getAttribute("aria-expanded") === "true";
}

function setMobileNavOpen(open) {
  mobileNavButton?.setAttribute("aria-expanded", String(open));
  mobileNavMenu?.classList.toggle("hidden", !open);
}

function isMobileNavOpen() {
  return mobileNavButton?.getAttribute("aria-expanded") === "true";
}

function setMobileProfileOpen(open) {
  mobileProfileButton?.setAttribute("aria-expanded", String(open));
  mobileProfileMenu?.classList.toggle("hidden", !open);
}

function isMobileProfileOpen() {
  return mobileProfileButton?.getAttribute("aria-expanded") === "true";
}

function setBreadcrumbMenuOpen(open) {
  breadcrumbCollapseButton?.setAttribute("aria-expanded", String(open));
  breadcrumbCollapseMenu?.classList.toggle("hidden", !open);
}

function isBreadcrumbMenuOpen() {
  return breadcrumbCollapseButton?.getAttribute("aria-expanded") === "true";
}

function setBreadcrumbCompactMenuOpen(open) {
  breadcrumbCompactButton?.setAttribute("aria-expanded", String(open));
  breadcrumbCompactMenu?.classList.toggle("hidden", !open);
}

function isBreadcrumbCompactMenuOpen() {
  return breadcrumbCompactButton?.getAttribute("aria-expanded") === "true";
}

function setSubNavPreviewBreadcrumbMenuOpen(open) {
  subNavPreviewBreadcrumbCollapseButton?.setAttribute("aria-expanded", String(open));
  subNavPreviewBreadcrumbCollapseMenu?.classList.toggle("hidden", !open);
}

function isSubNavPreviewBreadcrumbMenuOpen() {
  return subNavPreviewBreadcrumbCollapseButton?.getAttribute("aria-expanded") === "true";
}

function setSubNavPreviewBreadcrumbCompactMenuOpen(open) {
  subNavPreviewBreadcrumbCompactButton?.setAttribute("aria-expanded", String(open));
  subNavPreviewBreadcrumbCompactMenu?.classList.toggle("hidden", !open);
}

function isSubNavPreviewBreadcrumbCompactMenuOpen() {
  return subNavPreviewBreadcrumbCompactButton?.getAttribute("aria-expanded") === "true";
}

function isFocusableOutsideTarget(node) {
  if (!(node instanceof Element)) {
    return false;
  }

  const focusable = node.closest(
    "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex='-1']), [contenteditable='true']",
  );

  return focusable instanceof HTMLElement;
}

function setAccessibilityDrawerOpen(open, { restoreFocus = true } = {}) {
  accessibilityButton?.setAttribute("aria-expanded", String(open));
  accessibilityDrawer?.classList.toggle("hidden", !open);
  accessibilityDrawer?.setAttribute("aria-hidden", String(!open));

  if (open) {
    accessibilityDrawerReturnFocusTarget = accessibilityButton;
    window.requestAnimationFrame(() => {
      accessibilityCloseButton?.focus();
    });
    return;
  }

  if (restoreFocus && accessibilityDrawerReturnFocusTarget instanceof HTMLElement) {
    accessibilityDrawerReturnFocusTarget.focus();
  }
}

function isAccessibilityDrawerOpen() {
  return accessibilityButton?.getAttribute("aria-expanded") === "true";
}

function setAsyncActivityDrawerOpen(open, { restoreFocus = true } = {}) {
  asyncActivityDrawerController?.setOpen(open, { restoreFocus });
}

function isAsyncActivityDrawerOpen() {
  return asyncActivityDrawerController?.isOpen() ?? false;
}

function setBrochureEditDrawerOpen(open, { restoreFocus = true } = {}) {
  brochureEditDrawer?.classList.toggle("hidden", !open);
  brochureEditDrawer?.setAttribute("aria-hidden", String(!open));
  if (brochurePatternPage instanceof HTMLElement) {
    brochurePatternPage.dataset.brochureEditDrawerOpen = open ? "true" : "false";
  }

  if (open) {
    setAccessibilityDrawerOpen(false, { restoreFocus: false });
    setFilterPanelOpen(false);
    setFilterOptionsPanelOpen(false);
    window.requestAnimationFrame(() => {
      brochureEditDrawerCloseButton?.focus();
    });
    return;
  }

  if (restoreFocus && brochureEditDrawerCloseButton instanceof HTMLElement) {
    brochureEditDrawerCloseButton.blur();
  }
}

function isBrochureEditDrawerOpen() {
  return brochureEditDrawer?.getAttribute("aria-hidden") === "false";
}

function setFilterPanelOpen(open) {
  filterPanelButton?.setAttribute("aria-expanded", String(open));
  filterPanel?.classList.toggle("hidden", !open);
  filterPanel?.setAttribute("aria-hidden", String(!open));
}

function isFilterPanelOpen() {
  return filterPanelButton?.getAttribute("aria-expanded") === "true";
}

function setFilterOptionsPanelOpen(open) {
  filterOptionsPanel?.classList.toggle("hidden", !open);
  filterOptionsPanel?.setAttribute("aria-hidden", String(!open));
}

function isFilterOptionsPanelOpen() {
  return !filterOptionsPanel?.classList.contains("hidden");
}

function renderFilterOptions(category, query = "") {
  if (!filterOptionsList || !filterOptionsTitle) {
    return;
  }

  activeFilterCategory = category;
  const options = filterOptionSets[category] ?? [];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(normalizedQuery),
  );

  filterOptionsTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  filterOptionsList.innerHTML = visibleOptions
    .map(
      (option) =>
        `<button class="filter-option-item" type="button" role="listitem">${option}</button>`,
    )
    .join("");
}

function setContextNavMoreOpen(open) {
  contextNavMoreButton?.setAttribute("aria-expanded", String(open));
  contextNavMoreMenu?.classList.toggle("hidden", !open);
}

function isContextNavMoreOpen() {
  return contextNavMoreButton?.getAttribute("aria-expanded") === "true";
}

function setPreviewWidth(width) {
  if (!previewFrame) {
    return;
  }

  previewFrame.style.setProperty("--top-nav-preview-width", `${width}px`);
  setCanonicalRenderLayoutWidth(topNavCanonicalRenderLayout, Number(width) + 96);

  if (previewWidthInput) {
    previewWidthInput.value = String(width);
  }

  if (previewWidthReadout) {
    previewWidthReadout.textContent = `Preview width: ${width}px`;
  }

  for (const button of previewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.previewWidthPreset === String(width));
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ width }));
}

function setLabelText(node, value) {
  if (!node) {
    return;
  }

  node.textContent = value;
  node.dataset.tooltip = value;
  node.removeAttribute("title");
}

function ensureBreadcrumbLabel(node) {
  if (!(node instanceof HTMLElement)) {
    return null;
  }

  let label = node.querySelector(".breadcrumb-label");
  if (label instanceof HTMLElement) {
    return label;
  }

  const text = node.textContent ?? "";
  node.textContent = "";
  label = document.createElement("span");
  label.className = "breadcrumb-label";
  label.textContent = text;
  node.append(label);
  return label;
}

function syncOverflowTooltip(node) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  node.classList.add("tooltip-anchor");
  const labelNode = ensureBreadcrumbLabel(node);
  const measurementNode = labelNode ?? node;
  const isHomeNode = node === breadcrumbHomeLink || node === subNavPreviewHomeLink;
  const isSubNavPreviewNode = Boolean(node.closest("#sub-nav-preview-shell"));
  const canonicalPreviewStillSettling =
    subNavSurfaceMode === "canonical"
    && isSubNavPreviewNode
    && subNavPreviewShell?.dataset.renderStatus !== "ready";
  if (isHomeNode) {
    node.classList.remove("breadcrumb-home-icon-only");
  }

  if (canonicalPreviewStillSettling) {
    delete node.dataset.tooltip;
    return;
  }

  if (node.closest(".hidden")) {
    delete node.dataset.tooltip;
    return;
  }

  const label = node.dataset.fullLabel?.trim() || measurementNode.textContent?.trim() || "";
  const forceCanonicalTooltip =
    subNavPreviewShell?.dataset.breadcrumbCanonicalMode === "button-truncation"
    && (
      node === subNavPreviewPageMinusOneLink
      || node === subNavPreviewCurrentLabel
    );
  const parentItem = node.closest("li");
  const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
  const parentTruncated =
    parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
  const isTruncated = forceCanonicalTooltip || nodeTruncated || parentTruncated;

  if (isHomeNode) {
    node.classList.toggle("breadcrumb-home-icon-only", isTruncated);
  }

  if (label && isTruncated) {
    node.dataset.tooltip = label;
    return;
  }

  delete node.dataset.tooltip;
}

function updateBreadcrumbOverflowTooltips() {
  for (const node of breadcrumbTooltipNodes) {
    syncOverflowTooltip(node);
  }
}

function setBreadcrumbButtonLabel(node, label) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const labelNode = ensureBreadcrumbLabel(node);
  if (labelNode) {
    labelNode.textContent = label;
    return;
  }

  node.textContent = label;
}

function isBreadcrumbNodeTruncated(node) {
  if (!(node instanceof HTMLElement)) {
    return false;
  }

  const measurementNode = ensureBreadcrumbLabel(node) ?? node;
  const parentItem = node.closest("li");
  const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
  const parentTruncated = parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
  return nodeTruncated || parentTruncated;
}

function syncBreadcrumbCompactLayout(compact) {
  const row = compact?.closest(".sub-nav");
  if (!(row instanceof HTMLElement)) {
    return;
  }

  row.classList.toggle("sub-nav-compact-layout", !compact.classList.contains("hidden"));
}

function syncSubNavPreviewRowLayout(state) {
  const row = subNavPreviewBreadcrumbNav?.closest(".sub-nav");
  if (!(row instanceof HTMLElement)) {
    return;
  }

  const preserveBreadcrumbLane = state === "compact";
  row.classList.toggle("sub-nav-compact-layout", preserveBreadcrumbLane);
}

function breadcrumbPresentationNeedsCompaction({ list, pageMinusOneLink, allowPageMinusOne = true }) {
  if (!(list instanceof HTMLElement)) {
    return false;
  }

  const currentLabel = list.querySelector(".breadcrumb-current");
  const nodes = [currentLabel];
  if (allowPageMinusOne) {
    nodes.unshift(pageMinusOneLink);
  }
  return nodes.some((node) => (
    node instanceof HTMLElement
    && !node.closest(".hidden")
    && isBreadcrumbNodeTruncated(node)
  ));
}

function applyResponsiveBreadcrumbPriority({
  list,
  container,
  pageMinusOneLink,
  pageMinusOneItem,
  separatorBeforePageMinusOne,
  collapsedItem,
  separatorBeforeCollapsed,
  compact,
  allowPageMinusOne = true,
  allowCollapsed = true,
  closeExpandedMenus,
}) {
  if (!list) {
    return;
  }

  const preserveCanonicalFullTrail =
    (
      list === breadcrumbList
      && breadcrumbNav?.dataset.canonicalShellMode === "full-trail"
    )
    || (
      list === subNavPreviewBreadcrumbList
      && subNavPreviewShell?.dataset.breadcrumbCanonicalMode === "button-truncation"
    );

  if (preserveCanonicalFullTrail) {
    setBreadcrumbItemHidden(pageMinusOneItem, !allowPageMinusOne);
    setBreadcrumbItemHidden(separatorBeforePageMinusOne, !allowPageMinusOne);
    setBreadcrumbItemHidden(collapsedItem, !allowCollapsed);
    setBreadcrumbItemHidden(separatorBeforeCollapsed, !allowCollapsed);
    compact?.classList.add("hidden");
    syncBreadcrumbCompactLayout(compact);
    list.classList.remove("hidden");
    updateBreadcrumbOverflowTooltips();
    return;
  }

  const fullPageMinusOneLabel = pageMinusOneLink?.dataset.fullLabel ?? pageMinusOneLink?.textContent?.trim() ?? "";
  const shortPageMinusOneLabel = pageMinusOneLink?.dataset.shortLabel ?? fullPageMinusOneLabel;

  setBreadcrumbItemHidden(pageMinusOneItem, !allowPageMinusOne);
  setBreadcrumbItemHidden(separatorBeforePageMinusOne, !allowPageMinusOne);
  setBreadcrumbItemHidden(collapsedItem, !allowCollapsed);
  setBreadcrumbItemHidden(separatorBeforeCollapsed, !allowCollapsed);
  compact?.classList.add("hidden");
  syncBreadcrumbCompactLayout(compact);
  list.classList.remove("hidden");

  const availableWidth = container?.clientWidth ?? list.clientWidth;

  if (pageMinusOneLink) {
    setBreadcrumbButtonLabel(pageMinusOneLink, fullPageMinusOneLabel);
  }

  if (pageMinusOneLink && isBreadcrumbNodeTruncated(pageMinusOneLink)) {
    setBreadcrumbButtonLabel(pageMinusOneLink, shortPageMinusOneLabel);
  }

  if (
    list.scrollWidth <= availableWidth
    && !breadcrumbPresentationNeedsCompaction({ list, pageMinusOneLink, allowPageMinusOne })
  ) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  if (allowPageMinusOne) {
    setBreadcrumbItemHidden(pageMinusOneItem, true);
    setBreadcrumbItemHidden(separatorBeforePageMinusOne, true);
  }

  if (
    list.scrollWidth <= availableWidth
    && !breadcrumbPresentationNeedsCompaction({ list, pageMinusOneLink, allowPageMinusOne })
  ) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  if (allowCollapsed) {
    setBreadcrumbItemHidden(collapsedItem, true);
    setBreadcrumbItemHidden(separatorBeforeCollapsed, true);
  }

  if (
    list.scrollWidth <= availableWidth
    && !breadcrumbPresentationNeedsCompaction({ list, pageMinusOneLink, allowPageMinusOne })
  ) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  list.classList.add("hidden");
  compact?.classList.remove("hidden");
  syncBreadcrumbCompactLayout(compact);
  closeExpandedMenus?.();
  updateBreadcrumbOverflowTooltips();
}

function applyTopNavPreviewFixture(fixtureName) {
  if (!(previewFrame instanceof HTMLElement)) {
    return;
  }

  const fixture = topNavPreviewFixtures[fixtureName];
  if (!fixture) {
    return;
  }

  activeTopNavPreviewFixture = fixtureName;

  setLabelText(previewBrandLabel, fixture.brand);
  setLabelText(previewProfileLabel, fixture.profile);
  if (profileButton instanceof HTMLElement) {
    profileButton.dataset.tooltip = fixture.profile;
  }
  setLabelText(mobileProfileButton, fixture.mobileProfile);
  setLabelText(profileLanguageButton, fixture.menu[0]);
  setLabelText(closeProfileMenuButton, fixture.menu[1]);
  setLabelText(mobileLanguageButton, fixture.mobileMenu[2]);

  for (const [index, label] of fixture.primary.entries()) {
    setLabelText(primaryNavLinks[index], label);
    setLabelText(mobileNavLinks[index], label);
  }

  const mobileMenuLabels = [
    mobileProfileMenu?.querySelector('a[href="/design-system/profile"]'),
    mobileProfileMenu?.querySelector('a[href="/design-system/profile/preferences"]'),
    mobileLanguageButton,
    mobileProfileMenu?.querySelector('a[href="/design-system/profile/sign-out"]'),
  ];

  for (const [index, label] of fixture.mobileMenu.entries()) {
    setLabelText(mobileMenuLabels[index], label);
  }

  for (const button of previewFixtureButtons) {
    button.classList.toggle("active", button.dataset.previewFixture === fixtureName);
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ fixture: fixtureName }));
}

function applyTopNavPreviewOpenState(openState) {
  activeTopNavPreviewOpenState = openState;

  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);

  if (openState === "overflow" && !primaryNavOverflow?.classList.contains("hidden")) {
    setPrimaryNavOverflowOpen(true);
  }

  if (openState === "profile") {
    setMenuOpen(true);
  }

  if (openState === "mobile" && topNav?.classList.contains("force-mobile-nav")) {
    setMobileNavOpen(true);
  }

  for (const button of previewOpenStateButtons) {
    button.classList.toggle("active", button.dataset.previewOpenState === openState);
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ open: openState }));
}

function getActiveLanguage() {
  return languageOptions.find((language) => language.code === activeLanguageCode) ?? languageOptions[0];
}

function syncLanguageTriggers() {
  const activeLanguage = getActiveLanguage();
  if (profileLanguageButton) {
    profileLanguageButton.textContent = `Language: ${activeLanguage.name}`;
  }

  if (mobileLanguageButton) {
    mobileLanguageButton.textContent = `Language: ${activeLanguage.name}`;
  }
}

function renderLanguageOptions() {
  if (!languageOptionList) {
    return;
  }

  languageOptionList.innerHTML = languageOptions
    .map((language) => {
      const isActive = language.code === activeLanguageCode;
      const activeClass = isActive ? " active" : "";
      const selectedState = String(isActive);
      const check = isActive ? '<span class="language-option-check" aria-hidden="true">Selected</span>' : "";

      return `
        <button
          class="language-option${activeClass}"
          type="button"
          role="option"
          data-language-code="${language.code}"
          aria-selected="${selectedState}"
        >
          <span class="language-option-label">
            <span class="language-option-name">${language.name}</span>
            <span class="language-option-detail">${language.detail}</span>
          </span>
          ${check}
        </button>
      `;
    })
    .join("");
}

function setLanguageModalOpen(open, trigger = null) {
  languageModal?.classList.toggle("hidden", !open);

  if (open) {
    languageModalReturnFocusTarget = trigger ?? document.activeElement;
    renderLanguageOptions();
    window.requestAnimationFrame(() => {
      const selectedButton = languageOptionList?.querySelector(`[data-language-code="${activeLanguageCode}"]`);
      if (selectedButton instanceof HTMLElement) {
        selectedButton.focus();
        return;
      }
      languageModalCloseButton?.focus();
    });
    return;
  }

  if (languageModalReturnFocusTarget instanceof HTMLElement) {
    languageModalReturnFocusTarget.focus();
  }
  languageModalReturnFocusTarget = null;
}

function isLanguageModalOpen() {
  return !languageModal?.classList.contains("hidden");
}

function selectLanguage(languageCode) {
  activeLanguageCode = languageCode;
  syncLanguageTriggers();
  renderLanguageOptions();
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}

function applyAccent(hex) {
  const root = document.documentElement;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-strong", mixWithWhite(hex, 0.12));
  root.style.setProperty("--accent-soft", mixWithWhite(hex, 0.86));
  root.style.setProperty("--accent-text", "#1f2540");

  for (const button of accentButtons) {
    const isActive = button.dataset.accent === hex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  syncSubNavPreviewUrl({ accent: hex });
  syncContextNavPreviewUrl({ accent: hex });
}

function applyTheme(theme) {
  const scopeNode = getAppearanceScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    topNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
    subNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
    contextNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
    scopeNode.dataset.themeScope = theme;
    if (topNavSurfaceMode === "canonical" && topNavPreviewCanvas instanceof HTMLElement) {
      topNavPreviewCanvas.dataset.themeScope = theme;
    }
    if (subNavSurfaceMode === "canonical" && subNavPreviewShell instanceof HTMLElement) {
      subNavPreviewShell.dataset.themeScope = theme;
    }
    if (contextNavSurfaceMode === "canonical" && contextNavPreviewShell instanceof HTMLElement) {
      contextNavPreviewShell.dataset.themeScope = theme;
    }
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
    topNavPreviewCanvas?.removeAttribute("data-theme-scope");
    subNavPreviewShell?.removeAttribute("data-theme-scope");
    contextNavPreviewShell?.removeAttribute("data-theme-scope");
    topNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
    subNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
    contextNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");
  }
  for (const button of themeButtons) {
    const isActive = button.dataset.themeOption === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ theme }));
  syncSubNavPreviewUrl({ theme });
  syncContextNavPreviewUrl({ theme });
}

function applyDirection(direction) {
  if (shouldUseLocalCanonicalDirection()) {
    if (topNavSurfaceMode === "canonical") {
      topNavPreviewCanvas?.setAttribute("dir", direction);
    }
    if (subNavSurfaceMode === "canonical") {
      subNavPreviewShell?.setAttribute("dir", direction);
    }
    if (contextNavSurfaceMode === "canonical") {
      contextNavPreviewShell?.setAttribute("dir", direction);
    }
  } else {
    document.documentElement.setAttribute("dir", direction);
  }
  for (const button of directionButtons) {
    const isActive = button.dataset.directionOption === direction;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  updateDisplaySettingsCopy(direction);

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ direction }));
  syncSubNavPreviewUrl({ direction });
  syncContextNavPreviewUrl({ direction });
}

function applyMagnification(value) {
  const amount = Number(value);
  const scale = 1 + amount / 200;
  const scopeNode = getMagnificationScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    if (amount === 0) {
      scopeNode.style.removeProperty("--ui-scale");
      delete scopeNode.dataset.magnification;
    } else {
      scopeNode.style.setProperty("--ui-scale", String(scale));
      scopeNode.dataset.magnification = String(amount);
    }
    document.documentElement.style.removeProperty("--ui-scale");
  } else {
    document.documentElement.style.setProperty("--ui-scale", String(scale));
  }
  for (const button of magnificationButtons) {
    const isActive = button.dataset.magnificationOption === String(amount);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ magnification: amount }));
  syncSubNavPreviewUrl({ magnification: amount });
  syncContextNavPreviewUrl({ magnification: amount });

  if (contextNavSurfaceMode === "canonical") {
    updateContextNavPreviewShellLayout();
  }
}

const brochureDisplayDefaults = {
  density: "standard",
  backgroundColor: "#f6fbf8",
  fontColor: "#202946",
};

const brochureDensitySettings = {
  compact: {
    "--brochure-section-padding": "clamp(0.75rem, 2vw, 1.35rem)",
    "--brochure-hero-padding": "clamp(1rem, 2.25vw, 1.6rem)",
    "--brochure-zone-gap": "clamp(0.75rem, 2vw, 1.25rem)",
    "--brochure-value-padding": "0.8rem",
  },
  standard: {},
  spacious: {
    "--brochure-section-padding": "clamp(1.25rem, 3.6vw, 2.75rem)",
    "--brochure-hero-padding": "clamp(1.6rem, 4vw, 3rem)",
    "--brochure-zone-gap": "clamp(1.25rem, 3.5vw, 2.8rem)",
    "--brochure-value-padding": "1.25rem",
  },
};

const brochureEditTargetLabels = {
  "top-nav": "Top navigation",
  hero: "Hero",
  "value-strip": "Value highlights",
  "tile-mosaic": "Tile mosaic",
  "media-band": "Media band",
  "logo-bar": "Logo bar",
  footer: "Footer",
  "tile-research": "Research tile",
  "tile-platform": "Platform tile",
  "tile-trust": "Trust tile",
  "tile-growth": "Growth tile",
  "tile-campaign": "Campaign tile",
  "top-nav-hero": "Top navigation / hero boundary",
  "hero-value-strip": "Hero / value highlights boundary",
  "value-strip-tile-mosaic": "Value highlights / tile mosaic boundary",
  "tile-mosaic-media-band": "Tile mosaic / media band boundary",
  "media-band-logo-bar": "Media band / logo bar boundary",
  "logo-bar-footer": "Logo bar / footer boundary",
};

const brochureEditablePieceSelector = [
  ".brochure-site-nav .brand-copy strong",
  ".brochure-site-nav .nav-link",
  ".brochure-hero-copy .brochure-kicker",
  ".brochure-hero-copy h2",
  ".brochure-hero-copy p",
  ".brochure-button",
  ".brochure-hero-media img",
  ".brochure-value-icon",
  ".brochure-value-item p",
  ".brochure-section-heading .brochure-kicker",
  ".brochure-section-heading h2",
  ".brochure-mosaic-tile img",
  ".brochure-mosaic-copy h3",
  ".brochure-mosaic-copy p",
  ".brochure-media-band-graphic img",
  ".brochure-media-band-copy .brochure-kicker",
  ".brochure-media-band-copy h2",
  ".brochure-media-band-copy p",
  ".brochure-logo-bar span",
  ".brochure-footer h2",
  ".brochure-footer p",
  ".brochure-footer img",
].join(", ");

function normalizeHexColor(value) {
  const trimmed = String(value ?? "").trim();
  const match = trimmed.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
  if (!match) {
    return null;
  }

  return `#${match[1].toLowerCase()}`;
}

function getBrochureColorValue(kind) {
  const input = brochureColorInputs.find((node) => node instanceof HTMLInputElement && node.dataset.brochureColor === kind);
  if (input instanceof HTMLInputElement) {
    const normalized = normalizeHexColor(input.value);
    if (normalized) {
      return normalized;
    }
  }

  return kind === "background" ? brochureDisplayDefaults.backgroundColor : brochureDisplayDefaults.fontColor;
}

function getCurrentBrochureDisplayState(overrides = {}) {
  return {
    density: brochurePreview?.dataset.brochureDensity ?? brochureDisplayDefaults.density,
    backgroundColor: getBrochureColorValue("background"),
    fontColor: getBrochureColorValue("font"),
    ...overrides,
  };
}

function setBrochureActiveButton(buttons, value, dataKey) {
  for (const button of buttons) {
    const isActive = button.dataset[dataKey] === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

function applyBrochureVariables(settings) {
  if (!(brochurePreview instanceof HTMLElement)) {
    return;
  }

  for (const property of [
    "--brochure-section-padding",
    "--brochure-hero-padding",
    "--brochure-zone-gap",
    "--brochure-value-padding",
    "--brochure-background-color",
    "--brochure-contrast-surface",
    "--brochure-soft-surface",
    "--brochure-chip-surface",
    "--brochure-line-color",
    "--brochure-font-color",
  ]) {
    if (settings[property]) {
      brochurePreview.style.setProperty(property, settings[property]);
    } else {
      brochurePreview.style.removeProperty(property);
    }
  }
}

function applyBrochureDisplayControls(overrides = {}) {
  if (!(brochurePreview instanceof HTMLElement)) {
    return;
  }

  const state = getCurrentBrochureDisplayState(overrides);

  const settings = {
    ...(brochureDensitySettings[state.density] ?? brochureDensitySettings[brochureDisplayDefaults.density]),
    "--brochure-background-color": state.backgroundColor,
    "--brochure-font-color": state.fontColor,
  };

  brochurePreview.dataset.brochureDensity = state.density;
  applyBrochureVariables(settings);
  setBrochureActiveButton(brochureDensityButtons, state.density, "brochureDensity");
}

function setBrochureEditableState(enabled) {
  if (brochurePreview instanceof HTMLElement) {
    brochurePreview.dataset.brochureEditable = enabled ? "true" : "false";
  }

  if (brochureEditableToggle instanceof HTMLInputElement) {
    brochureEditableToggle.checked = enabled;
  }

  for (const button of brochureEditButtons) {
    if (button instanceof HTMLElement) {
      button.tabIndex = enabled ? 0 : -1;
      button.setAttribute("aria-hidden", enabled ? "false" : "true");
    }
  }

  for (const piece of getBrochureEditablePieces()) {
    piece.dataset.brochureEditablePiece = "true";
    piece.tabIndex = enabled ? 0 : -1;
    piece.setAttribute("aria-hidden", "false");
  }

  if (!enabled) {
    hideBrochureFloatingEditButton();
    setBrochureEditDrawerOpen(false, { restoreFocus: false });
  }
}

function setBrochureEditDrawerContent({ type = "container", target = "", label: explicitLabel = "" } = {}) {
  const label = explicitLabel || brochureEditTargetLabels[target] || target;
  const typeLabel = type === "boundary" ? "Boundary" : (type === "image" ? "Image" : (type === "icon" ? "Icon" : (type === "text" ? "Text" : (type === "tile" ? "Tile" : "Container"))));

  if (brochureEditDrawerEyebrow instanceof HTMLElement) {
    brochureEditDrawerEyebrow.textContent = `Brochure ${typeLabel.toLowerCase()}`;
  }

  if (brochureEditDrawerTitle instanceof HTMLElement) {
    brochureEditDrawerTitle.textContent = label ? `Edit ${label}` : "Select a container";
  }

  if (brochureEditDrawerCopy instanceof HTMLElement) {
    brochureEditDrawerCopy.textContent = label
      ? `The ${typeLabel.toLowerCase()} drawer is ready for ${label}. Field-specific controls will be defined in the next step.`
      : "Use the editable-state affordances to choose a brochure section or boundary.";
  }
}

function getBrochureEditablePieces() {
  if (!(brochurePreview instanceof HTMLElement)) {
    return [];
  }

  return Array.from(brochurePreview.querySelectorAll(brochureEditablePieceSelector)).filter(
    (piece) => piece instanceof HTMLElement && !piece.closest(".brochure-edit-affordance"),
  );
}

function getBrochurePieceSectionLabel(piece) {
  const section = piece.closest("[data-brochure-edit-label]");
  if (section instanceof HTMLElement && section.dataset.brochureEditLabel) {
    return section.dataset.brochureEditLabel;
  }

  return "Brochure";
}

function getBrochurePieceKind(piece) {
  if (piece.matches(".brochure-value-icon")) {
    return "icon";
  }

  if (piece instanceof HTMLImageElement) {
    return "image";
  }

  if (piece.matches(".brochure-kicker")) {
    return "kicker text";
  }

  if (piece.matches("h1, h2, h3")) {
    return "headline text";
  }

  if (piece.matches(".nav-link")) {
    return "navigation text";
  }

  if (piece.matches(".brochure-button")) {
    return "button text";
  }

  if (piece.matches(".brochure-logo-bar span")) {
    return "badge text";
  }

  return "copy text";
}

function getBrochurePieceLabel(piece) {
  const sectionLabel = getBrochurePieceSectionLabel(piece);
  const pieceKind = getBrochurePieceKind(piece);
  const visibleText = piece instanceof HTMLImageElement ? piece.alt : piece.textContent;
  const snippet = String(visibleText ?? "").replace(/\s+/g, " ").trim();

  if (snippet && pieceKind.includes("text")) {
    return `${sectionLabel} ${pieceKind}: ${snippet.slice(0, 56)}`;
  }

  return `${sectionLabel} ${pieceKind}`;
}

function hideBrochureFloatingEditButton() {
  if (!(brochureEditFloatingButton instanceof HTMLElement)) {
    return;
  }

  brochureEditFloatingButton.classList.remove("active");
  brochureEditFloatingButton.removeAttribute("data-brochure-edit-target");
  brochureEditFloatingButton.removeAttribute("data-brochure-edit-label");
  brochureEditFloatingButton.removeAttribute("data-brochure-edit-type");
  brochureEditFloatingButton.setAttribute("aria-label", "Edit selected brochure piece");

  for (const piece of getBrochureEditablePieces()) {
    piece.classList.remove("brochure-edit-piece-active");
  }
}

function showBrochureFloatingEditButton(piece) {
  if (!(brochurePreview instanceof HTMLElement) || !(brochureEditFloatingButton instanceof HTMLElement)) {
    return;
  }

  if (brochurePreview.dataset.brochureEditable !== "true" || !(piece instanceof HTMLElement)) {
    hideBrochureFloatingEditButton();
    return;
  }

  const previewRect = brochurePreview.getBoundingClientRect();
  const pieceRect = piece.getBoundingClientRect();
  const label = getBrochurePieceLabel(piece);
  const type = piece instanceof HTMLImageElement ? "image" : (piece.matches(".brochure-value-icon") ? "icon" : "text");
  const target = `piece-${type}`;
  const top = pieceRect.top - previewRect.top + Math.min(14, Math.max(8, pieceRect.height * 0.2));
  const edgeOffset = piece.matches(".brochure-value-icon") ? 24 : 16;
  const left = Math.min(previewRect.width - 16, pieceRect.right - previewRect.left + edgeOffset);

  for (const item of getBrochureEditablePieces()) {
    item.classList.toggle("brochure-edit-piece-active", item === piece);
  }

  brochureEditFloatingButton.style.top = `${top}px`;
  brochureEditFloatingButton.style.left = `${left}px`;
  brochureEditFloatingButton.dataset.brochureEditTarget = target;
  brochureEditFloatingButton.dataset.brochureEditLabel = label;
  brochureEditFloatingButton.dataset.brochureEditType = type;
  brochureEditFloatingButton.setAttribute("aria-label", `Edit ${label}`);
  brochureEditFloatingButton.classList.add("active");
}

function initializeFormSelects() {
  if (formSelectRoots.length === 0) {
    return;
  }

  let activeFormSelect = null;

  function getFormSelectOptions(root) {
    if (!(root instanceof HTMLElement)) {
      return [];
    }

    return Array.from(root.querySelectorAll("[data-form-select-option]")).filter((option) =>
      option instanceof HTMLButtonElement
    );
  }

  function focusFormSelectOption(root, { preferLast = false } = {}) {
    const options = getFormSelectOptions(root);

    if (options.length === 0) {
      return;
    }

    const selectedOption = options.find((option) => option.getAttribute("aria-selected") === "true");
    const fallbackOption = preferLast ? options.at(-1) : options[0];
    const targetOption = selectedOption ?? fallbackOption;

    targetOption?.focus();
  }

  function closeFormSelect(root, { restoreFocus = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-form-select-button]");
    const listbox = root.querySelector("[data-form-select-listbox]");

    if (!(trigger instanceof HTMLButtonElement) || !(listbox instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    listbox.classList.add("hidden");

    if (restoreFocus) {
      trigger.focus();
    }

    if (activeFormSelect === root) {
      activeFormSelect = null;
    }
  }

  function openFormSelect(root, { focusOption = true, preferLastOption = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    closeUnrelatedFormSurfaces({ preservedRoots: [root] });

    const trigger = root.querySelector("[data-form-select-button]");
    const listbox = root.querySelector("[data-form-select-listbox]");

    if (!(trigger instanceof HTMLButtonElement) || !(listbox instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "true");
    listbox.classList.remove("hidden");
    activeFormSelect = root;

    if (focusOption) {
      focusFormSelectOption(root, { preferLast: preferLastOption });
    }
  }

  for (const root of formSelectRoots) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    const trigger = root.querySelector("[data-form-select-button]");
    const hiddenInput = root.querySelector("[data-form-select-value]");
    const currentLabel = root.querySelector("[data-form-select-current-label]");
    const options = Array.from(root.querySelectorAll("[data-form-select-option]"));

    if (
      !(trigger instanceof HTMLButtonElement)
      || !(hiddenInput instanceof HTMLInputElement)
      || !(currentLabel instanceof HTMLElement)
    ) {
      continue;
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeFormSelect(root);
        return;
      }

      openFormSelect(root);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      event.preventDefault();

      if (trigger.getAttribute("aria-expanded") !== "true") {
        openFormSelect(root, {
          focusOption: true,
          preferLastOption: event.key === "ArrowUp",
        });
        return;
      }

      focusFormSelectOption(root, { preferLast: event.key === "ArrowUp" });
    });

    for (const option of options) {
      if (!(option instanceof HTMLButtonElement)) {
        continue;
      }

      option.addEventListener("click", () => {
        hiddenInput.value = option.dataset.value ?? "";
        currentLabel.textContent = option.textContent?.trim() ?? "";

        for (const candidate of options) {
          if (!(candidate instanceof HTMLButtonElement)) {
            continue;
          }

          const isSelected = candidate === option;
          candidate.classList.toggle("active", isSelected);
          candidate.setAttribute("aria-selected", String(isSelected));
        }

        root.closest("[data-form-date-picker]")?.dispatchEvent(new CustomEvent("formselectchange", { bubbles: true }));
        closeFormSelect(root, { restoreFocus: true });
      });

      option.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
          return;
        }

        event.preventDefault();

        const optionIndex = options.indexOf(option);
        if (optionIndex === -1) {
          return;
        }

        const nextIndex = event.key === "ArrowDown"
          ? Math.min(optionIndex + 1, options.length - 1)
          : Math.max(optionIndex - 1, 0);

        options[nextIndex]?.focus();
      });
    }
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormSelect && !activeFormSelect.contains(event.target)) {
      closeFormSelect(activeFormSelect);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !activeFormSelect) {
      return;
    }

    closeFormSelect(activeFormSelect, { restoreFocus: true });
  });
}

function initializeFormIconGrids() {
  if (formIconGridRoots.length === 0) {
    return;
  }

  let activeFormIconGrid = null;
  const focusableSelector = [
    "button:not([disabled])",
    "input:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  function getFocusableElements(panel) {
    if (!(panel instanceof HTMLElement)) {
      return [];
    }

    return Array.from(panel.querySelectorAll(focusableSelector)).filter((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return !element.hidden
        && !element.classList.contains("hidden")
        && element.getAttribute("aria-hidden") !== "true";
    });
  }

  function getSearchInput(root) {
    const input = root.querySelector("[data-form-icon-grid-search]");
    return input instanceof HTMLInputElement ? input : null;
  }

  function getFilteredIcons(searchTerm) {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch === "") {
      return designSystemIconDefinitions;
    }

    return designSystemIconDefinitions.filter((icon) => {
      const searchable = [icon.key, icon.label, ...icon.aliases].join(" ").toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }

  function renderIconGrid(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const hiddenInput = root.querySelector("[data-form-icon-grid-value]");
    const labelNode = root.querySelector("[data-form-icon-grid-current-label]");
    const glyphNode = root.querySelector("[data-form-icon-grid-trigger-glyph]");
    const optionsNode = root.querySelector("[data-form-icon-grid-option-list]");
    const emptyNode = root.querySelector("[data-form-icon-grid-empty]");
    const searchInput = getSearchInput(root);

    if (
      !(hiddenInput instanceof HTMLInputElement)
      || !(labelNode instanceof HTMLElement)
      || !(glyphNode instanceof HTMLElement)
      || !(optionsNode instanceof HTMLElement)
      || !(emptyNode instanceof HTMLElement)
    ) {
      return;
    }

    const selectedIcon = getDesignSystemIconRecord(hiddenInput.value);
    const filteredIcons = getFilteredIcons(searchInput?.value ?? "");

    hiddenInput.value = selectedIcon.key;
    labelNode.textContent = selectedIcon.label;
    glyphNode.innerHTML = renderDesignSystemIconSvg(selectedIcon.key);
    optionsNode.innerHTML = filteredIcons.map((icon) => {
      const isSelected = icon.key === selectedIcon.key;
      return `
        <button
          class="form-icon-grid-option${isSelected ? " active" : ""}"
          type="button"
          data-form-icon-grid-option="${escapeHtml(icon.key)}"
          data-tooltip="${escapeHtml(icon.label)}"
          aria-pressed="${String(isSelected)}"
          aria-label="Choose ${escapeHtml(icon.label)} icon"
        >
          <span class="form-icon-grid-option-glyph" aria-hidden="true">${renderDesignSystemIconSvg(icon.key)}</span>
        </button>
      `;
    }).join("");

    emptyNode.classList.toggle("hidden", filteredIcons.length > 0);
  }

  function closeIconGrid(root, { restoreFocus = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-form-icon-grid-button]");
    const panel = root.querySelector("[data-form-icon-grid-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("aria-modal", "false");

    if (restoreFocus) {
      trigger.focus();
    }

    if (activeFormIconGrid === root) {
      activeFormIconGrid = null;
    }
  }

  function openIconGrid(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    closeUnrelatedFormSurfaces({ preservedRoots: [root] });

    const trigger = root.querySelector("[data-form-icon-grid-button]");
    const panel = root.querySelector("[data-form-icon-grid-panel]");
    const searchInput = getSearchInput(root);

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    if (searchInput) {
      searchInput.value = "";
    }

    renderIconGrid(root);
    trigger.setAttribute("aria-expanded", "true");
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
    panel.setAttribute("aria-modal", "true");
    activeFormIconGrid = root;

    window.requestAnimationFrame(() => {
      searchInput?.focus();
    });
  }

  for (const root of formIconGridRoots) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    const trigger = root.querySelector("[data-form-icon-grid-button]");
    const hiddenInput = root.querySelector("[data-form-icon-grid-value]");
    const panel = root.querySelector("[data-form-icon-grid-panel]");
    const searchForm = root.querySelector(".form-icon-grid-search-shell");
    const searchInput = getSearchInput(root);

    if (
      !(trigger instanceof HTMLButtonElement)
      || !(hiddenInput instanceof HTMLInputElement)
      || !(panel instanceof HTMLElement)
    ) {
      continue;
    }

    renderIconGrid(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeIconGrid(root);
        return;
      }

      openIconGrid(root);
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    searchInput?.addEventListener("input", () => {
      renderIconGrid(root);
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const closeButton = target.closest("[data-form-icon-grid-close]");
      if (closeButton instanceof HTMLButtonElement) {
        closeIconGrid(root, { restoreFocus: true });
        return;
      }

      const backdrop = target.closest("[data-form-icon-grid-backdrop]");
      if (backdrop instanceof HTMLElement) {
        closeIconGrid(root);
        return;
      }

      const optionButton = target.closest("[data-form-icon-grid-option]");
      if (optionButton instanceof HTMLButtonElement) {
        hiddenInput.value = optionButton.dataset.formIconGridOption ?? designSystemIconDefinitions[0].key;
        renderIconGrid(root);
        closeIconGrid(root, { restoreFocus: true });
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormIconGrid && !activeFormIconGrid.contains(event.target)) {
      closeIconGrid(activeFormIconGrid);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!activeFormIconGrid) {
      return;
    }

    if (event.key === "Escape") {
      closeIconGrid(activeFormIconGrid, { restoreFocus: true });
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const panel = activeFormIconGrid.querySelector("[data-form-icon-grid-panel]");
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const focusableElements = getFocusableElements(panel);
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

function initializeFormDrawerSelects() {
  if (formDrawerSelectRoots.length === 0) {
    return;
  }

  let activeFormDrawerSelect = null;
  const focusableDrawerSelector = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  function getSelectedValues(hiddenInput) {
    if (!(hiddenInput instanceof HTMLInputElement)) {
      return [];
    }

    return hiddenInput.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  function setSelectedValues(hiddenInput, values) {
    if (hiddenInput instanceof HTMLInputElement) {
      hiddenInput.value = values.join(",");
    }
  }

  function getFocusableDrawerElements(panel) {
    if (!(panel instanceof HTMLElement)) {
      return [];
    }

    return Array.from(panel.querySelectorAll(focusableDrawerSelector)).filter((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return !element.hasAttribute("disabled")
        && !element.hidden
        && !element.classList.contains("hidden")
        && element.getAttribute("aria-hidden") !== "true";
    });
  }

  function resetDrawerSearch(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const searchInput = root.querySelector("[data-form-drawer-select-search]");
    if (searchInput instanceof HTMLInputElement && searchInput.value !== "") {
      searchInput.value = "";
    }

    renderDrawer(root);
  }

  function closeDrawer(root, { restoreFocus = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-form-drawer-select-button]");
    const panel = root.querySelector("[data-form-drawer-select-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("aria-modal", "false");

    if (restoreFocus) {
      trigger.focus();
    }

    if (activeFormDrawerSelect === root) {
      activeFormDrawerSelect = null;
    }
  }

  function openDrawer(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    closeUnrelatedFormSurfaces({ preservedRoots: [root] });
    resetDrawerSearch(root);

    const trigger = root.querySelector("[data-form-drawer-select-button]");
    const panel = root.querySelector("[data-form-drawer-select-panel]");
    const searchInput = root.querySelector("[data-form-drawer-select-search]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "true");
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
    panel.setAttribute("aria-modal", "true");
    activeFormDrawerSelect = root;

    window.requestAnimationFrame(() => {
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
      }
    });
  }

  function renderDrawer(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const hiddenInput = root.querySelector("[data-form-drawer-select-value]");
    const summaryNode = root.querySelector("[data-form-drawer-select-summary]");
    const metaNode = root.querySelector("[data-form-drawer-select-meta]");
    const selectedCountNode = root.querySelector("[data-form-drawer-select-selected-count]");
    const selectedList = root.querySelector("[data-form-drawer-select-selected-list]");
    const selectedEmpty = root.querySelector("[data-form-drawer-select-selected-empty]");
    const options = Array.from(root.querySelectorAll("[data-form-drawer-select-option]"));
    const searchInput = root.querySelector("[data-form-drawer-select-search]");
    const emptyNode = root.querySelector("[data-form-drawer-select-empty]");
    const variant = root.dataset.formDrawerSelectVariant ?? "default";
    const emptySummary = root.dataset.formDrawerSelectEmptySummary ?? "Choose collections";

    if (
      !(hiddenInput instanceof HTMLInputElement)
      || !(summaryNode instanceof HTMLElement)
      || !(metaNode instanceof HTMLElement)
      || !(selectedCountNode instanceof HTMLElement)
      || !(selectedList instanceof HTMLElement)
      || !(selectedEmpty instanceof HTMLElement)
      || !(emptyNode instanceof HTMLElement)
    ) {
      return;
    }

    const selectedValues = getSelectedValues(hiddenInput);
    const optionRecords = options.map((option) => ({
      element: option,
      value: option.dataset.value ?? "",
      label: option.dataset.label ?? option.textContent?.trim() ?? "",
      description: option.dataset.description ?? "",
      attribute: option.dataset.attribute ?? option.dataset.description ?? "",
    }));
    const selectedRecords = optionRecords.filter((option) => selectedValues.includes(option.value));
    const searchTerm = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : "";

    summaryNode.textContent = selectedRecords.length === 0
      ? emptySummary
      : selectedRecords.length <= 2
        ? selectedRecords.map((item) => item.label).join(", ")
        : `${selectedRecords.slice(0, 2).map((item) => item.label).join(", ")} +${selectedRecords.length - 2} more`;

    const selectedMeta = `${selectedRecords.length} selected`;
    metaNode.textContent = selectedMeta;
    selectedCountNode.textContent = selectedMeta;

    selectedList.innerHTML = selectedRecords.map((item) => {
      const detail = variant === "attribute-cards" ? item.attribute : item.description;
      return `
        <button class="form-drawer-select-selected-chip" type="button" data-form-drawer-select-remove="${escapeHtml(item.value)}">
          <span class="form-drawer-select-selected-chip-copy">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(detail)}</span>
          </span>
          <span class="form-drawer-select-selected-chip-remove">Remove</span>
        </button>
      `;
    }).join("");

    selectedEmpty.classList.toggle("hidden", selectedRecords.length > 0);
    selectedList.classList.toggle("hidden", selectedRecords.length === 0);

    let visibleOptions = 0;

    for (const option of optionRecords) {
      const isSelected = selectedValues.includes(option.value);
      const matchesSearch = searchTerm === ""
        || option.label.toLowerCase().includes(searchTerm)
        || option.description.toLowerCase().includes(searchTerm);

      option.element.classList.toggle("active", isSelected);
      option.element.setAttribute("aria-pressed", String(isSelected));
      option.element.classList.toggle("hidden", !matchesSearch);

      if (matchesSearch) {
        visibleOptions += 1;
      }
    }

    emptyNode.classList.toggle("hidden", visibleOptions > 0);
  }

  function toggleValue(root, value) {
    if (!(root instanceof HTMLElement) || !value) {
      return;
    }

    const hiddenInput = root.querySelector("[data-form-drawer-select-value]");
    if (!(hiddenInput instanceof HTMLInputElement)) {
      return;
    }

    const nextValues = getSelectedValues(hiddenInput);
    const existingIndex = nextValues.indexOf(value);

    if (existingIndex >= 0) {
      nextValues.splice(existingIndex, 1);
    } else {
      nextValues.push(value);
    }

    setSelectedValues(hiddenInput, nextValues);
    renderDrawer(root);
  }

  for (const root of formDrawerSelectRoots) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    const trigger = root.querySelector("[data-form-drawer-select-button]");
    const panel = root.querySelector("[data-form-drawer-select-panel]");
    const closeButton = root.querySelector("[data-form-drawer-select-close]");
    const searchForm = root.querySelector(".form-drawer-select-search-shell");
    const searchInput = root.querySelector("[data-form-drawer-select-search]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      continue;
    }

    renderDrawer(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeDrawer(root);
        return;
      }

      openDrawer(root);
    });

    closeButton?.addEventListener("click", () => {
      closeDrawer(root, { restoreFocus: true });
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    searchInput?.addEventListener("input", () => {
      renderDrawer(root);
    });

    panel.addEventListener("click", (event) => {
      event.stopPropagation();

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const removeButton = target.closest("[data-form-drawer-select-remove]");
      if (removeButton instanceof HTMLButtonElement) {
        toggleValue(root, removeButton.dataset.formDrawerSelectRemove ?? "");
        return;
      }

      const optionButton = target.closest("[data-form-drawer-select-option]");
      if (optionButton instanceof HTMLButtonElement) {
        toggleValue(root, optionButton.dataset.value ?? "");
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormDrawerSelect && !activeFormDrawerSelect.contains(event.target)) {
      closeDrawer(activeFormDrawerSelect);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!activeFormDrawerSelect) {
      return;
    }

    if (event.key === "Tab") {
      const panel = activeFormDrawerSelect.querySelector("[data-form-drawer-select-panel]");
      if (!(panel instanceof HTMLElement)) {
        return;
      }

      const focusableElements = getFocusableDrawerElements(panel);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }

      return;
    }

    if (event.key === "Escape") {
      closeDrawer(activeFormDrawerSelect, { restoreFocus: true });
    }
  });
}

function initializeFormTimePickers() {
  if (formTimePickerRoots.length === 0) {
    return;
  }

  let activeFormTimePicker = null;

  function closeTimePicker(root, { restoreFocus = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-form-time-button]");
    const panel = root.querySelector("[data-form-time-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.classList.add("hidden");

    if (restoreFocus) {
      trigger.focus();
    }

    if (activeFormTimePicker === root) {
      activeFormTimePicker = null;
    }

    syncFormPickerOverlayState();
  }

  function openTimePicker(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const parentDatePicker = root.closest("[data-form-date-picker]");
    closeUnrelatedFormSurfaces({
      preservedRoots: parentDatePicker instanceof HTMLElement ? [root, parentDatePicker] : [root],
    });

    const trigger = root.querySelector("[data-form-time-button]");
    const panel = root.querySelector("[data-form-time-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "true");
    panel.classList.remove("hidden");
    activeFormTimePicker = root;
    syncFormPickerOverlayState();
  }

  function syncTimePicker(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const hiddenInput = root.querySelector("[data-form-time-value]");
    const currentLabel = root.querySelector("[data-form-time-current-label]");
    const hoursContainer = root.querySelector("[data-form-time-hours]");
    const minutesContainer = root.querySelector("[data-form-time-minutes]");

    if (
      !(hiddenInput instanceof HTMLInputElement)
      || !(currentLabel instanceof HTMLElement)
      || !(hoursContainer instanceof HTMLElement)
      || !(minutesContainer instanceof HTMLElement)
    ) {
      return;
    }

    const normalizedValue = normalizeFormTimeValue(hiddenInput.value);
    hiddenInput.value = normalizedValue;
    currentLabel.textContent = normalizedValue;

    const [selectedHour, selectedMinute] = normalizedValue.split(":");

    hoursContainer.innerHTML = formTimeHourOptions.map((hour) => {
      const isSelected = hour === selectedHour;
      return `<button class="form-time-option${isSelected ? " active" : ""}" type="button" data-form-time-hour="${hour}" aria-pressed="${String(isSelected)}">${hour}</button>`;
    }).join("");

    minutesContainer.innerHTML = formTimeMinuteOptions.map((minute) => {
      const isSelected = minute === selectedMinute;
      return `<button class="form-time-option${isSelected ? " active" : ""}" type="button" data-form-time-minute="${minute}" aria-pressed="${String(isSelected)}">${minute}</button>`;
    }).join("");
  }

  function updateTimeValue(root, nextPartialValue, { closeAfterSelect = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const hiddenInput = root.querySelector("[data-form-time-value]");
    if (!(hiddenInput instanceof HTMLInputElement)) {
      return;
    }

    hiddenInput.value = normalizeFormTimeValue(nextPartialValue);
    syncTimePicker(root);
    root.dispatchEvent(new CustomEvent("formtimechange", { bubbles: true }));

    if (closeAfterSelect) {
      closeTimePicker(root, { restoreFocus: true });
    }
  }

  for (const root of formTimePickerRoots) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    const trigger = root.querySelector("[data-form-time-button]");
    const panel = root.querySelector("[data-form-time-panel]");
    const hiddenInput = root.querySelector("[data-form-time-value]");

    if (
      !(trigger instanceof HTMLButtonElement)
      || !(panel instanceof HTMLElement)
      || !(hiddenInput instanceof HTMLInputElement)
    ) {
      continue;
    }

    syncTimePicker(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeTimePicker(root);
        return;
      }

      openTimePicker(root);
    });

    panel.addEventListener("click", (event) => {
      event.stopPropagation();

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const closeButton = target.closest("[data-form-time-close]");
      if (closeButton instanceof HTMLButtonElement) {
        closeTimePicker(root, { restoreFocus: true });
        return;
      }

      const hourButton = target.closest("[data-form-time-hour]");
      if (hourButton instanceof HTMLButtonElement) {
        const currentMinute = normalizeFormTimeValue(hiddenInput.value).split(":")[1];
        updateTimeValue(root, `${hourButton.dataset.formTimeHour ?? "00"}:${currentMinute}`);
        return;
      }

      const minuteButton = target.closest("[data-form-time-minute]");
      if (minuteButton instanceof HTMLButtonElement) {
        const currentHour = normalizeFormTimeValue(hiddenInput.value).split(":")[0];
        updateTimeValue(root, `${currentHour}:${minuteButton.dataset.formTimeMinute ?? "00"}`, { closeAfterSelect: true });
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormTimePicker && !activeFormTimePicker.contains(event.target)) {
      closeTimePicker(activeFormTimePicker);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !activeFormTimePicker) {
      return;
    }

    closeTimePicker(activeFormTimePicker, { restoreFocus: true });
  });
}

function getFormUploadInitialState() {
  const params = new URLSearchParams(window.location.search);
  const generatedReference = getFormTemplateCanonicalReferenceByRef(
    getGeneratedCanonicalPathReferenceId("form-template"),
  );
  if (generatedReference?.upload === "uploading" || generatedReference?.upload === "error") {
    return generatedReference.upload;
  }

  const requestedState = params.get("upload");

  if (requestedState === "uploading" || requestedState === "error") {
    return requestedState;
  }

  return "idle";
}

function initializeFormUploadFields() {
  initializeSharedFormUploadFields({
    initialState: getFormUploadInitialState(),
  });
}

function initializeFormErrorModeToggles() {
  if (formErrorToggleButtons.length === 0 && formDrawerSettingButtons.length === 0) {
    return;
  }

  function parseFormReviewFlag(value) {
    if (typeof value !== "string") {
      return false;
    }

    return value === "true" || value === "1" || value === "yes" || value === "on";
  }

  function getFormReviewStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const generatedReference = getFormTemplateCanonicalReferenceByRef(
      getGeneratedCanonicalPathReferenceId("form-template"),
    );

    if (generatedReference) {
      return {
        errors: generatedReference.errors,
        disabled: generatedReference.disabled,
        mobile: generatedReference.mobile,
      };
    }

    return {
      errors: parseFormReviewFlag(params.get("errors")),
      disabled: parseFormReviewFlag(params.get("disabled")),
      mobile: parseFormReviewFlag(params.get("mobile")),
    };
  }

  function setFormShellState(shell, key, enabled) {
    if (!(shell instanceof HTMLElement)) {
      return;
    }

    if (key === "errors") {
      shell.dataset.formErrorMode = String(enabled);
      syncFormUploadFieldsForShell(shell);
    }

    if (key === "disabled") {
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

    if (key === "mobile") {
      shell.dataset.formMobileView = String(enabled);
    }
  }

  function syncFormShellState(shell) {
    if (!(shell instanceof HTMLElement)) {
      return;
    }

    const isErrorMode = shell.dataset.formErrorMode === "true";
    const isDisabledMode = shell.dataset.formDisabledMode === "true";
    const isMobileView = shell.dataset.formMobileView === "true";

    for (const button of formErrorToggleButtons) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }

      const targetShell = button.closest("[data-form-error-mode]");
      if (targetShell !== shell) {
        continue;
      }

      button.setAttribute("aria-pressed", String(isErrorMode));
      button.textContent = isErrorMode ? "Hide errors" : "Show errors";
    }

    for (const button of formDrawerSettingButtons) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }

      const setting = button.dataset.formDrawerSetting ?? "";
      const isActive = setting === "errors"
        ? isErrorMode
        : setting === "disabled"
          ? isDisabledMode
          : isMobileView;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }
  }

  for (const shell of formPageShells) {
    if (!(shell instanceof HTMLElement)) {
      continue;
    }

    const initialState = getFormReviewStateFromUrl();
    setFormShellState(shell, "errors", initialState.errors);
    setFormShellState(shell, "disabled", initialState.disabled);
    setFormShellState(shell, "mobile", initialState.mobile);
    syncFormShellState(shell);
  }

  for (const button of formErrorToggleButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    const shell = button.closest("[data-form-error-mode]");
    if (!(shell instanceof HTMLElement)) {
      continue;
    }

    button.addEventListener("click", () => {
      setFormShellState(shell, "errors", shell.dataset.formErrorMode !== "true");
      syncFormShellState(shell);
    });
  }

  for (const button of formDrawerSettingButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    const setting = button.dataset.formDrawerSetting ?? "";
    const shell = formPageShells[0];
    if (!(shell instanceof HTMLElement) || (setting !== "errors" && setting !== "disabled" && setting !== "mobile")) {
      continue;
    }

    button.addEventListener("click", () => {
      const nextState = setting === "errors"
        ? shell.dataset.formErrorMode !== "true"
        : setting === "disabled"
          ? shell.dataset.formDisabledMode !== "true"
          : shell.dataset.formMobileView !== "true";

      setFormShellState(shell, setting, nextState);
      syncFormShellState(shell);
    });
  }
}

function initializeFormDatePickers() {
  if (formDatePickerRoots.length === 0) {
    return;
  }

  let activeFormDatePicker = null;
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });
  const monthTitleFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const fieldLabelFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  const isoFormatter = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
  const timeLabelFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  const monthOptionFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
  const baseYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 151 }, (_, index) => String(baseYear - 100 + index));

  function addMonths(date, delta) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function formatIsoDate(date) {
    return isoFormatter.format(date);
  }

  function formatTimeLabel(value) {
    const [hours = "00", minutes = "00"] = normalizeFormTimeValue(value).split(":");
    const date = new Date(2026, 0, 1, Number(hours), Number(minutes));
    return timeLabelFormatter.format(date);
  }

  function getDisplayedAnchorDate(root, anchor) {
    const startInput = root.querySelector("[data-form-date-start-value]");
    const mode = root.dataset.pickerMode ?? "single";
    const monthCount = Number(root.dataset.monthCount ?? (mode === "single" ? "1" : "3"));
    const startValue = startInput instanceof HTMLInputElement ? startInput.value : formatIsoDate(new Date());
    const viewStart = new Date(`${root.dataset.viewStart ?? startValue}T12:00:00`);
    const safeViewStart = Number.isNaN(viewStart.getTime()) ? new Date(`${startValue}T12:00:00`) : viewStart;
    return anchor === "end" ? addMonths(startOfMonth(safeViewStart), monthCount - 1) : startOfMonth(safeViewStart);
  }

  function buildDateJumpMenu(kind, anchor, selectedValue, activeJumpKey, optionEntries) {
    const jumpKey = `${anchor}:${kind}`;
    const isOpen = activeJumpKey === jumpKey;
    const optionMarkup = optionEntries.map(({ value, label }) => {
      const isSelected = String(value) === String(selectedValue);
      return `
        <button
          class="form-date-jump-option${isSelected ? " active" : ""}"
          type="button"
          data-form-date-jump-option
          data-form-date-jump-kind="${kind}"
          data-form-date-jump-anchor="${anchor}"
          data-value="${escapeHtml(String(value))}"
          aria-selected="${String(isSelected)}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    }).join("");

    return `
      <div class="form-date-jump-control">
        <button
          class="form-date-jump-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="${String(isOpen)}"
          data-form-date-jump-button
          data-form-date-jump-kind="${kind}"
          data-form-date-jump-anchor="${anchor}"
        >
          <span>${escapeHtml(String(optionEntries.find((entry) => String(entry.value) === String(selectedValue))?.label ?? selectedValue))}</span>
          <span class="form-date-jump-trigger-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
        <div class="form-date-jump-menu${isOpen ? "" : " hidden"}" role="listbox">
          ${optionMarkup}
        </div>
      </div>
    `;
  }

  function buildDateJumpGroup(root, anchor, monthDate) {
    const activeJumpKey = root.dataset.activeJumpControl ?? "";
    const currentYear = monthDate.getFullYear();
    const yearEntries = [...yearOptions];

    if (!yearEntries.includes(String(currentYear))) {
      yearEntries.push(String(currentYear));
      yearEntries.sort((left, right) => Number(left) - Number(right));
    }

    return `
      <div class="form-date-jump-group form-date-jump-group-${anchor}">
        ${buildDateJumpMenu(
          "month",
          anchor,
          monthDate.getMonth(),
          activeJumpKey,
          Array.from({ length: 12 }, (_, monthIndex) => ({
            value: monthIndex,
            label: monthOptionFormatter.format(new Date(2026, monthIndex, 1)),
          })),
        )}
        ${buildDateJumpMenu(
          "year",
          anchor,
          currentYear,
          activeJumpKey,
          yearEntries.map((year) => ({ value: year, label: year })),
        )}
      </div>
    `;
  }

  function applyDateJumpSelection(root, anchor, kind, rawValue) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const mode = root.dataset.pickerMode ?? "single";
    const monthCount = Number(root.dataset.monthCount ?? (mode === "single" ? "1" : "3"));
    const displayedAnchorDate = getDisplayedAnchorDate(root, anchor);
    const nextMonth = kind === "month" ? Number(rawValue) : displayedAnchorDate.getMonth();
    const nextYear = kind === "year" ? Number(rawValue) : displayedAnchorDate.getFullYear();

    if (!Number.isInteger(nextMonth) || !Number.isInteger(nextYear)) {
      return;
    }

    const nextAnchorDate = new Date(nextYear, nextMonth, 1);
    const nextViewStart = anchor === "end"
      ? addMonths(nextAnchorDate, -(monthCount - 1))
      : nextAnchorDate;

    root.dataset.viewStart = formatIsoDate(nextViewStart);
    root.dataset.activeJumpControl = "";
  }

  function closeDatePicker(root, { restoreFocus = false } = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-form-date-button]");
    const panel = root.querySelector("[data-form-date-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.classList.add("hidden");

    if (restoreFocus) {
      trigger.focus();
    }

    if (activeFormDatePicker === root) {
      activeFormDatePicker = null;
    }

    syncFormPickerOverlayState();
  }

  function openDatePicker(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    closeUnrelatedFormSurfaces({ preservedRoots: [root] });

    const trigger = root.querySelector("[data-form-date-button]");
    const panel = root.querySelector("[data-form-date-panel]");

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", "true");
    panel.classList.remove("hidden");
    activeFormDatePicker = root;
    syncFormPickerOverlayState();
  }

  function renderDatePicker(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const startInput = root.querySelector("[data-form-date-start-value]");
    const endInput = root.querySelector("[data-form-date-end-value]");
    const currentLabel = root.querySelector("[data-form-date-current-label]");
    const monthsContainer = root.querySelector("[data-form-date-months]");
    const rangeSummary = root.querySelector("[data-form-date-range-summary]");
    const startTimeInput = root.querySelector("[data-form-date-start-time]");
    const endTimeInput = root.querySelector("[data-form-date-end-time]");
    const doneButton = root.querySelector("[data-form-date-done]");
    const mode = root.dataset.pickerMode ?? "single";
    const monthCount = Number(root.dataset.monthCount ?? (mode === "single" ? "1" : "3"));
    const selectionStage = root.dataset.selectionStage ?? "start";

    if (
      !(startInput instanceof HTMLInputElement)
      || !(currentLabel instanceof HTMLElement)
      || !(monthsContainer instanceof HTMLElement)
    ) {
      return;
    }

    const startValue = startInput.value;
    const endValue = endInput instanceof HTMLInputElement ? endInput.value : "";
    const selectedStartDate = new Date(`${startValue}T12:00:00`);
    const selectedEndDate = endValue ? new Date(`${endValue}T12:00:00`) : null;
    const viewStart = new Date(`${root.dataset.viewStart ?? startValue}T12:00:00`);
    const safeViewStart = Number.isNaN(viewStart.getTime()) ? new Date(`${startValue}T12:00:00`) : viewStart;
    if (mode === "single") {
      currentLabel.textContent = fieldLabelFormatter.format(selectedStartDate);
    } else if (mode === "range-time" && selectedEndDate && startTimeInput instanceof HTMLInputElement && endTimeInput instanceof HTMLInputElement) {
      currentLabel.textContent = `${fieldLabelFormatter.format(selectedStartDate)} ${formatTimeLabel(startTimeInput.value)} - ${fieldLabelFormatter.format(selectedEndDate)} ${formatTimeLabel(endTimeInput.value)}`;
    } else if (selectedEndDate) {
      currentLabel.textContent = `${fieldLabelFormatter.format(selectedStartDate)} - ${fieldLabelFormatter.format(selectedEndDate)}`;
    } else {
      currentLabel.textContent = `${fieldLabelFormatter.format(selectedStartDate)} - Choose end date`;
    }

    if (rangeSummary instanceof HTMLElement) {
      if (selectedEndDate && selectionStage !== "end") {
        rangeSummary.textContent = `Selected range: ${fieldLabelFormatter.format(selectedStartDate)} through ${fieldLabelFormatter.format(selectedEndDate)}. Review it, then press Done.`;
      } else if (selectionStage === "end") {
        rangeSummary.textContent = `Start selected: ${fieldLabelFormatter.format(selectedStartDate)}. Choose an end date next.`;
      } else {
        rangeSummary.textContent = `Select a start date, then an end date.`;
      }
    }

    const monthsMarkup = Array.from({ length: monthCount }, (_, index) => {
      const monthDate = addMonths(startOfMonth(safeViewStart), index);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const offset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const weekdayMarkup = Array.from({ length: 7 }, (_, dayIndex) => {
        const day = new Date(2026, 2, 2 + dayIndex);
        return `<span class="form-date-weekday" aria-hidden="true">${weekdayFormatter.format(day)}</span>`;
      }).join("");

      const dayMarkup = [];

      for (let emptyIndex = 0; emptyIndex < offset; emptyIndex += 1) {
        dayMarkup.push('<span class="form-date-day form-date-day-empty" aria-hidden="true"></span>');
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const isoDate = formatIsoDate(date);
        const isStart = isoDate === startValue;
        const isEnd = isoDate === endValue;
        const isSelected = mode === "single" ? isStart : isStart || isEnd;
        const isInRange = mode !== "single" && endValue && isoDate > startValue && isoDate < endValue;
        const today = formatIsoDate(new Date()) === isoDate;
        const classes = [
          "form-date-day",
          isSelected ? "form-date-day-selected" : "",
          isInRange ? "form-date-day-in-range" : "",
          today ? "form-date-day-today" : "",
        ].filter(Boolean).join(" ");

        dayMarkup.push(
          `<button class="${classes}" type="button" data-form-date-day data-date="${isoDate}" aria-pressed="${String(isSelected)}">${day}</button>`,
        );
      }

      const shouldRenderJumpGroup = index === 0 || (monthCount > 1 && index === monthCount - 1);
      const anchor = index === monthCount - 1 && monthCount > 1 ? "end" : "start";
      const titleMarkup = shouldRenderJumpGroup
        ? `<div class="form-date-month-heading form-date-month-heading-${anchor}">${buildDateJumpGroup(root, anchor, monthDate)}</div>`
        : `<h5 class="form-date-month-title">${monthTitleFormatter.format(monthDate)}</h5>`;

      return `
        <section class="form-date-month" aria-label="${monthTitleFormatter.format(monthDate)}">
          ${titleMarkup}
          <div class="form-date-weekdays">${weekdayMarkup}</div>
          <div class="form-date-grid">${dayMarkup.join("")}</div>
        </section>
      `;
    }).join("");

    monthsContainer.innerHTML = monthsMarkup;

    const openJumpMenus = Array.from(root.querySelectorAll(".form-date-jump-menu:not(.hidden)"));
    for (const menu of openJumpMenus) {
      if (!(menu instanceof HTMLElement)) {
        continue;
      }

      const selectedOption = menu.querySelector(".form-date-jump-option.active, .form-date-jump-option[aria-selected=\"true\"]");
      if (selectedOption instanceof HTMLElement) {
        selectedOption.scrollIntoView({ block: "center" });
      }
    }

    if (doneButton instanceof HTMLButtonElement) {
      doneButton.disabled = !selectedEndDate;
    }
  }

  for (const root of formDatePickerRoots) {
    if (!(root instanceof HTMLElement)) {
      continue;
    }

    const startInput = root.querySelector("[data-form-date-start-value]");
    const endInput = root.querySelector("[data-form-date-end-value]");
    const trigger = root.querySelector("[data-form-date-button]");
    const panel = root.querySelector("[data-form-date-panel]");
    const navButtons = Array.from(root.querySelectorAll("[data-form-date-nav]"));
    const doneButton = root.querySelector("[data-form-date-done]");
    const mode = root.dataset.pickerMode ?? "single";

    if (
      !(startInput instanceof HTMLInputElement)
      || !(trigger instanceof HTMLButtonElement)
      || !(panel instanceof HTMLElement)
    ) {
      continue;
    }

    root.dataset.viewStart = startInput.value;
    root.dataset.selectionStage = "start";
    renderDatePicker(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeDatePicker(root);
        return;
      }

      if (mode !== "single") {
        root.dataset.selectionStage = "start";
      }
      openDatePicker(root);
      renderDatePicker(root);
    });

    panel.addEventListener("click", (event) => {
      event.stopPropagation();

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const navButton = target.closest("[data-form-date-nav]");
      if (navButton instanceof HTMLButtonElement) {
        const delta = Number(navButton.dataset.formDateNav ?? "0");
        const currentView = new Date(`${root.dataset.viewStart ?? startInput.value}T12:00:00`);
        root.dataset.activeJumpControl = "";
        root.dataset.viewStart = formatIsoDate(addMonths(currentView, delta));
        renderDatePicker(root);
        return;
      }

      const jumpOption = target.closest("[data-form-date-jump-option]");
      if (jumpOption instanceof HTMLButtonElement) {
        const kind = jumpOption.dataset.formDateJumpKind ?? "month";
        const anchor = jumpOption.dataset.formDateJumpAnchor ?? "start";
        applyDateJumpSelection(root, anchor, kind, jumpOption.dataset.value ?? "");
        renderDatePicker(root);
        return;
      }

      const jumpButton = target.closest("[data-form-date-jump-button]");
      if (jumpButton instanceof HTMLButtonElement) {
        const jumpKey = `${jumpButton.dataset.formDateJumpAnchor ?? "start"}:${jumpButton.dataset.formDateJumpKind ?? "month"}`;
        root.dataset.activeJumpControl = root.dataset.activeJumpControl === jumpKey ? "" : jumpKey;
        renderDatePicker(root);
        return;
      }

      const dayButton = target.closest("[data-form-date-day]");
      if (dayButton instanceof HTMLButtonElement) {
        const selectedDate = dayButton.dataset.date ?? startInput.value;

        if (mode === "single") {
          startInput.value = selectedDate;
          root.dataset.activeJumpControl = "";
          root.dataset.viewStart = startInput.value;
          renderDatePicker(root);
          closeDatePicker(root, { restoreFocus: true });
          return;
        }

        if (!(endInput instanceof HTMLInputElement)) {
          return;
        }

        const selectionStage = root.dataset.selectionStage ?? "start";

        if (selectionStage === "start") {
          startInput.value = selectedDate;
          endInput.value = "";
          root.dataset.selectionStage = "end";
          root.dataset.activeJumpControl = "";
          root.dataset.viewStart = startInput.value;
          renderDatePicker(root);
          return;
        }

        if (selectedDate < startInput.value) {
          endInput.value = startInput.value;
          startInput.value = selectedDate;
        } else {
          endInput.value = selectedDate;
        }

        root.dataset.selectionStage = "start";
        root.dataset.activeJumpControl = "";
        root.dataset.viewStart = startInput.value;
        renderDatePicker(root);
        return;
      }

      if (root.dataset.activeJumpControl) {
        root.dataset.activeJumpControl = "";
        renderDatePicker(root);
      }
    });

    for (const navButton of navButtons) {
      if (navButton instanceof HTMLButtonElement) {
        navButton.type = "button";
      }
    }

    doneButton?.addEventListener("click", () => {
      if (!(doneButton instanceof HTMLButtonElement) || doneButton.disabled) {
        return;
      }

      closeDatePicker(root, { restoreFocus: true });
    });

    root.addEventListener("formselectchange", () => {
      renderDatePicker(root);
    });

    root.addEventListener("formtimechange", () => {
      renderDatePicker(root);
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormDatePicker && !activeFormDatePicker.contains(event.target)) {
      closeDatePicker(activeFormDatePicker);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !activeFormDatePicker) {
      return;
    }

    closeDatePicker(activeFormDatePicker, { restoreFocus: true });
  });
}

profileButton?.addEventListener("click", () => {
  setMenuOpen(!isMenuOpen());
});

mobileNavButton?.addEventListener("click", () => {
  setMobileNavOpen(!isMobileNavOpen());
});

mobileProfileButton?.addEventListener("click", () => {
  setMobileProfileOpen(!isMobileProfileOpen());
});

breadcrumbCollapseButton?.addEventListener("click", () => {
  setBreadcrumbMenuOpen(!isBreadcrumbMenuOpen());
});

breadcrumbCompactButton?.addEventListener("click", () => {
  setBreadcrumbCompactMenuOpen(!isBreadcrumbCompactMenuOpen());
});

subNavPreviewBreadcrumbCollapseButton?.addEventListener("click", () => {
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);
  setSubNavPreviewBreadcrumbMenuOpen(!isSubNavPreviewBreadcrumbMenuOpen());
});

subNavPreviewBreadcrumbCompactButton?.addEventListener("click", () => {
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(!isSubNavPreviewBreadcrumbCompactMenuOpen());
});

accessibilityButton?.addEventListener("click", () => {
  setBrochureEditDrawerOpen(false, { restoreFocus: false });
  setAsyncActivityDrawerOpen(false, { restoreFocus: false });
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(!isAccessibilityDrawerOpen());
});

asyncActivityButton?.addEventListener("click", () => {
  setBrochureEditDrawerOpen(false, { restoreFocus: false });
  setAccessibilityDrawerOpen(false, { restoreFocus: false });
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAsyncActivityDrawerOpen(!isAsyncActivityDrawerOpen());
});

filterPanelButton?.addEventListener("click", () => {
  setBrochureEditDrawerOpen(false, { restoreFocus: false });
  setAsyncActivityDrawerOpen(false, { restoreFocus: false });
  setAccessibilityDrawerOpen(false);
  setFilterOptionsPanelOpen(false);
  setFilterPanelOpen(!isFilterPanelOpen());
});

contextNavMoreButton?.addEventListener("click", () => {
  setContextNavMoreOpen(!isContextNavMoreOpen());
});

closeProfileMenuButton?.addEventListener("click", () => {
  setMenuOpen(false);
  profileButton?.focus();
});

profileLanguageButton?.addEventListener("click", () => {
  setMenuOpen(false);
  setLanguageModalOpen(true, profileLanguageButton);
});

mobileLanguageButton?.addEventListener("click", () => {
  setMobileProfileOpen(false);
  setLanguageModalOpen(true, mobileLanguageButton);
});

languageModalCloseButton?.addEventListener("click", () => {
  setLanguageModalOpen(false);
});

languageModalBackdrop?.addEventListener("click", () => {
  setLanguageModalOpen(false);
});

languageOptionList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest("[data-language-code]");
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const languageCode = button.dataset.languageCode;
  if (!languageCode) {
    return;
  }

  selectLanguage(languageCode);
  setLanguageModalOpen(false);
});

initializeFormDrawerSelects();
initializeFormTimePickers();
initializeFormSelects();
initializeFormIconGrids();
initializeFormUploadFields();
initializeFormDatePickers();
initializeFormErrorModeToggles();

previewWidthInput?.addEventListener("input", () => {
  const width = Number(previewWidthInput.value);
  setPreviewWidth(width);
  window.requestAnimationFrame(() => {
    updatePrimaryNavOverflow();
    applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
  });
});

for (const button of previewWidthPresetButtons) {
  button.addEventListener("click", () => {
    const width = Number(button.dataset.previewWidthPreset ?? "1120");
    setPreviewWidth(width);
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
    });
  });
}

subNavPreviewWidthInput?.addEventListener("input", () => {
  applySubNavPreviewState(
    getCurrentSubNavPreviewState({
      width: subNavPreviewWidthInput.value,
    }),
  );
});

for (const button of subNavPreviewWidthPresetButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        width: button.dataset.subNavWidthPreset ?? subNavPreviewDefaults.width,
      }),
    );
  });
}

contextNavPreviewWidthInput?.addEventListener("input", () => {
  applyContextNavPreviewState(
    getCurrentContextNavPreviewState({
      width: contextNavPreviewWidthInput.value,
    }),
  );
});

contextNavPreviewHeightInput?.addEventListener("input", () => {
  applyContextNavPreviewState(
    getCurrentContextNavPreviewState({
      height: contextNavPreviewHeightInput.value,
    }),
  );
});

for (const button of contextNavPreviewWidthPresetButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        width: button.dataset.contextNavWidthPreset ?? contextNavPreviewDefaults.width,
      }),
    );
  });
}

for (const button of contextNavPreviewHeightPresetButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        height: button.dataset.contextNavHeightPreset ?? contextNavPreviewDefaults.height,
      }),
    );
  });
}

for (const button of contextNavPreviewStackButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        stack: button.dataset.contextNavStack ?? contextNavPreviewDefaults.stack,
      }),
    );
  });
}

for (const button of contextNavPreviewLabelButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        labels: button.dataset.contextNavLabels ?? contextNavPreviewDefaults.labels,
      }),
    );
  });
}

for (const button of contextNavPreviewOpenButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        open: button.dataset.contextNavOpen ?? contextNavPreviewDefaults.open,
      }),
    );
  });
}

for (const button of subNavPreviewStateButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        state: button.dataset.subNavState ?? subNavPreviewDefaults.state,
      }),
    );
  });
}

for (const button of subNavPreviewSearchStateButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        search: button.dataset.subNavSearchState ?? subNavPreviewDefaults.search,
      }),
    );
  });
}

for (const button of subNavPreviewLocaleButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        locale: button.dataset.subNavLocale ?? subNavPreviewDefaults.locale,
      }),
    );
  });
}

for (const button of previewFixtureButtons) {
  button.addEventListener("click", () => {
    applyTopNavPreviewFixture(button.dataset.previewFixture ?? "standard");
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
    });
  });
}

for (const button of previewOpenStateButtons) {
  button.addEventListener("click", () => {
    const previewState = normalizePreviewState({
      width: previewWidthInput?.value,
      fixture: activeTopNavPreviewFixture,
      open: button.dataset.previewOpenState ?? "closed",
      theme: getCurrentSurfaceTheme(),
      direction: getTopNavSurfaceDirection(),
      magnification: Array.from(magnificationButtons).find((item) => item.classList.contains("active"))
        ?.dataset.magnificationOption,
      accent: Array.from(accentButtons).find((item) => item.classList.contains("active"))?.dataset.accent,
    });

    setPreviewWidth(previewState.width);

    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(previewState.open);
    });
  });
}

primaryNavOverflowButton?.addEventListener("click", () => {
  setPrimaryNavOverflowOpen(!isPrimaryNavOverflowOpen());
});

accessibilityCloseButton?.addEventListener("click", () => {
  setAccessibilityDrawerOpen(false);
});

filterPanelCloseButton?.addEventListener("click", () => {
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  filterPanelButton?.focus();
});

filterOptionsCloseButton?.addEventListener("click", () => {
  setFilterOptionsPanelOpen(false);
  filterOptionsCloseButton?.blur();
});

for (const button of filterMenuButtons) {
  button.addEventListener("click", () => {
    const category = button.dataset.filterTarget ?? "status";
    renderFilterOptions(category);
    if (filterOptionsSearch) {
      filterOptionsSearch.value = "";
    }
    setFilterOptionsPanelOpen(true);
  });
}

filterOptionsSearch?.addEventListener("input", () => {
  renderFilterOptions(activeFilterCategory, filterOptionsSearch.value);
});

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeOption ?? "normal");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of directionButtons) {
  button.addEventListener("click", () => {
    applyDirection(button.dataset.directionOption ?? "ltr");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of accentButtons) {
  button.addEventListener("click", () => {
    applyAccent(button.dataset.accent ?? "#635bff");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of magnificationButtons) {
  button.addEventListener("click", () => {
    applyMagnification(button.dataset.magnificationOption ?? "0");
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
      applySubNavPreviewState(getCurrentSubNavPreviewState());
      applyContextNavPreviewState(getCurrentContextNavPreviewState());
    });
  });
}

for (const button of brochureDensityButtons) {
  button.addEventListener("click", () => {
    applyBrochureDisplayControls({ density: button.dataset.brochureDensity ?? brochureDisplayDefaults.density });
  });
}

for (const input of brochureColorInputs) {
  input.addEventListener("input", () => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const normalized = normalizeHexColor(input.value);
    input.setAttribute("aria-invalid", String(!normalized));
    if (!normalized) {
      return;
    }

    const key = input.dataset.brochureColor === "background" ? "backgroundColor" : "fontColor";
    applyBrochureDisplayControls({ [key]: normalized });
  });
}

brochureEditableToggle?.addEventListener("change", () => {
  if (!(brochureEditableToggle instanceof HTMLInputElement)) {
    return;
  }

  setBrochureEditableState(brochureEditableToggle.checked);
});

for (const button of brochureEditButtons) {
  button.addEventListener("click", () => {
    const type = button.dataset.brochureEditType ?? "container";
    const target = button.dataset.brochureEditTarget ?? "";
    setBrochureEditDrawerContent({ type, target });
    setBrochureEditDrawerOpen(true);
  });
}

brochurePreview?.addEventListener("mouseover", (event) => {
  const target = event.target instanceof Element ? event.target.closest(brochureEditablePieceSelector) : null;
  if (target instanceof HTMLElement && brochurePreview.contains(target)) {
    showBrochureFloatingEditButton(target);
  }
});

brochurePreview?.addEventListener("focusin", (event) => {
  const target = event.target instanceof Element ? event.target.closest(brochureEditablePieceSelector) : null;
  if (target instanceof HTMLElement && brochurePreview.contains(target)) {
    showBrochureFloatingEditButton(target);
  }
});

brochurePreview?.addEventListener("mouseleave", (event) => {
  if (brochureEditFloatingButton instanceof HTMLElement && event.relatedTarget instanceof Node && brochureEditFloatingButton.contains(event.relatedTarget)) {
    return;
  }

  if (document.activeElement instanceof HTMLElement && document.activeElement.matches(brochureEditablePieceSelector)) {
    return;
  }

  hideBrochureFloatingEditButton();
});

brochureEditFloatingButton?.addEventListener("click", () => {
  if (!(brochureEditFloatingButton instanceof HTMLElement)) {
    return;
  }

  const type = brochureEditFloatingButton.dataset.brochureEditType ?? "text";
  const target = brochureEditFloatingButton.dataset.brochureEditTarget ?? "";
  const label = brochureEditFloatingButton.dataset.brochureEditLabel ?? "";
  setBrochureEditDrawerContent({ type, target, label });
  setBrochureEditDrawerOpen(true);
});

brochureEditDrawerCloseButton?.addEventListener("click", () => {
  setBrochureEditDrawerOpen(false);
});

for (const button of pageShellBannerVisibilityButtons) {
  button.addEventListener("click", () => {
    setPageShellBannerDemoVisible((button.dataset.pageShellBannerVisibility ?? "hide") === "show");
  });
}

for (const button of pageShellTopNavVisibilityButtons) {
  button.addEventListener("click", () => {
    setPageShellTopNavMenuVisible((button.dataset.pageShellTopNavVisibility ?? "show") === "show");
  });
}

for (const button of pageShellProfileVisibilityButtons) {
  button.addEventListener("click", () => {
    setPageShellProfileVisible((button.dataset.pageShellProfileVisibility ?? "hide") === "show");
  });
}

for (const button of pageShellProfileMenuStateButtons) {
  button.addEventListener("click", () => {
    setPageShellProfileMenuOpen((button.dataset.pageShellProfileMenuState ?? "collapsed") === "open");
  });
}

const initialTopNavPreviewState = getTopNavPreviewStateFromUrl();
const initialSubNavPreviewState = getSubNavPreviewStateFromUrl();
const initialContextNavPreviewState = getContextNavPreviewStateFromUrl();

syncPageShellBannerDemo();
syncPageShellVisibilityButtons(
  pageShellTopNavVisibilityButtons,
  pageShellTopNavMenuVisible ? "show" : "hide",
  "pageShellTopNavVisibility",
);
syncPageShellVisibilityButtons(
  pageShellProfileVisibilityButtons,
  pageShellProfileVisible ? "show" : "hide",
  "pageShellProfileVisibility",
);
syncPageShellVisibilityButtons(
  pageShellProfileMenuStateButtons,
  pageShellProfileMenuOpen ? "open" : "collapsed",
  "pageShellProfileMenuState",
);
updateContextNavOffset();
updatePrimaryNavOverflow();
updateBreadcrumbOverflow();
updateBreadcrumbOverflowTooltips();
updateContextNavReviewFrameOffset();
updateContextNavPreviewShellLayout();
if (brochurePatternPage instanceof HTMLElement) {
  brochurePatternPage.dataset.brochureEditDrawerOpen = "false";
}
setBrochureEditableState(false);
applyBrochureDisplayControls();
const initialTheme = previewFrame
  ? initialTopNavPreviewState.theme
  : (subNavPreviewFrame ? initialSubNavPreviewState.theme : initialContextNavPreviewState.theme);
const initialDirection = previewFrame
  ? initialTopNavPreviewState.direction
  : (subNavPreviewFrame ? initialSubNavPreviewState.direction : initialContextNavPreviewState.direction);
const initialMagnification = previewFrame
  ? initialTopNavPreviewState.magnification
  : (subNavPreviewFrame ? initialSubNavPreviewState.magnification : initialContextNavPreviewState.magnification);
const initialAccent = previewFrame
  ? initialTopNavPreviewState.accent
  : (subNavPreviewFrame ? initialSubNavPreviewState.accent : initialContextNavPreviewState.accent);
applyTheme(initialTheme);
applyDirection(initialDirection);
applyAccent(initialAccent);
applyMagnification(initialMagnification);
renderFilterOptions(activeFilterCategory);
syncLanguageTriggers();
renderLanguageOptions();
if (shouldTrackHostContextNavOffset()) {
  scheduleContextNavOffsetUpdate();
}
applyTopNavPreviewFixture(initialTopNavPreviewState.fixture);
setPreviewWidth(initialTopNavPreviewState.width);
refreshGovernedPrimaryNav();
window.requestAnimationFrame(() => {
  updatePrimaryNavOverflow();
  applyTopNavPreviewOpenState(initialTopNavPreviewState.open);
});
applySubNavPreviewState(initialSubNavPreviewState);
applyContextNavPreviewState(initialContextNavPreviewState);

window.addEventListener("resize", () => {
  if (shouldTrackHostContextNavOffset()) {
    scheduleContextNavOffsetUpdate();
  }
  updatePrimaryNavOverflow();
  updateBreadcrumbOverflow();
  refreshSubNavPreviewResponsiveBreadcrumb();
  updateBreadcrumbOverflowTooltips();
  scheduleSubNavCanonicalFitScaleUpdate();
  updateContextNavReviewFrameOffset();
  updateContextNavPreviewShellLayout();
  applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
  applyContextNavPreviewState(getCurrentContextNavPreviewState());
});

window.addEventListener("scroll", () => {
  if (shouldTrackHostContextNavOffset()) {
    scheduleContextNavOffsetUpdate();
  }
  updateContextNavReviewFrameOffset();
  updateContextNavPreviewShellLayout();
}, { passive: true });

contextNavPreviewContent?.addEventListener("scroll", () => {
  updateContextNavPreviewShellLayout();
}, { passive: true });

if ("ResizeObserver" in window) {
  const headerObserver = new ResizeObserver(() => {
    if (shouldTrackHostContextNavOffset()) {
      scheduleContextNavOffsetUpdate();
    }
    updateBreadcrumbOverflow();
    refreshSubNavPreviewResponsiveBreadcrumb();
    updateBreadcrumbOverflowTooltips();
    scheduleSubNavCanonicalFitScaleUpdate();
    updateContextNavReviewFrameOffset();
    updateContextNavPreviewShellLayout();
  });

  if (shellTopNav) {
    headerObserver.observe(shellTopNav);
  }

  if (primaryNav) {
    headerObserver.observe(primaryNav);
  }

  if (shellSubNav) {
    headerObserver.observe(shellSubNav);
  }

  if (breadcrumbNav) {
    headerObserver.observe(breadcrumbNav);
  }

  if (breadcrumbList) {
    headerObserver.observe(breadcrumbList);
  }

  if (previewFrame) {
    headerObserver.observe(previewFrame);
  }

  if (subNavPreviewFrame) {
    headerObserver.observe(subNavPreviewFrame);
  }

  if (subNavCanonicalRenderScroller) {
    headerObserver.observe(subNavCanonicalRenderScroller);
  }

  if (subNavPreviewBreadcrumbNav) {
    headerObserver.observe(subNavPreviewBreadcrumbNav);
  }

  if (subNavPreviewBreadcrumbList) {
    headerObserver.observe(subNavPreviewBreadcrumbList);
  }

  if (contextNavPreviewFrame) {
    headerObserver.observe(contextNavPreviewFrame);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (target.closest("#context-nav-more-filter")) {
    setContextNavMoreOpen(false);
    setAsyncActivityDrawerOpen(false, { restoreFocus: false });
    setAccessibilityDrawerOpen(false);
    setFilterOptionsPanelOpen(false);
    setFilterPanelOpen(true);
    return;
  }

  if (target.closest("#context-nav-more-accessibility")) {
    setContextNavMoreOpen(false);
    setAsyncActivityDrawerOpen(false, { restoreFocus: false });
    setFilterPanelOpen(false);
    setFilterOptionsPanelOpen(false);
    setAccessibilityDrawerOpen(true);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (profileButton?.contains(target) || profileMenu?.contains(target)) {
    return;
  }

  if (languageModal?.contains(target)) {
    return;
  }

  if (primaryNavOverflowButton?.contains(target) || primaryNavOverflowMenu?.contains(target)) {
    return;
  }

  if (
    breadcrumbCollapseButton?.contains(target) ||
    breadcrumbCollapseMenu?.contains(target) ||
    breadcrumbCompactButton?.contains(target) ||
    breadcrumbCompactMenu?.contains(target) ||
    subNavPreviewBreadcrumbCollapseButton?.contains(target) ||
    subNavPreviewBreadcrumbCollapseMenu?.contains(target) ||
    subNavPreviewBreadcrumbCompactButton?.contains(target) ||
    subNavPreviewBreadcrumbCompactMenu?.contains(target)
  ) {
    return;
  }

  if (
    mobileNavButton?.contains(target) ||
    mobileNavMenu?.contains(target) ||
    mobileProfileButton?.contains(target) ||
    mobileProfileMenu?.contains(target)
  ) {
    return;
  }

  if (
    filterPanelButton?.contains(target) ||
    filterPanel?.contains(target) ||
    filterOptionsPanel?.contains(target)
  ) {
    return;
  }

  if (
    accessibilityButton?.contains(target) ||
    accessibilityDrawer?.contains(target) ||
    asyncActivityButton?.contains(target) ||
    asyncActivityDrawer?.contains(target) ||
    brochureEditDrawer?.contains(target) ||
    brochurePreview?.contains(target)
  ) {
    return;
  }

  if (contextNavMoreButton?.contains(target) || contextNavMoreMenu?.contains(target)) {
    return;
  }

  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setBreadcrumbMenuOpen(false);
  setBreadcrumbCompactMenuOpen(false);
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(false, { restoreFocus: !isFocusableOutsideTarget(target) });
  setAsyncActivityDrawerOpen(false, { restoreFocus: !isFocusableOutsideTarget(target) });
  setBrochureEditDrawerOpen(false, { restoreFocus: !isFocusableOutsideTarget(target) });
  setContextNavMoreOpen(false);
  setLanguageModalOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (isLanguageModalOpen()) {
    setLanguageModalOpen(false);
  }

  if (isMenuOpen()) {
    setMenuOpen(false);
    profileButton?.focus();
  }

  if (isPrimaryNavOverflowOpen()) {
    setPrimaryNavOverflowOpen(false);
    primaryNavOverflowButton?.focus();
  }

  if (isMobileNavOpen()) {
    setMobileNavOpen(false);
    mobileNavButton?.focus();
  }

  if (isMobileProfileOpen()) {
    setMobileProfileOpen(false);
    mobileProfileButton?.focus();
  }

  if (isBreadcrumbMenuOpen()) {
    setBreadcrumbMenuOpen(false);
    breadcrumbCollapseButton?.focus();
  }

  if (isBreadcrumbCompactMenuOpen()) {
    setBreadcrumbCompactMenuOpen(false);
    breadcrumbCompactButton?.focus();
  }

  if (isSubNavPreviewBreadcrumbMenuOpen()) {
    setSubNavPreviewBreadcrumbMenuOpen(false);
    subNavPreviewBreadcrumbCollapseButton?.focus();
  }

  if (isSubNavPreviewBreadcrumbCompactMenuOpen()) {
    setSubNavPreviewBreadcrumbCompactMenuOpen(false);
    subNavPreviewBreadcrumbCompactButton?.focus();
  }

  if (isAccessibilityDrawerOpen()) {
    setAccessibilityDrawerOpen(false);
    accessibilityButton?.focus();
  }

  if (isAsyncActivityDrawerOpen()) {
    setAsyncActivityDrawerOpen(false);
    asyncActivityButton?.focus();
  }

  if (isBrochureEditDrawerOpen()) {
    setBrochureEditDrawerOpen(false);
  }

  if (isFilterPanelOpen()) {
    setFilterPanelOpen(false);
    setFilterOptionsPanelOpen(false);
    filterPanelButton?.focus();
  }

  if (isFilterOptionsPanelOpen()) {
    setFilterOptionsPanelOpen(false);
    filterOptionsCloseButton?.focus();
  }

  if (isContextNavMoreOpen()) {
    setContextNavMoreOpen(false);
    contextNavMoreButton?.focus();
  }

});
