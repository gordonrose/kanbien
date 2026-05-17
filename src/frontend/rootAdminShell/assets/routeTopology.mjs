export const rootAdminCanonicalPaths = {
  overview: "/root-admin",
  users: "/root-admin/users",
  roles: "/root-admin/roles",
  tenants: "/root-admin/tenants",
  "tenant-admins": "/root-admin/tenant-admins",
  "web-app-hierarchy": "/root-admin/web-app-hierarchy",
  "build-backlog": "/root-admin/build/backlog",
  "build-workspace": "/root-admin/build/workspace",
};

const pageAliases = {
  "root-users": "users",
  "root-roles": "roles",
};

const knownPageKeys = new Set(Object.keys(rootAdminCanonicalPaths));

function normalizeRootAdminPathSegments(pathname) {
  return String(pathname ?? "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
}

function deriveNestedPageKeyFromRootAdminPath(pathname) {
  const segments = normalizeRootAdminPathSegments(pathname);
  if (segments[0] !== "root-admin" || segments.length < 2) {
    return null;
  }

  for (let size = segments.length - 1; size >= 1; size -= 1) {
    const candidate = segments.slice(1, 1 + size).join("-");
    const normalized = normalizeRootAdminShellPageKey(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export function normalizeRootAdminShellPageKey(pageKey) {
  if (typeof pageKey !== "string" || pageKey.trim().length === 0) {
    return null;
  }

  const trimmed = pageAliases[pageKey.trim()] ?? pageKey.trim();
  if (knownPageKeys.has(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("root-admin-")) {
    const stripped = trimmed.slice("root-admin-".length);
    return knownPageKeys.has(stripped) ? stripped : null;
  }

  return null;
}

export function normalizePage(page) {
  return normalizeRootAdminShellPageKey(page) ?? "overview";
}

export function deriveShellPageKeyFromRoutePath(routePath, fallbackPageKey = "overview") {
  if (typeof routePath !== "string" || routePath.trim().length === 0) {
    return fallbackPageKey;
  }

  const [pathname, hash = ""] = routePath.split("#", 2);
  if (hash.trim().length > 0) {
    return normalizeRootAdminShellPageKey(hash.trim()) ?? fallbackPageKey;
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin") {
    return fallbackPageKey;
  }

  const nestedPageKey = deriveNestedPageKeyFromRootAdminPath(normalizedPath);
  if (nestedPageKey) {
    return nestedPageKey;
  }

  const segments = normalizeRootAdminPathSegments(normalizedPath);
  return normalizeRootAdminShellPageKey(segments.at(-1)) ?? fallbackPageKey;
}

export function deriveShellPageKeyFromPathname(pathname, fallbackPageKey = "overview") {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    return fallbackPageKey;
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin" || normalizedPath === "") {
    return "overview";
  }

  const nestedPageKey = deriveNestedPageKeyFromRootAdminPath(normalizedPath);
  if (nestedPageKey) {
    return nestedPageKey;
  }

  const segments = normalizeRootAdminPathSegments(normalizedPath);
  if (segments[0] !== "root-admin") {
    return fallbackPageKey;
  }

  if (segments.length === 1) {
    return "overview";
  }

  return normalizeRootAdminShellPageKey(segments[1]) ?? fallbackPageKey;
}

export function buildCanonicalRootAdminPath(pageKey) {
  return rootAdminCanonicalPaths[normalizePage(pageKey)] ?? rootAdminCanonicalPaths.overview;
}

export function isKnownRootAdminShellPage(pageKey) {
  return normalizeRootAdminShellPageKey(pageKey) !== null;
}
