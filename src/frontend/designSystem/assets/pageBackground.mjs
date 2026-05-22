import {
  getSelectedAccent,
  getSelectedThemeBaseline,
  mixHex,
  tokenColourBaselineDefaults,
} from "./tokenColourModel.mjs";

export const pageBackgroundThemeSurfaces = Object.freeze({
  normal: "#ffffff",
  dark: "#101318",
  desert: "#fffdf7",
});

export const pageBackgroundGradientDefaults = Object.freeze({
  glowExtent: 0,
  cornerExtent: 0,
  washExtent: 0,
  normalStrength: 30,
  darkStrength: 72,
  desertStrength: 15,
});

function getActiveTheme(root) {
  const active = root.querySelector("[data-theme-option].active");
  if (active instanceof HTMLElement && active.dataset.themeOption) {
    return active.dataset.themeOption;
  }

  return document.documentElement.dataset.theme || "normal";
}

function getThemeTarget(theme) {
  if (theme === "dark") {
    return getSelectedThemeBaseline("dark", tokenColourBaselineDefaults.dark);
  }

  if (theme === "desert") {
    return getSelectedThemeBaseline("desert", tokenColourBaselineDefaults.desert);
  }

  return getSelectedAccent();
}

export function getPageBackgroundThemeStrengthKey(theme) {
  if (theme === "dark") {
    return "darkStrength";
  }

  if (theme === "desert") {
    return "desertStrength";
  }

  return "normalStrength";
}

function gradientInfluence(extent) {
  if (extent <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, extent / 100)) ** 0.55;
}

function getGradientValue(root, key) {
  const control = root.querySelector(`[data-token-background-control="${key}"]`);
  if (!(control instanceof HTMLInputElement)) {
    return pageBackgroundGradientDefaults[key];
  }

  const value = Number.parseFloat(control.value);
  return Number.isFinite(value) ? value : pageBackgroundGradientDefaults[key];
}

function syncGradientOutputs(root) {
  const outputs = new Map(
    Array.from(root.querySelectorAll("[data-token-background-output]")).map((output) => [
      output.dataset.tokenBackgroundOutput,
      output,
    ]),
  );

  for (const control of root.querySelectorAll("[data-token-background-control]")) {
    if (!(control instanceof HTMLInputElement)) {
      continue;
    }
    const key = control.dataset.tokenBackgroundControl;
    const output = outputs.get(key);
    if (output instanceof HTMLElement) {
      output.textContent = `${control.value}%`;
    }
  }
}

function applyPageBackground(root, onApply) {
  const theme = getActiveTheme(root);
  const surface = pageBackgroundThemeSurfaces[theme] ?? pageBackgroundThemeSurfaces.normal;
  const target = getThemeTarget(theme);
  const colourStrength = getGradientValue(root, getPageBackgroundThemeStrengthKey(theme)) / 100;
  const glowExtent = getGradientValue(root, "glowExtent");
  const cornerExtent = getGradientValue(root, "cornerExtent");
  const washExtent = getGradientValue(root, "washExtent");
  const glowFactor = colourStrength * gradientInfluence(glowExtent);
  const cornerFactor = colourStrength * gradientInfluence(cornerExtent);
  const washFactor = colourStrength * gradientInfluence(washExtent);
  const foundationAmount = 0.42 * colourStrength;
  const washAmount = foundationAmount + (0.22 * washFactor);
  const glowAmount = 0.62 * glowFactor;
  const foundation = mixHex(surface, target, foundationAmount);
  const body = document.body;

  body.style.setProperty("--token-background-start", surface);
  body.style.setProperty("--token-background-end", target);
  body.style.setProperty("--token-background-foundation", foundation);
  body.style.setProperty("--token-background-soft", foundation);
  body.style.setProperty("--token-background-mid", foundation);
  body.style.setProperty("--token-background-wash", mixHex(surface, target, Math.min(1, washAmount)));
  body.style.setProperty("--token-background-glow", mixHex(surface, target, glowAmount));
  body.style.setProperty("--token-background-glow-extent", `${glowExtent}%`);
  body.style.setProperty("--token-background-corner-extent", `${cornerExtent}%`);
  body.style.setProperty("--token-background-wash-extent", `${washExtent}%`);
  body.style.setProperty("--token-background-glow-strength", `${Math.round(28 * glowFactor)}%`);
  body.style.setProperty("--token-background-corner-strength", `${Math.round(10 * cornerFactor)}%`);
  syncGradientOutputs(root);
  onApply?.(theme);
}

export function createPageBackgroundController(root = document, options = {}) {
  let isMounted = false;

  function queueUpdate() {
    window.requestAnimationFrame(() => {
      applyPageBackground(root, options.onApply);
    });
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    for (const button of root.querySelectorAll("[data-theme-option], [data-accent], [data-token-colour-baseline]")) {
      button.addEventListener("click", queueUpdate);
    }

    for (const control of root.querySelectorAll("[data-token-background-control]")) {
      control.addEventListener("input", queueUpdate);
    }

    applyPageBackground(root, options.onApply);
  }

  return {
    getCurrentTheme: () => getActiveTheme(root),
    getGradientValue: (key) => getGradientValue(root, key),
    mount,
    update: () => applyPageBackground(root, options.onApply),
  };
}
