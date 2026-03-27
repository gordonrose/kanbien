import {
  createInitialState,
  deriveViewFlags,
  displayNameForSession,
  markSessionExpired,
  resetToLoginState,
} from "./state.mjs";
import { signLoginChallenge } from "./helperClient.mjs";

const state = createInitialState();

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
const logoutButton = document.getElementById("logout-button");
const returnToLogin = document.getElementById("return-to-login");

function setMessage(node, message, tone = "info") {
  node.textContent = message;
  node.dataset.tone = tone;
  node.classList.toggle("hidden", !message);
}

function renderSessionSummary(session) {
  if (!session) {
    sessionSummary.innerHTML = "";
    return;
  }

  sessionSummary.innerHTML = `
    <div><strong>User</strong><span>${displayNameForSession(session)}</span></div>
    <div><strong>Email</strong><span>${session.email}</span></div>
    <div><strong>Root User ID</strong><span>${session.rootUserId}</span></div>
    <div><strong>Principal ID</strong><span>${session.authPrincipalId}</span></div>
    <div><strong>Session Expires</strong><span>${session.expiresAt}</span></div>
  `;
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

function render() {
  const flags = deriveViewFlags(state);

  authView.classList.toggle("hidden", !flags.showAuthView);
  shellView.classList.toggle("hidden", !flags.showShellView);
  sshStage.classList.toggle("hidden", !flags.showSshStage);
  expiryOverlay.classList.toggle("hidden", !flags.showExpiryOverlay);
  shellView.classList.toggle("blurred", flags.showExpiryOverlay);

  setMessage(authMessage, state.authMessage, "warning");
  setMessage(shellMessage, state.shellMessage, "info");
  renderSessionSummary(state.session);

  if (state.challenge?.availableSshKeys?.length > 0) {
    renderKeyOptions(state.challenge.availableSshKeys);
    sshInstructions.textContent =
      "Choose one of your registered SSH keys, then let the local signing helper complete the challenge.";
  }
}

async function parseJson(response) {
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const body = await parseJson(response);

  if (response.status === 401 && body?.code === "INVALID_SESSION") {
    Object.assign(state, markSessionExpired(state));
    render();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error(body?.message ?? "The request could not be completed.");
  }

  return body;
}

async function bootstrapSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session");
    state.phase = "authenticated";
    state.session = session;
  } catch (error) {
    state.phase = "login";
    state.session = null;
    if (error instanceof Error && error.message !== "SESSION_EXPIRED") {
      state.authMessage = "";
    }
  }

  render();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  state.authMessage = "";

  try {
    const challenge = await fetchJson("/v1/root-auth/login/password", {
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    state.phase = "ssh-challenge";
    state.challenge = challenge;
    state.authMessage = "";
  } catch (error) {
    state.authMessage = error instanceof Error ? error.message : "Password verification failed.";
  }

  render();
});

signSubmit.addEventListener("click", async () => {
  if (!state.challenge) {
    return;
  }

  state.authMessage = "";

  try {
    const helperResult = await signLoginChallenge(
      state.challenge.challengeText,
      sshKeySelect.value,
    );

    const session = await fetchJson("/v1/root-auth/browser/login/ssh", {
      method: "POST",
      body: JSON.stringify({
        challengeId: state.challenge.challengeId,
        signature: helperResult.signature,
        publicKeyFingerprint: helperResult.publicKeyFingerprint,
      }),
    });

    state.phase = "authenticated";
    state.challenge = null;
    state.session = session;
    passwordInput.value = "";
  } catch (error) {
    state.authMessage =
      error instanceof Error
        ? `${error.message} The local signing helper is not available. Start or repair it outside the browser, then try again.`
        : "The local signing helper is not available. Start or repair it outside the browser, then try again.";
  }

  render();
});

logoutButton.addEventListener("click", async () => {
  state.shellMessage = "";

  try {
    await fetchJson("/v1/root-auth/browser/logout", {
      method: "POST",
      headers: {
        origin: window.location.origin,
      },
    });
    Object.assign(state, resetToLoginState(state));
    emailInput.focus();
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      return;
    }

    state.shellMessage = error instanceof Error ? error.message : "Logout failed.";
  }

  render();
});

returnToLogin.addEventListener("click", () => {
  Object.assign(state, resetToLoginState(state));
  render();
  emailInput.focus();
});

bootstrapSession();
