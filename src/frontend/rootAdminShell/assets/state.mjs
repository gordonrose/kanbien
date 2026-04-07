export function createInitialState() {
  return {
    phase: "bootstrapping",
    session: null,
    challenge: null,
    authMessage: "",
    shellMessage: "",
    sessionExpired: false,
    navigation: {
      currentPage: "my-details",
    },
    rootUsers: {
      items: [],
      filter: "all",
      page: 1,
      pageSize: 25,
      totalPages: 1,
      totalMatchingRecords: 0,
      totalSearchableRecords: 0,
      searchField: "email",
      searchText: "",
      orderBy: "updatedAt",
      orderDirection: "desc",
      drawerMode: null,
      selected: null,
    },
    rootRoles: {
      items: [],
      page: 1,
      pageSize: 25,
      totalPages: 1,
      totalMatchingRecords: 0,
      includeInactive: true,
      drawerMode: null,
      selected: null,
      eligibleCapabilities: [],
      assignedCapabilityKeys: [],
      draftCapabilityKeys: [],
    },
  };
}

export function displayNameForSession(session) {
  return session?.displayName?.trim() ? session.displayName : session?.email ?? "Root User";
}

export function displayNameForRootUser(rootUser) {
  if (!rootUser) {
    return "Root User";
  }

  const name = [rootUser.firstName, rootUser.lastName].filter(Boolean).join(" ").trim();
  return name || rootUser.email || "Root User";
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
    navigation: {
      currentPage: "my-details",
    },
    rootUsers: {
      items: [],
      filter: "all",
      page: 1,
      pageSize: 25,
      totalPages: 1,
      totalMatchingRecords: 0,
      totalSearchableRecords: 0,
      searchField: "email",
      searchText: "",
      orderBy: "updatedAt",
      orderDirection: "desc",
      drawerMode: null,
      selected: null,
    },
    rootRoles: {
      items: [],
      page: 1,
      pageSize: 25,
      totalPages: 1,
      totalMatchingRecords: 0,
      includeInactive: true,
      drawerMode: null,
      selected: null,
      eligibleCapabilities: [],
      assignedCapabilityKeys: [],
      draftCapabilityKeys: [],
    },
  };
}
