function isVisiblePanel(panel) {
  if (!(panel instanceof HTMLElement)) {
    return false;
  }

  if (panel.hidden || panel.classList.contains("hidden")) {
    return false;
  }

  const style = window.getComputedStyle(panel);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }

  const rect = panel.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

export function syncCanonicalOwnerReserve(scope, rules) {
  if (!(scope instanceof HTMLElement)) {
    return;
  }

  const ownersByVariable = new Map();

  for (const rule of rules) {
    if (!rule?.ownerSelector || !rule?.variable) {
      continue;
    }

    let owners = ownersByVariable.get(rule.variable);
    if (!owners) {
      owners = new Set();
      ownersByVariable.set(rule.variable, owners);
    }

    for (const owner of scope.querySelectorAll(rule.ownerSelector)) {
      if (owner instanceof HTMLElement) {
        owners.add(owner);
      }
    }
  }

  for (const [variable, owners] of ownersByVariable.entries()) {
    for (const owner of owners) {
      owner.style.removeProperty(variable);
    }
  }

  for (const rule of rules) {
    if (!rule?.rootSelector || !rule?.panelSelector || !rule?.ownerSelector || !rule?.variable) {
      continue;
    }

    if (typeof rule.when === "function" && !rule.when(scope)) {
      continue;
    }

    const reserveByOwner = new Map();

    for (const root of scope.querySelectorAll(rule.rootSelector)) {
      if (!(root instanceof HTMLElement)) {
        continue;
      }

      const owner = typeof rule.getOwner === "function"
        ? rule.getOwner(root, scope)
        : root.closest(rule.ownerSelector);
      if (!(owner instanceof HTMLElement)) {
        continue;
      }

      const visiblePanels = Array.from(root.querySelectorAll(rule.panelSelector)).filter(isVisiblePanel);
      if (visiblePanels.length === 0) {
        continue;
      }

      const ownerRect = owner.getBoundingClientRect();
      const reserve = visiblePanels.reduce((maxReserve, panel) => {
        const panelRect = panel.getBoundingClientRect();
        return Math.max(maxReserve, Math.ceil(panelRect.bottom - ownerRect.bottom));
      }, 0);

      if (reserve <= 0) {
        continue;
      }

      reserveByOwner.set(owner, Math.max(reserveByOwner.get(owner) ?? 0, reserve));
    }

    for (const [owner, reserve] of reserveByOwner.entries()) {
      owner.style.setProperty(rule.variable, `${reserve}px`);
    }
  }
}
