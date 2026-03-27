export function createInitialState() {
  return {
    phase: "bootstrapping",
    session: null,
    challenge: null,
    authMessage: "",
    shellMessage: "",
    sessionExpired: false,
  };
}

export function displayNameForSession(session) {
  return session?.displayName?.trim() ? session.displayName : session?.email ?? "Root User";
}

export function deriveViewFlags(state) {
  return {
    showAuthView: state.phase !== "authenticated",
    showSshStage: state.phase === "ssh-challenge",
    showShellView: state.phase === "authenticated",
    showExpiryOverlay: state.sessionExpired,
  };
}

export function markSessionExpired(state) {
  return {
    ...state,
    phase: "authenticated",
    sessionExpired: true,
    shellMessage: "",
  };
}

export function resetToLoginState(state) {
  return {
    ...state,
    phase: "login",
    session: null,
    challenge: null,
    sessionExpired: false,
    authMessage: "",
    shellMessage: "",
  };
}
