import {
  createInitialState,
  deriveViewFlags,
  displayNameForSession,
  markSessionExpired,
  resetToLoginState,
} from "./state.mjs";
import { signLoginChallenge } from "./helperClient.mjs";

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

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
  { code: "zh-Hans", name: "Chinese (Simplified)", detail: "Chinese Simplified" },
];

const state = createInitialState();
state.navigation.currentPage = "overview";

let activeLanguageCode = "en";
let languageModalReturnFocusTarget = null;

const authView = document.getElementById("auth-view");
const shellView = document.getElementById("shell-view");
const sshStage = document.getElementById("ssh-stage");
const authMessage = document.getElementById("auth-message");
const shellMessage = document.getElementById("shell-message");
const sessionSummary = document.getElementById("session-summary");
const expiryOverlay = document.getElementById("expiry-overlay");
const sshInstructions = document.getElementById("ssh-instructions");
const sshKeySelect = document.getElementById("ssh-key-select");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const signSubmit = document.getElementById("sign-submit");
const returnToLogin = document.getElementById("return-to-login");
const refreshSessionButton = document.getElementById("refresh-session-button");

const topNav = document.querySelector(".top-nav");
const primaryNav = document.querySelector(".primary-nav");
const primaryNavOverflow = document.getElementById("primary-nav-overflow");
const primaryNavOverflowButton = document.getElementById("primary-nav-overflow-button");
const primaryNavOverflowMenu = document.getElementById("primary-nav-overflow-menu");
const primaryNavLinks = Array.from(document.querySelectorAll("#primary-nav-links .nav-link"));
const mobileNavButton = document.getElementById("mobile-nav-button");
const mobileNavMenu = document.getElementById("mobile-nav-menu");
const mobileNavLinks = Array.from(document.querySelectorAll("#mobile-nav-menu > .nav-link"));
const profileButton = document.getElementById("profile-menu-button");
const profileMenu = document.getElementById("profile-menu");
const profileLabel = document.getElementById("profile-label");
const profileAvatar = document.getElementById("profile-avatar");
const navUtilities = document.querySelector(".nav-utilities");
const mobileProfileButton = document.getElementById("mobile-profile-button");
const mobileProfileMenu = document.getElementById("mobile-profile-menu");
const profileSessionLink = document.getElementById("profile-session-link");
const profileLanguageButton = document.getElementById("profile-language-button");
const profileLogoutButton = document.getElementById("profile-logout-button");
const mobileLanguageButton = document.getElementById("mobile-language-button");
const mobileLogoutButton = document.getElementById("mobile-logout-button");

const languageModal = document.getElementById("language-modal");
const languageModalBackdrop = document.getElementById("language-modal-backdrop");
const languageModalCloseButton = document.getElementById("language-modal-close");
const languageOptionList = document.getElementById("language-option-list");

