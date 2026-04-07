export interface RootAuthzCapabilityCatalogEntry {
  capabilityKey: string;
  description: string;
  mandatoryForRootUserAdmin: boolean;
  protectedForRootUserAdmin: boolean;
}

export const ROOT_USER_ADMIN_ROLE_KEY = "RootUserAdmin";

export const ROOT_AUTHZ_CAPABILITY_CATALOG: RootAuthzCapabilityCatalogEntry[] = [
  {
    capabilityKey: "root-auth.principal.create",
    description: "Create a root auth principal for a root user.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.password.change.own",
    description: "Change the authenticated root user's own password.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.ssh-key.create.own",
    description: "Add an SSH public key to the authenticated root user's own auth principal.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.ssh-key.read.own",
    description: "List SSH public keys for the authenticated root user's own auth principal.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.ssh-key.revoke.own",
    description: "Revoke an SSH public key for the authenticated root user's own auth principal.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.session.read.own",
    description: "List sessions for the authenticated root user's own auth principal.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.session.revoke.own",
    description: "Revoke a session for the authenticated root user's own auth principal.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-auth.session.logout.own",
    description: "Log out the authenticated root user's own current session.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-admin-shell.session.read.own",
    description: "Read the authenticated root user's own browser session summary.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-admin-shell.session.logout.own",
    description: "Log out the authenticated root user's own browser session.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.create",
    description: "Create a root user.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.read.visible",
    description: "Read visible root users and exact visible root-user lookups.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.read.active",
    description: "List active root users only.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: false,
  },
  {
    capabilityKey: "root-user.read.deleted",
    description: "List deleted root users explicitly.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.update",
    description: "Update editable root-user metadata and lifecycle-safe fields.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.delete",
    description: "Soft-delete a root user.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.remove",
    description: "Irreversibly anonymize and remove a root user.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-user.reactivate",
    description: "Reactivate a previously deleted root user.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.create",
    description: "Create a tenant.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.read",
    description: "Read one visible tenant.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.list",
    description: "List visible tenants.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.update",
    description: "Update editable tenant metadata.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.read.deleted",
    description: "Read one deleted tenant explicitly.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.list.deleted",
    description: "List deleted tenants explicitly.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.delete",
    description: "Soft-delete a tenant.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.reactivate",
    description: "Reactivate a previously deleted tenant.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "tenant.remove",
    description:
      "Irreversibly remove a tenant while no dependent tenant-owned entities exist.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.create",
    description: "Create a system root role.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.read",
    description: "Read one system root role.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.list",
    description: "List system root roles.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.update",
    description: "Update editable system root-role metadata.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.delete",
    description: "Deactivate a system root role from future assignment.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.reactivate",
    description: "Reactivate a deactivated system root role.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.capability-catalog.read",
    description: "List eligible authz capabilities for root-role editing.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.capability-assignment.read",
    description: "Read assigned authz capabilities for a root role.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.capability-assignment.update",
    description: "Bulk update authz capability grants for a root role.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.assignment.assign",
    description: "Assign a root role to a root user.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.assignment.unassign",
    description: "Unassign a root role from a root user safely.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.assignment.list",
    description: "List root-role assignments for a root user.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.assignment.replace",
    description: "Atomically replace one root-role assignment with another.",
    mandatoryForRootUserAdmin: true,
    protectedForRootUserAdmin: true,
  },
  {
    capabilityKey: "root-role.effective-permissions.read",
    description: "Read the effective permission set for a root user.",
    mandatoryForRootUserAdmin: false,
    protectedForRootUserAdmin: true,
  },
];

const CAPABILITY_ENTRY_BY_KEY = new Map(
  ROOT_AUTHZ_CAPABILITY_CATALOG.map((entry) => [entry.capabilityKey, entry]),
);

export function getRootAuthzCapabilityEntry(
  capabilityKey: string,
): RootAuthzCapabilityCatalogEntry | null {
  return CAPABILITY_ENTRY_BY_KEY.get(capabilityKey) ?? null;
}
