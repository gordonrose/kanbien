import {
  getSelectedAccent,
  getSelectedThemeBaseline,
  hexToRgb,
  mixHex,
  syncTokenColourBaselineButtons,
  tokenColourTextRamp,
  tokenColourStatusScales,
  tokenColourBaselineDefaults,
  tokenColourThemeScales,
} from "./tokenColourModel.mjs";

const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function buildPrimaryStyle(hex, step) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${step / 100})`;
}

function renderSwatch(scale, baseHex, step) {
  const opacity = scale.startStepAtSurface ? (step - 10) / 90 : step / 100;
  const tokenName = `--${scale.tokenPrefix}-${step}`;
  const value = scale.surface ? mixHex(scale.surface, baseHex, opacity) : buildPrimaryStyle(baseHex, step);
  return `
    <article class="token-colour-card">
      <div class="token-colour-swatch" data-token-colour-swatch="${value}"></div>
      <div class="token-colour-card-copy">
        <p class="token-colour-name">${tokenName}</p>
        <code>${tokenName}: ${value};</code>
      </div>
    </article>
  `;
}

function renderScale(scale, baseHex) {
  const target = document.getElementById(`token-colour-${scale.key}-scale`);
  if (!(target instanceof HTMLElement)) {
    return;
  }

  target.innerHTML = steps.map((step) => renderSwatch(scale, baseHex, step)).join("");
  for (const swatch of target.querySelectorAll("[data-token-colour-swatch]")) {
    if (swatch instanceof HTMLElement) {
      swatch.style.backgroundColor = swatch.dataset.tokenColourSwatch ?? "transparent";
    }
  }
}

function renderTextScale(primaryHex) {
  const target = document.getElementById("token-colour-text-scale");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  target.innerHTML = tokenColourTextRamp
    .map(({ step, neutral, tintAmount }) => {
      const tokenName = `--colour-text-${step}`;
      const value = mixHex(neutral, primaryHex, tintAmount);
      return `
        <article class="token-colour-card">
          <div class="token-colour-swatch" data-token-colour-swatch="${value}"></div>
          <div class="token-colour-card-copy">
            <p class="token-colour-name">${tokenName}</p>
            <code>${tokenName}: ${value};</code>
          </div>
        </article>
      `;
    })
    .join("");

  for (const swatch of target.querySelectorAll("[data-token-colour-swatch]")) {
    if (swatch instanceof HTMLElement) {
      swatch.style.backgroundColor = swatch.dataset.tokenColourSwatch ?? "transparent";
    }
  }
}

function renderColourScales() {
  const baselines = {
    primary: getSelectedAccent(),
    dark: getSelectedThemeBaseline("dark", tokenColourBaselineDefaults.dark),
    desert: getSelectedThemeBaseline("desert", tokenColourBaselineDefaults.desert),
  };

  for (const [key, value] of Object.entries(baselines)) {
    const baseline = document.getElementById(`token-colour-${key}-baseline`);
    if (baseline instanceof HTMLElement) {
      baseline.textContent = value;
    }
  }

  for (const scale of tokenColourThemeScales) {
    renderScale(scale, baselines[scale.key] ?? scale.defaultBaseline);
  }
  for (const scale of tokenColourStatusScales) {
    renderScale(scale, scale.defaultBaseline);
  }
  renderTextScale(baselines.primary);
}

for (const button of document.querySelectorAll("[data-accent]")) {
  button.addEventListener("click", () => {
    window.requestAnimationFrame(renderColourScales);
  });
}

syncTokenColourBaselineButtons();

for (const button of document.querySelectorAll("[data-token-colour-baseline]")) {
  button.addEventListener("click", () => {
    window.requestAnimationFrame(renderColourScales);
  });
}

renderColourScales();