const brandLabel = document.getElementById("brand-label");
const pageSections = {
  overview: document.getElementById("page-overview"),
  "root-users": document.getElementById("page-root-users"),
  "root-roles": document.getElementById("page-root-roles"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initialsForSession(session) {
  const name = displayNameForSession(session);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "RU";
}

function formatTimestamp(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString();
}

function setMessage(node, message, tone = "info") {
  node.textContent = message;
  node.dataset.tone = tone;
  node.classList.toggle("hidden", !message);
}

function setShellMessage(message, tone = "info") {
  state.shellMessage = message;
  setMessage(shellMessage, message, tone);
}

function renderSessionSummary(session) {
  if (!session) {
    sessionSummary.innerHTML = "";
    return;
  }

  sessionSummary.innerHTML = `
    <div><strong>User</strong><span>${escapeHtml(displayNameForSession(session))}</span></div>
    <div><strong>Email</strong><span>${escapeHtml(session.email)}</span></div>
    <div><strong>Root User ID</strong><span><code>${escapeHtml(session.rootUserId)}</code></span></div>
    <div><strong>Principal ID</strong><span><code>${escapeHtml(session.authPrincipalId)}</code></span></div>
    <div><strong>Session Expires</strong><span>${escapeHtml(formatTimestamp(session.expiresAt))}</span></div>
  `;
}

function setMenuOpen(open) {
  profileButton?.setAttribute("aria-expanded", String(open));
  profileMenu?.classList.toggle("hidden", !open);
}

function isMenuOpen() {
  return profileButton?.getAttribute("aria-expanded") === "true";
}

function setPrimaryNavOverflowOpen(open) {
  primaryNavOverflowButton?.setAttribute("aria-expanded", String(open));
  primaryNavOverflowMenu?.classList.toggle("hidden", !open);
}

function isPrimaryNavOverflowOpen() {
  return primaryNavOverflowButton?.getAttribute("aria-expanded") === "true";
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

function closeTransientShellSurfaces() {
  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
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
      const href = link.getAttribute("href") ?? "/root-admin#overview";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      const title = link.getAttribute("title") ?? label;
      return `<a class="menu-item" href="${href}" data-page-link="${escapeHtml(link.dataset.pageLink ?? "")}" role="menuitem" title="${escapeHtml(title)}"${currentAttr}>${escapeHtml(label)}</a>`;
    })
    .join("");
}

function getVisiblePrimaryNavLinks() {
  return primaryNavLinks.filter((link) => !link.classList.contains("hidden"));
}

function primaryNavFits() {
  return primaryNav ? primaryNav.scrollWidth <= primaryNav.clientWidth : true;
}

function primaryNavOverlapsUtilities() {
  if (!navUtilities) {
    return false;
  }

  const navUtilitiesRect = navUtilities.getBoundingClientRect();
  const lastVisibleLink = getVisiblePrimaryNavLinks().at(-1);

  if (lastVisibleLink) {
    const lastVisibleLinkRect = lastVisibleLink.getBoundingClientRect();
    if (lastVisibleLinkRect.right > navUtilitiesRect.left) {
      return true;
    }
  }

  if (primaryNavOverflowButton && !primaryNavOverflow.classList.contains("hidden")) {
    const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
    if (overflowRect.right > navUtilitiesRect.left) {
      return true;
    }
  }

  const primaryNavRect = primaryNav?.getBoundingClientRect();
  return primaryNavRect ? primaryNavRect.right > navUtilitiesRect.left : false;
}

function primaryNavOverflowOverlapsVisibleLinks() {
  if (!primaryNavOverflowButton || primaryNavOverflow.classList.contains("hidden")) {
    return false;
  }

  const lastVisibleLink = getVisiblePrimaryNavLinks().at(-1);
  if (!lastVisibleLink) {
    return false;
  }

  const lastLinkRect = lastVisibleLink.getBoundingClientRect();
  const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
  return lastLinkRect.right > overflowRect.left;
}

function updatePrimaryNavOverflow() {
  if (!primaryNav || !topNav || primaryNavLinks.length === 0 || !primaryNavOverflow || !primaryNavOverflowButton) {
    return;
  }

  topNav.classList.remove("force-mobile-nav");
  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  renderPrimaryNavOverflowMenu([]);

  for (const link of primaryNavLinks) {
    setPrimaryNavLinkHidden(link, false);
  }

  if (primaryNavFits() && !primaryNavOverlapsUtilities()) {
    return;
  }

  primaryNavOverflow.classList.remove("hidden");

  while (
    getVisiblePrimaryNavLinks().length > 2
    && (!primaryNavFits() || primaryNavOverlapsUtilities() || primaryNavOverflowOverlapsVisibleLinks())
  ) {
    const lastVisibleLink = getVisiblePrimaryNavLinks().at(-1);
    if (!lastVisibleLink) {
      break;
    }
    setPrimaryNavLinkHidden(lastVisibleLink, true);
  }

  if (primaryNavFits() && !primaryNavOverlapsUtilities() && !primaryNavOverflowOverlapsVisibleLinks()) {
    renderPrimaryNavOverflowMenu(primaryNavLinks.filter((link) => link.classList.contains("hidden")));
    return;
  }

  primaryNavOverflow.classList.add("hidden");
  topNav.classList.add("force-mobile-nav");
  setPrimaryNavOverflowOpen(false);
}

function getActiveLanguage() {
  return languageOptions.find((language) => language.code === activeLanguageCode) ?? languageOptions[0];
}

function syncLanguageTriggers() {
  const activeLanguage = getActiveLanguage();
  const label = `Language: ${activeLanguage.name}`;

  if (profileLanguageButton) {
    profileLanguageButton.textContent = label;
    profileLanguageButton.setAttribute("title", label);
  }

  if (mobileLanguageButton) {
    mobileLanguageButton.textContent = label;
    mobileLanguageButton.setAttribute("title", label);
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
      const check = isActive ? '<span class="language-option-check" aria-hidden="true">Selected</span>' : "";

      return `
        <button
          class="language-option${activeClass}"
          type="button"
          role="option"
          data-language-code="${language.code}"
          aria-selected="${String(isActive)}"
        >
          <span class="language-option-label">
            <span class="language-option-name">${escapeHtml(language.name)}</span>
            <span class="language-option-detail">${escapeHtml(language.detail)}</span>
          </span>
          ${check}
        </button>
      `;
    })
    .join("");
}

