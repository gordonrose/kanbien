export const tokenColourThemeScales = [
  { key: "primary", tokenPrefix: "colour-primary", surface: null, defaultBaseline: "#635bff" },
  { key: "dark", tokenPrefix: "colour-dark", surface: "#101318", defaultBaseline: "#7f8496" },
  { key: "desert", tokenPrefix: "colour-desert", surface: "#fffdf7", defaultBaseline: "#493327" },
];

export const tokenColourTextRamp = [
  { step: 10, neutral: "#0f1115", tintAmount: 0.1 },
  { step: 20, neutral: "#20242c", tintAmount: 0.09 },
  { step: 30, neutral: "#333945", tintAmount: 0.08 },
  { step: 40, neutral: "#485160", tintAmount: 0.07 },
  { step: 50, neutral: "#5f6a7a", tintAmount: 0.06 },
  { step: 60, neutral: "#788292", tintAmount: 0.05 },
  { step: 70, neutral: "#929baa", tintAmount: 0.04 },
  { step: 80, neutral: "#adb5c1", tintAmount: 0.03 },
  { step: 90, neutral: "#cbd1d9", tintAmount: 0.02 },
  { step: 100, neutral: "#edf0f4", tintAmount: 0.015 },
];

export const tokenColourStatusScales = [
  { key: "error", tokenPrefix: "colour-error", surface: "#fff7f6", defaultBaseline: "#dc2626" },
  { key: "warning", tokenPrefix: "colour-warning", surface: "#fff8ed", defaultBaseline: "#ea580c" },
  { key: "success", tokenPrefix: "colour-success", surface: "#f2fbf5", defaultBaseline: "#2f855a" },
];

export const tokenColourBaselineDefaults = Object.fromEntries(
  tokenColourThemeScales.map((scale) => [scale.key, scale.defaultBaseline]),
);

export function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function normalizeHex(hex, fallback = tokenColourBaselineDefaults.primary) {
  const raw = String(hex ?? "").trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) {
    return raw.toLowerCase();
  }
  return fallback;
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1);
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((channel) => clampChannel(channel).toString(16).padStart(2, "0")).join("")}`;
}

export function mixHex(fromHex, toHex, amount) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  return rgbToHex({
    r: from.r + (to.r - from.r) * amount,
    g: from.g + (to.g - from.g) * amount,
    b: from.b + (to.b - from.b) * amount,
  });
}

export function getSelectedAccent() {
  const active = document.querySelector("[data-accent].active");
  if (active instanceof HTMLElement && active.dataset.accent) {
    return normalizeHex(active.dataset.accent, tokenColourBaselineDefaults.primary);
  }

  return normalizeHex(
    getComputedStyle(document.documentElement).getPropertyValue("--accent"),
    tokenColourBaselineDefaults.primary,
  );
}

export function getSelectedThemeBaseline(key, fallback = tokenColourBaselineDefaults[key]) {
  const active = document.querySelector(`[data-token-colour-baseline="${key}"].active`);
  if (active instanceof HTMLElement && active.dataset.tokenColourValue) {
    return normalizeHex(active.dataset.tokenColourValue, fallback);
  }

  return normalizeHex(fallback, tokenColourBaselineDefaults.primary);
}

export function syncTokenColourBaselineButtons() {
  for (const button of document.querySelectorAll("[data-token-colour-baseline]")) {
    button.addEventListener("click", () => {
      const key = button.dataset.tokenColourBaseline;
      for (const option of document.querySelectorAll(`[data-token-colour-baseline="${key}"]`)) {
        const isActive = option === button;
        option.classList.toggle("active", isActive);
        option.setAttribute("aria-pressed", isActive ? "true" : "false");
      }
    });
  }
}
