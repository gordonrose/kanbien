const loginVariantContent = {
  password: {
    eyebrow: "Account access",
    title: "Sign in",
    copy: "Use your email and password to continue to your workspace.",
    action: "Sign in",
  },
  "forgotten-password": {
    eyebrow: "Account recovery",
    title: "Reset password",
    copy: "Confirm the account email so the recovery flow can continue without exposing whether the account exists.",
    action: "Send recovery email",
  },
  "access-code": {
    eyebrow: "Code-based access",
    title: "Enter access code",
    copy: "Use a short-lived code when the password step is replaced by a support or invitation flow.",
    action: "Verify code",
  },
  "ssl-login": {
    eyebrow: "Certificate access",
    title: "SSL Login",
    copy: "Show the certificate posture before the browser completes a client-certificate authentication step.",
    action: "Continue with certificate",
  },
  sso: {
    eyebrow: "Federated access",
    title: "Single sign-on",
    copy: "Collect the work email and route the user to the verified organization identity provider.",
    action: "Continue with SSO",
  },
  "ssh-challenge": {
    eyebrow: "Root admin proof",
    title: "SSH verification",
    copy: "Complete the signed SSH challenge before the browser session is created.",
    action: "Complete SSH Login",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isLoginTemplateVariant(value) {
  return Object.prototype.hasOwnProperty.call(loginVariantContent, value);
}

export function renderRootAdminSshKeyChoiceRows(keys = [], { selectedFingerprint = "" } = {}) {
  if (!Array.isArray(keys) || keys.length === 0) {
    return `
      <div class="form-choice-row" data-ssh-key-choice-empty>
        <span class="login-template-key-copy">
          <strong>No SSH keys available</strong>
          <span class="login-template-key-fingerprint">Add or restore a root-admin SSH key before continuing.</span>
        </span>
      </div>
    `;
  }

  return keys
    .map((key, index) => {
      const fingerprint = String(key?.fingerprint ?? "");
      const label = String(key?.label ?? fingerprint);
      const checked = selectedFingerprint ? fingerprint === selectedFingerprint : index === 0;

      return `
        <label class="form-choice-row">
          <input
            type="radio"
            name="sshKeyFingerprint"
            value="${escapeHtml(fingerprint)}"
            required
            ${checked ? "checked" : ""}
          />
          <span class="login-template-key-copy">
            <strong>${escapeHtml(label)}</strong>
            <span class="login-template-key-fingerprint" title="${escapeHtml(fingerprint)}">${escapeHtml(fingerprint)}</span>
          </span>
        </label>
      `;
    })
    .join("");
}

export function renderLoginTemplate() {
  return `
    <div class="login-template-shell" data-login-template data-login-variant="password">
      <section class="login-template-card" aria-labelledby="login-template-form-title">
        <div class="login-template-card-header">
          <p class="top-nav-preview-eyebrow" data-login-eyebrow>Account access</p>
          <h2 id="login-template-form-title" data-login-title>Sign in</h2>
          <p class="component-catalog-meta" data-login-copy>Use your email and password to continue to your workspace.</p>
        </div>

        <form class="login-template-form" aria-label="Login template form">
          <div class="login-template-panel" data-login-panel="password">
            <label class="form-field">
              <span class="form-field-label">Email</span>
              <input class="form-field-input" type="email" value="owner@example.test" autocomplete="email" />
            </label>
            <label class="form-field">
              <span class="form-field-label">Password</span>
              <input class="form-field-input" type="password" value="kanbien-demo-password" autocomplete="current-password" />
            </label>
            <div class="login-template-inline-row">
              <label class="login-template-check">
                <input type="checkbox" checked />
                <span>Keep me signed in on this device</span>
              </label>
              <button class="login-template-link" type="button" data-login-inline-variant="forgotten-password">Forgot password?</button>
            </div>
          </div>

          <div class="login-template-panel" data-login-panel="forgotten-password" hidden>
            <label class="form-field">
              <span class="form-field-label">Email</span>
              <input class="form-field-input" type="email" value="owner@example.test" autocomplete="email" />
              <span class="form-field-help">Recovery instructions will be sent only when the account is eligible.</span>
            </label>
          </div>

          <div class="login-template-panel" data-login-panel="access-code" hidden>
            <label class="form-field">
              <span class="form-field-label">Email</span>
              <input class="form-field-input" type="email" value="owner@example.test" autocomplete="email" />
            </label>
            <label class="form-field">
              <span class="form-field-label">Access code</span>
              <input class="form-field-input login-template-code-input" type="text" value="482913" inputmode="numeric" autocomplete="one-time-code" />
            </label>
          </div>

          <div class="login-template-panel" data-login-panel="ssl-login" hidden>
            <div class="login-template-method-card">
              <span class="login-template-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M8 10V8a4 4 0 1 1 8 0v2m-9 0h10v9H7zm5 3v2" /></svg>
              </span>
              <div>
                <strong>Certificate login ready</strong>
                <span>Continue after the browser presents an approved client certificate.</span>
              </div>
            </div>
            <label class="form-field">
              <span class="form-field-label">Organization email</span>
              <input class="form-field-input" type="email" value="security@example.test" autocomplete="email" />
            </label>
          </div>

          <div class="login-template-panel" data-login-panel="sso" hidden>
            <label class="form-field">
              <span class="form-field-label">Work email</span>
              <input class="form-field-input" type="email" value="owner@example.test" autocomplete="email" />
              <span class="form-field-help">The organization identity provider owns the next authentication step.</span>
            </label>
            <div class="login-template-method-card">
              <span class="login-template-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M5 12h10m0 0-3.5-3.5M15 12l-3.5 3.5M19 4v16" /></svg>
              </span>
              <div>
                <strong>Single sign-on</strong>
                <span>Route to the verified identity provider for this domain.</span>
              </div>
            </div>
          </div>

          <button class="login-template-primary" type="submit" data-login-primary-action>Sign in</button>
        </form>

        <div class="login-template-secondary-actions" aria-label="Alternative login actions">
          <button class="login-template-secondary" type="button" data-login-inline-variant="access-code">Use access code</button>
          <button class="login-template-secondary" type="button" data-login-inline-variant="ssl-login">Use SSL Login</button>
          <button class="login-template-secondary" type="button" data-login-inline-variant="sso">Continue with SSO</button>
        </div>
      </section>
    </div>
  `;
}

export function renderRootAdminLoginTemplate() {
  return `
    <div class="login-template-shell" data-login-template data-login-variant="password">
      <section class="login-template-card" aria-labelledby="root-admin-login-title">
        <div class="login-template-card-header">
          <p class="top-nav-preview-eyebrow" data-login-eyebrow>Root admin access</p>
          <h1 id="root-admin-login-title" data-login-title>Sign in</h1>
          <p class="component-catalog-meta" data-login-copy>Password verification happens first. SSH proof is required before a browser session is created.</p>
        </div>

        <form id="login-form" class="login-template-form" aria-label="Root admin login form" autocomplete="off">
          <div class="login-template-panel" data-login-panel="password">
            <label class="form-field">
              <span class="form-field-label">Email</span>
              <input id="email" class="form-field-input" name="rootAdminEmail" type="email" autocomplete="off" autocapitalize="none" spellcheck="false" required />
            </label>
            <label class="form-field">
              <span class="form-field-label">Password</span>
              <input id="password" class="form-field-input" name="rootAdminBootstrapPassword" type="password" autocomplete="new-password" autocapitalize="none" spellcheck="false" required />
            </label>
            <button id="password-submit" class="login-template-primary" type="submit" data-login-primary-action>Verify Password</button>
          </div>

          <section id="ssh-stage" class="login-template-panel" data-login-panel="ssh-challenge" hidden>
            <div class="login-template-method-card">
              <span class="login-template-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M12 3 20 7v5c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7zm0 5v5m0 3h.01" /></svg>
              </span>
              <div>
                <strong>SSH verification required</strong>
                <span id="ssh-instructions">Choose one of your registered SSH keys and complete the signed challenge.</span>
              </div>
            </div>

            <fieldset class="form-choice-group" aria-labelledby="ssh-key-choice-label">
              <legend id="ssh-key-choice-label" class="form-choice-legend">Registered SSH key</legend>
              <div id="ssh-key-choice-list" class="form-choice-stack" data-ssh-key-choice-list></div>
            </fieldset>

            <button id="sign-submit" class="login-template-primary" type="button" data-login-primary-action>Complete SSH Login</button>
          </section>
        </form>

        <div id="auth-message" class="login-template-status-message hidden" role="status" aria-live="polite"></div>
      </section>
    </div>
  `;
}

export function createLoginTemplateController(root, options = {}) {
  const loginTemplate = root.querySelector("[data-login-template]");
  const loginVariantButtons = Array.from(document.querySelectorAll("[data-login-variant-option]"));
  const loginInlineVariantButtons = Array.from(root.querySelectorAll("[data-login-inline-variant]"));
  const loginPanels = Array.from(root.querySelectorAll("[data-login-panel]"));
  const loginEyebrow = root.querySelector("[data-login-eyebrow]");
  const loginTitle = root.querySelector("[data-login-title]");
  const loginCopy = root.querySelector("[data-login-copy]");
  const loginPrimaryAction = root.querySelector("[data-login-primary-action]");
  const sshKeyChoiceList = root.querySelector("[data-ssh-key-choice-list]");

  function setTextContent(node, text) {
    if (node instanceof HTMLElement) {
      node.textContent = text;
    }
  }

  function setVariant(variant) {
    if (!(loginTemplate instanceof HTMLElement) || !isLoginTemplateVariant(variant)) {
      return;
    }

    const content = loginVariantContent[variant];
    loginTemplate.dataset.loginVariant = variant;
    setTextContent(loginEyebrow, content.eyebrow);
    setTextContent(loginTitle, content.title);
    setTextContent(loginCopy, content.copy);
    setTextContent(loginPrimaryAction, content.action);

    for (const panel of loginPanels) {
      if (!(panel instanceof HTMLElement)) {
        continue;
      }

      const isActive = panel.dataset.loginPanel === variant;
      panel.hidden = !isActive;
      panel.querySelectorAll("input, button, select, textarea").forEach((control) => {
        if (
          control instanceof HTMLInputElement
          || control instanceof HTMLButtonElement
          || control instanceof HTMLSelectElement
          || control instanceof HTMLTextAreaElement
        ) {
          control.disabled = !isActive;
        }
      });
    }

    for (const button of loginVariantButtons) {
      if (!(button instanceof HTMLButtonElement)) {
        continue;
      }

      const isActive = button.dataset.loginVariantOption === variant;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }
  }

  function renderSshKeyChoices(keys = [], options = {}) {
    if (sshKeyChoiceList instanceof HTMLElement) {
      sshKeyChoiceList.innerHTML = renderRootAdminSshKeyChoiceRows(keys, options);
    }
  }

  for (const button of loginVariantButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    button.addEventListener("click", () => {
      setVariant(button.dataset.loginVariantOption ?? "password");
    });
  }

  for (const button of loginInlineVariantButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    button.addEventListener("click", () => {
      setVariant(button.dataset.loginInlineVariant ?? "password");
    });
  }

  setVariant(isLoginTemplateVariant(options.initialVariant) ? options.initialVariant : "password");

  return {
    renderSshKeyChoices,
    setVariant,
  };
}