function setLanguageModalOpen(open, trigger = null) {
  languageModal?.classList.toggle("hidden", !open);
  languageModal?.setAttribute("aria-hidden", String(!open));

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

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (response.status === 401) {
    Object.assign(state, markSessionExpired(state));
    render();
    throw new ApiError(response.status, body?.code ?? "UNAUTHORIZED", body?.message ?? "Your session has expired.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.code ?? "REQUEST_FAILED",
      body?.message ?? "The request could not be completed.",
      body?.details,
    );
  }

  return body;
}

function resolvePageFromLocation() {
  const page = window.location.hash.replace(/^#/, "");
  if (page === "root-users" || page === "root-roles") {
    return page;
  }
  return "overview";
}

function setCurrentPage(page, { syncHash = true } = {}) {
  state.navigation.currentPage = page;

  if (syncHash) {
    const targetHash = `#${page}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, "", targetHash);
    }
  }

  closeTransientShellSurfaces();
  render();
}

function syncNavState() {
  const currentPage = state.navigation.currentPage;
  const syncLinkCollection = (collection) => {
    for (const link of collection) {
      const isCurrent = link.dataset.pageLink === currentPage;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  syncLinkCollection(primaryNavLinks);
  syncLinkCollection(mobileNavLinks);
  syncLinkCollection(Array.from(primaryNavOverflowMenu?.querySelectorAll("[data-page-link]") ?? []));

  for (const [page, section] of Object.entries(pageSections)) {
    section?.classList.toggle("hidden", page !== currentPage);
  }
}

function syncProfileIdentity() {
  const sessionLabel = state.session ? displayNameForSession(state.session) : "Profile";
  const avatar = state.session ? initialsForSession(state.session) : "RU";

  if (profileLabel) {
    profileLabel.textContent = sessionLabel;
    profileLabel.setAttribute("title", sessionLabel);
  }

  if (profileButton) {
    profileButton.setAttribute("title", sessionLabel);
  }

  if (mobileProfileButton) {
    mobileProfileButton.textContent = sessionLabel;
  }

  if (profileAvatar) {
    profileAvatar.textContent = avatar;
  }

  if (brandLabel) {
    brandLabel.setAttribute("title", "Kanbien");
  }
}

function render() {
  const flags = deriveViewFlags(state);
  authView?.classList.toggle("hidden", !flags.showAuthView);
  shellView?.classList.toggle("hidden", !flags.showShellView);
  sshStage?.classList.toggle("hidden", !flags.showSshStage);
  expiryOverlay?.classList.toggle("hidden", !flags.showExpiryOverlay);

  setMessage(authMessage, state.authMessage, "danger");
  setMessage(shellMessage, state.shellMessage);
  renderSessionSummary(state.session);
  syncProfileIdentity();
  syncLanguageTriggers();
  syncNavState();

  if (flags.showShellView) {
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      syncNavState();
    });
  }
}

function messageForError(error, fallback) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

function renderKeyOptions(keys) {
  sshKeySelect.innerHTML = "";
  for (const key of keys) {
    const option = document.createElement("option");
    option.value = key.fingerprint;
    option.textContent = `${key.label} (${key.fingerprint})`;
    sshKeySelect.append(option);
  }
}

async function bootstrapSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    state.phase = "authenticated";
    state.navigation.currentPage = resolvePageFromLocation();
    render();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      Object.assign(state, resetToLoginState(state));
      state.phase = "login";
      render();
      return;
    }
    state.phase = "login";
    state.authMessage = "Could not restore the browser session. Please sign in again.";
    render();
  }
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  state.authMessage = "";
  render();
  try {
    const response = await fetchJson("/v1/root-auth/login/password", {
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });
    state.challenge = response;
    state.phase = "ssh-challenge";
    renderKeyOptions(response.availableSshKeys);
    sshInstructions.textContent = "Choose one of your registered SSH keys and complete the signed challenge.";
    render();
  } catch (error) {
    state.authMessage = messageForError(error, "Could not verify the password.");
    render();
  }
}

async function handleSshSubmit() {
  if (!state.challenge) {
    return;
  }

  state.authMessage = "";
  render();

  try {
    const helperResult = await signLoginChallenge(
      state.challenge.challengeText,
      sshKeySelect.value,
    );
    await fetchJson("/v1/root-auth/browser/login/ssh", {
      method: "POST",
      body: JSON.stringify({
        challengeId: state.challenge.challengeId,
        publicKeyFingerprint: helperResult.publicKeyFingerprint,
        signature: helperResult.signature,
      }),
    });
    state.phase = "authenticated";
    await bootstrapSession();
  } catch (error) {
    state.authMessage = messageForError(error, "Could not complete SSH verification.");
    render();
  }
}

async function handleLogout() {
  try {
    await fetchJson("/v1/root-auth/browser/logout", {
      method: "POST",
      headers: {
        origin: window.location.origin,
      },
    });
  } catch (_error) {
    // Session may already be expired. Reset locally either way.
  }

  window.history.replaceState(null, "", "/root-admin#overview");
  Object.assign(state, resetToLoginState(state));
  render();
}

async function handleRefreshSession() {
  try {
    setShellMessage("Refreshing browser session...");
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    render();
    setShellMessage("Browser session refreshed.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh the browser session."), "danger");
  }
}

loginForm?.addEventListener("submit", handlePasswordSubmit);
signSubmit?.addEventListener("click", handleSshSubmit);
returnToLogin?.addEventListener("click", () => {
  window.history.replaceState(null, "", "/root-admin#overview");
  Object.assign(state, resetToLoginState(state));
  render();
});
refreshSessionButton?.addEventListener("click", handleRefreshSession);
profileLanguageButton?.addEventListener("click", () => setLanguageModalOpen(true, profileLanguageButton));
mobileLanguageButton?.addEventListener("click", () => setLanguageModalOpen(true, mobileLanguageButton));
languageModalCloseButton?.addEventListener("click", () => setLanguageModalOpen(false));
languageModalBackdrop?.addEventListener("click", () => setLanguageModalOpen(false));
profileLogoutButton?.addEventListener("click", handleLogout);
mobileLogoutButton?.addEventListener("click", handleLogout);

profileButton?.addEventListener("click", () => {
  const nextState = !isMenuOpen();
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setMenuOpen(nextState);
});

primaryNavOverflowButton?.addEventListener("click", () => {
  const nextState = !isPrimaryNavOverflowOpen();
  setMenuOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setPrimaryNavOverflowOpen(nextState);
});

mobileNavButton?.addEventListener("click", () => {
  const nextState = !isMobileNavOpen();
  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(nextState);
  if (!nextState) {
    setMobileProfileOpen(false);
  }
});

mobileProfileButton?.addEventListener("click", () => {
  setMobileProfileOpen(!isMobileProfileOpen());
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  if (
    !target.closest(".nav-utilities")
    && !target.closest(".primary-nav-overflow")
    && !target.closest("#mobile-nav-menu")
    && !target.closest("#mobile-nav-button")
  ) {
    closeTransientShellSurfaces();
  }

  const pageLink = target.closest("[data-page-link]");
  if (pageLink instanceof HTMLElement) {
    const page = pageLink.dataset.pageLink;
    if (page) {
      event.preventDefault();
      setCurrentPage(page);
    }
  }

  const languageButton = target.closest("[data-language-code]");
  if (languageButton instanceof HTMLElement) {
    const languageCode = languageButton.dataset.languageCode;
    if (languageCode) {
      selectLanguage(languageCode);
      setLanguageModalOpen(false);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (isLanguageModalOpen()) {
    setLanguageModalOpen(false);
    return;
  }

  closeTransientShellSurfaces();
});

window.addEventListener("resize", () => {
  updatePrimaryNavOverflow();
  syncNavState();
});

window.addEventListener("hashchange", () => {
  state.navigation.currentPage = resolvePageFromLocation();
  render();
});

state.phase = "bootstrapping";
state.navigation.currentPage = resolvePageFromLocation();
render();
bootstrapSession();
