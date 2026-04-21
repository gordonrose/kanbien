import { expect, test, type Page } from "@playwright/test";

async function expectChoiceGroupVariants(page: Page, options?: { errorsVisible?: boolean; inputsDisabled?: boolean }) {
  const errorsVisible = options?.errorsVisible ?? false;
  const inputsDisabled = options?.inputsDisabled ?? false;

  const radioGroup = page.getByRole("group", { name: "Radio buttons", exact: true });
  const checkboxGroup = page.getByRole("group", { name: "Checkboxes", exact: true });
  const sharedStatementGroup = page.getByRole("group", { name: "Checkboxes with shared statement", exact: true });

  await expect(radioGroup).toBeVisible();
  await expect(checkboxGroup).toBeVisible();
  await expect(sharedStatementGroup).toBeVisible();

  await expect(radioGroup.locator(".form-choice-row")).toHaveCount(2);
  await expect(checkboxGroup.locator(".form-choice-row")).toHaveCount(3);
  await expect(sharedStatementGroup.locator(".form-choice-row")).toHaveCount(3);

  await expect(radioGroup.locator(".form-choice-statement")).toHaveCount(0);
  await expect(checkboxGroup.locator(".form-choice-statement")).toHaveCount(0);
  await expect(sharedStatementGroup.locator(".form-choice-statement")).toHaveCount(1);
  await expect(sharedStatementGroup.locator(".form-choice-statement strong")).toHaveText(
    "Before publishing this campaign, confirm the release checklist items below.",
  );
  await expect(sharedStatementGroup).toHaveClass(/form-choice-group-statement/);
  await expect(sharedStatementGroup).toHaveClass(/form-field-span-2/);

  const radioInput = radioGroup.locator('input[type="radio"]').first();
  const checkboxInput = checkboxGroup.locator('input[type="checkbox"]').first();
  const sharedStatementInput = sharedStatementGroup.locator('input[type="checkbox"]').first();

  if (inputsDisabled) {
    await expect(radioInput).toBeDisabled();
    await expect(checkboxInput).toBeDisabled();
    await expect(sharedStatementInput).toBeDisabled();
  } else {
    await expect(radioInput).toBeEnabled();
    await expect(checkboxInput).toBeEnabled();
    await expect(sharedStatementInput).toBeEnabled();
  }

  const radioError = radioGroup.locator(".form-group-error");
  const checkboxError = checkboxGroup.locator(".form-group-error");
  const sharedStatementError = sharedStatementGroup.locator(".form-group-error");

  if (errorsVisible) {
    await expect(radioError).toBeVisible();
    await expect(checkboxError).toBeVisible();
    await expect(sharedStatementError).toBeVisible();
  } else {
    await expect(radioError).toBeHidden();
    await expect(checkboxError).toBeHidden();
    await expect(sharedStatementError).toBeHidden();
  }
}

async function expectInlineEndAligned(trigger: ReturnType<Page["locator"]>, overlay: ReturnType<Page["locator"]>) {
  const triggerBox = await trigger.boundingBox();
  const overlayBox = await overlay.boundingBox();

  expect(triggerBox).not.toBeNull();
  expect(overlayBox).not.toBeNull();

  if (!triggerBox || !overlayBox) {
    return;
  }

  expect(Math.abs(triggerBox.x + triggerBox.width - (overlayBox.x + overlayBox.width))).toBeLessThanOrEqual(2);
}

test.describe("design-system form template", () => {
  test("grouped-choice variants stay distinct in the default parent baseline", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    await expectChoiceGroupVariants(page);
  });

  test("error review preserves inline group errors for radio, checkbox, and shared-statement variants", async ({ page }) => {
    await page.goto("/design-system/templates/form?errors=true");

    await expectChoiceGroupVariants(page, { errorsVisible: true });
  });

  test("disabled mobile rtl review keeps grouped-choice variants readable and non-interactive", async ({ page }) => {
    await page.goto("/design-system/templates/form?disabled=true&mobile=true&dir=rtl");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".form-page-shell")).toHaveAttribute("data-form-mobile-view", "true");
    await expect(page.locator(".form-page-shell")).toHaveAttribute("data-form-disabled-mode", "true");

    await expectChoiceGroupVariants(page, { inputsDisabled: true });
  });

  test("dark theme keeps grouped-choice surfaces visually distinct and readable", async ({ page }) => {
    await page.goto("/design-system/templates/form?theme=dark&errors=true");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectChoiceGroupVariants(page, { errorsVisible: true });

    const styleSnapshot = await page.getByRole("group", { name: "Checkboxes with shared statement", exact: true }).evaluate((group) => {
      const legend = group.querySelector(".form-choice-legend");
      const statementStrong = group.querySelector(".form-choice-statement strong");
      const statementBody = group.querySelector(".form-choice-statement span");
      const row = group.querySelector(".form-choice-row");
      const error = group.querySelector(".form-group-error");
      const groupStyle = window.getComputedStyle(group);
      const rowStyle = row ? window.getComputedStyle(row) : null;
      const legendStyle = legend ? window.getComputedStyle(legend) : null;
      const statementStrongStyle = statementStrong ? window.getComputedStyle(statementStrong) : null;
      const statementBodyStyle = statementBody ? window.getComputedStyle(statementBody) : null;
      const errorStyle = error ? window.getComputedStyle(error) : null;

      return {
        groupBackground: groupStyle.backgroundColor,
        legendColor: legendStyle?.color ?? "",
        statementStrongColor: statementStrongStyle?.color ?? "",
        statementBodyColor: statementBodyStyle?.color ?? "",
        rowBackground: rowStyle?.backgroundColor ?? "",
        rowBorderColor: rowStyle?.borderColor ?? "",
        errorColor: errorStyle?.color ?? "",
      };
    });

    expect(styleSnapshot.legendColor).not.toBe(styleSnapshot.groupBackground);
    expect(styleSnapshot.statementStrongColor).not.toBe(styleSnapshot.groupBackground);
    expect(styleSnapshot.statementBodyColor).not.toBe(styleSnapshot.groupBackground);
    expect(styleSnapshot.rowBackground).not.toBe(styleSnapshot.groupBackground);
    expect(styleSnapshot.rowBorderColor).not.toBe(styleSnapshot.rowBackground);
    expect(styleSnapshot.errorColor).not.toBe(styleSnapshot.groupBackground);
  });

  test("rtl grouped-choice rows mirror the control to the inline end of the copy stack", async ({ page }) => {
    await page.goto("/design-system/templates/form?dir=rtl");

    const rowAlignment = await page.evaluate(() => {
      const snapshotFor = (legendText: string) => {
        const groups = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group"));
        const group = groups.find((candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === legendText);
        const row = group?.querySelector<HTMLElement>(".form-choice-row");
        const input = row?.querySelector<HTMLInputElement>("input");
        const copy = row?.querySelector<HTMLElement>("span");

        if (!row || !input || !copy) {
          return null;
        }

        const rowRect = row.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();

        return {
          rowRight: rowRect.right,
          inputLeft: inputRect.left,
          inputRight: inputRect.right,
          copyLeft: copyRect.left,
          copyRight: copyRect.right,
        };
      };

      return {
        radio: snapshotFor("Radio buttons"),
        sharedStatement: snapshotFor("Checkboxes with shared statement"),
      };
    });

    expect(rowAlignment.radio).not.toBeNull();
    expect(rowAlignment.sharedStatement).not.toBeNull();

    for (const entry of [rowAlignment.radio, rowAlignment.sharedStatement]) {
      if (!entry) {
        continue;
      }

      expect(entry.inputLeft).toBeGreaterThan(entry.copyRight);
      expect(Math.abs(entry.rowRight - entry.inputRight)).toBeLessThanOrEqual(24);
    }
  });

  test("grouped-choice row focus stays visible without shifting row geometry", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const row = page.getByRole("group", { name: "Radio buttons", exact: true }).locator(".form-choice-row").first();
    const input = row.locator('input[type="radio"]');
    const beforeBox = await row.boundingBox();

    await input.focus();

    const focusState = await row.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
        borderColor: style.borderColor,
      };
    });

    const afterBox = await row.boundingBox();

    expect(beforeBox).not.toBeNull();
    expect(afterBox).not.toBeNull();

    if (beforeBox && afterBox) {
      expect(Math.abs(beforeBox.width - afterBox.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(beforeBox.height - afterBox.height)).toBeLessThanOrEqual(1);
    }

    expect(focusState.outlineStyle).not.toBe("none");
    expect(focusState.outlineWidth).not.toBe("0px");
    expect(focusState.outlineColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("combined error and disabled review keeps grouped-choice errors visible and attributable", async ({ page }) => {
    await page.goto("/design-system/templates/form?errors=true&disabled=true");

    await expect(page.locator(".form-page-shell")).toHaveAttribute("data-form-error-mode", "true");
    await expect(page.locator(".form-page-shell")).toHaveAttribute("data-form-disabled-mode", "true");
    await expectChoiceGroupVariants(page, { errorsVisible: true, inputsDisabled: true });

    const combinedState = await page.getByRole("group", { name: "Checkboxes", exact: true }).evaluate((group) => {
      const error = group.querySelector(".form-group-error");
      const errorStyle = error ? window.getComputedStyle(error) : null;
      const groupStyle = window.getComputedStyle(group);

      return {
        groupBackground: groupStyle.backgroundColor,
        groupOpacity: groupStyle.opacity,
        errorColor: errorStyle?.color ?? "",
      };
    });

    expect(combinedState.groupOpacity).not.toBe("0");
   expect(combinedState.errorColor).not.toBe(combinedState.groupBackground);
  });

  test("long grouped-choice copy wraps cleanly on narrow mobile review without breaking row structure", async ({ page }) => {
    await page.goto("/design-system/templates/form?mobile=true");

    await page.evaluate(() => {
      const setGroupRowCopy = (legendText: string, rows: Array<{ title: string; body: string }>) => {
        const groups = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group"));
        const group = groups.find((candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === legendText);
        const rowNodes = Array.from(group?.querySelectorAll<HTMLElement>(".form-choice-row") ?? []);

        rows.forEach((rowCopy, index) => {
          const row = rowNodes[index];
          const title = row?.querySelector("strong");
          const body = row?.querySelector("span span");

          if (title) {
            title.textContent = rowCopy.title;
          }

          if (body) {
            body.textContent = rowCopy.body;
          }
        });
      };

      setGroupRowCopy("Checkboxes", [
        {
          title: "Email digest with a much longer operational label for notification routing",
          body: "Primary outbound summary for admins, owners, and support leads who need enough context to act without opening a second surface.",
        },
        {
          title: "In-app banner with extended explanatory copy for follow-through behavior",
          body: "Reinforces the message after sign-in and keeps the primary action understandable even when the campaign has multiple dependent rollout steps.",
        },
        {
          title: "SMS escalation with contingency-only messaging guidance",
          body: "Reserved for urgent reminders, incident-linked exceptions, and handoff situations where time-sensitive acknowledgement matters more than channel quietness.",
        },
      ]);

      const sharedStatementGroup = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group")).find(
        (candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === "Checkboxes with shared statement",
      );

      const statementTitle = sharedStatementGroup?.querySelector<HTMLElement>(".form-choice-statement strong");
      const statementBody = sharedStatementGroup?.querySelector<HTMLElement>(".form-choice-statement span");

      if (statementTitle) {
        statementTitle.textContent =
          "Before publishing this campaign, confirm the longer release-readiness checklist below so the launch owner, support team, and reporting stakeholders all have the same operating picture.";
      }

      if (statementBody) {
        statementBody.textContent =
          "These boxes intentionally sit beneath one shared statement so the full release condition is visible once, even when each individual item also needs its own clarifying sentence.";
      }
    });

    const layoutState = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group"));

      const inspectGroup = (legendText: string) => {
        const group = groups.find((candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === legendText);
        if (!group) {
          return null;
        }

        const groupRect = group.getBoundingClientRect();
        const statement = group.querySelector<HTMLElement>(".form-choice-statement");
        const statementRect = statement?.getBoundingClientRect() ?? null;

        const rows = Array.from(group.querySelectorAll<HTMLElement>(".form-choice-row")).map((row) => {
          const input = row.querySelector<HTMLInputElement>("input");
          const copy = row.querySelector<HTMLElement>("span");
          const rowRect = row.getBoundingClientRect();
          const inputRect = input?.getBoundingClientRect() ?? null;
          const copyRect = copy?.getBoundingClientRect() ?? null;

          return {
            rowWidth: rowRect.width,
            rowHeight: rowRect.height,
            inputHeight: inputRect?.height ?? 0,
            inputRight: inputRect?.right ?? 0,
            copyLeft: copyRect?.left ?? 0,
            copyRight: copyRect?.right ?? 0,
            copyBottom: copyRect?.bottom ?? 0,
            rowBottom: rowRect.bottom,
            copyScrollWidth: copy?.scrollWidth ?? 0,
            copyClientWidth: copy?.clientWidth ?? 0,
          };
        });

        return {
          groupScrollWidth: group.scrollWidth,
          groupClientWidth: group.clientWidth,
          statementBottom: statementRect?.bottom ?? 0,
          groupBottom: groupRect.bottom,
          rows,
        };
      };

      return {
        checkboxes: inspectGroup("Checkboxes"),
        shared: inspectGroup("Checkboxes with shared statement"),
      };
    });

    expect(layoutState.checkboxes).not.toBeNull();
    expect(layoutState.shared).not.toBeNull();

    for (const group of [layoutState.checkboxes, layoutState.shared]) {
      if (!group) {
        continue;
      }

      expect(group.groupScrollWidth).toBeLessThanOrEqual(group.groupClientWidth + 2);

      if (group.statementBottom) {
        expect(group.statementBottom).toBeLessThanOrEqual(group.groupBottom + 1);
      }

      for (const row of group.rows) {
        expect(row.rowHeight).toBeGreaterThan(row.inputHeight);
        expect(row.inputRight).toBeLessThan(row.copyLeft);
        expect(row.copyRight).toBeLessThanOrEqual(row.rowWidth + row.copyLeft);
        expect(row.copyBottom).toBeLessThanOrEqual(row.rowBottom + 1);
        expect(row.copyScrollWidth).toBeLessThanOrEqual(row.copyClientWidth + 2);
      }
    }
  });

  test("localized arabic grouped-choice copy stays mirrored and readable in rtl review", async ({ page }) => {
    await page.goto("/design-system/templates/form?dir=rtl&mobile=true");

    await page.evaluate(() => {
      const setLegend = (from: string, to: string) => {
        const group = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group")).find(
          (candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === from,
        );
        const legend = group?.querySelector<HTMLElement>(".form-choice-legend");

        if (legend) {
          legend.textContent = to;
        }
      };

      const setGroupRowCopy = (legendText: string, rows: Array<{ title: string; body: string }>) => {
        const groups = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group"));
        const group = groups.find((candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === legendText);
        const rowNodes = Array.from(group?.querySelectorAll<HTMLElement>(".form-choice-row") ?? []);

        rows.forEach((rowCopy, index) => {
          const row = rowNodes[index];
          const title = row?.querySelector("strong");
          const body = row?.querySelector("span span");

          if (title) {
            title.textContent = rowCopy.title;
          }

          if (body) {
            body.textContent = rowCopy.body;
          }
        });
      };

      setLegend("Checkboxes", "خانات الاختيار");
      setLegend("Checkboxes with shared statement", "خانات الاختيار مع عبارة مشتركة");

      setGroupRowCopy("خانات الاختيار", [
        {
          title: "ملخص البريد الإلكتروني للإشعارات التشغيلية",
          body: "يوفر هذا الخيار ملخصاً واضحاً للمشرفين والمالكين حتى يتمكنوا من المتابعة دون فتح شاشة إضافية.",
        },
        {
          title: "لافتة داخل التطبيق بعبارة توضيحية أطول",
          body: "تعزز الرسالة بعد تسجيل الدخول وتحافظ على وضوح الإجراء المطلوب حتى عندما تكون هناك خطوات إطلاق متعددة.",
        },
        {
          title: "تصعيد الرسائل النصية للحالات العاجلة فقط",
          body: "يُستخدم هذا الخيار للتذكيرات الحساسة زمنياً وحالات الاستثناء التي تحتاج إلى تأكيد سريع وواضح.",
        },
      ]);

      const sharedStatementGroup = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group")).find(
        (candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === "خانات الاختيار مع عبارة مشتركة",
      );

      const statementTitle = sharedStatementGroup?.querySelector<HTMLElement>(".form-choice-statement strong");
      const statementBody = sharedStatementGroup?.querySelector<HTMLElement>(".form-choice-statement span");
      const error = sharedStatementGroup?.querySelector<HTMLElement>(".form-group-error");

      if (statementTitle) {
        statementTitle.textContent =
          "قبل نشر هذه الحملة، راجع عناصر قائمة التحقق التالية حتى يكون فريق الإطلاق والدعم والتقارير على فهم واحد للحالة.";
      }

      if (statementBody) {
        statementBody.textContent =
          "تجلس هذه الخانات تحت عبارة مشتركة واحدة حتى تبقى حالة الإصدار مفهومة بوضوح حتى عندما يحتاج كل عنصر إلى شرح إضافي خاص به.";
      }

      if (error) {
        error.textContent = "أكمل عناصر التأكيد المطلوبة قبل النشر.";
      }
    });

    const rtlState = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group"));
      const shared = groups.find((candidate) => candidate.querySelector(".form-choice-legend")?.textContent?.trim() === "خانات الاختيار مع عبارة مشتركة");

      const rows = Array.from(shared?.querySelectorAll<HTMLElement>(".form-choice-row") ?? []).map((row) => {
        const input = row.querySelector<HTMLInputElement>("input");
        const copy = row.querySelector<HTMLElement>("span");
        const rowRect = row.getBoundingClientRect();
        const inputRect = input?.getBoundingClientRect() ?? null;
        const copyRect = copy?.getBoundingClientRect() ?? null;

        return {
          inputLeft: inputRect?.left ?? 0,
          inputRight: inputRect?.right ?? 0,
          copyLeft: copyRect?.left ?? 0,
          copyRight: copyRect?.right ?? 0,
          rowRight: rowRect.right,
          copyScrollWidth: copy?.scrollWidth ?? 0,
          copyClientWidth: copy?.clientWidth ?? 0,
        };
      });

      const statement = shared?.querySelector<HTMLElement>(".form-choice-statement");
      const statementStyle = statement ? window.getComputedStyle(statement) : null;

      return {
        htmlDir: document.documentElement.getAttribute("dir"),
        rows,
        statementAlign: statementStyle?.textAlign ?? "",
        statementScrollWidth: statement?.scrollWidth ?? 0,
        statementClientWidth: statement?.clientWidth ?? 0,
      };
    });

    expect(rtlState.htmlDir).toBe("rtl");
    expect(rtlState.statementAlign).toBe("start");
    expect(rtlState.statementScrollWidth).toBeLessThanOrEqual(rtlState.statementClientWidth + 2);

    for (const row of rtlState.rows) {
      expect(row.inputLeft).toBeGreaterThan(row.copyRight);
      expect(Math.abs(row.rowRight - row.inputRight)).toBeLessThanOrEqual(24);
      expect(row.copyScrollWidth).toBeLessThanOrEqual(row.copyClientWidth + 2);
    }
  });

  test("desktop rtl dropdown and picker surfaces mirror to the trigger inline end", async ({ page }) => {
    await page.goto("/design-system/templates/form?dir=rtl");

    const selectTrigger = page.locator("#form-audience-trigger");
    const selectListbox = page.locator("[data-form-select-listbox]").first();
    const dateTrigger = page.locator("#form-launch-date-trigger");
    const datePanel = page.locator('[data-picker-mode="single"] [data-form-date-panel]');
    const timeTrigger = page.locator("#form-launch-time-trigger");
    const timePanel = page.locator("[data-form-time-picker]").first().locator("[data-form-time-panel]");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await selectTrigger.click();
    await expect(selectListbox).toBeVisible();
    await expectInlineEndAligned(selectTrigger, selectListbox);

    await dateTrigger.click();
    await expect(datePanel).toBeVisible();
    await expectInlineEndAligned(dateTrigger, datePanel);

    await timeTrigger.click();
    await expect(timePanel).toBeVisible();
    await expectInlineEndAligned(timeTrigger, timePanel);
  });

  test("standalone time picker keeps hour selection open, then closes on minute selection and returns focus", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const root = page.locator("[data-form-time-picker]").first();
    const trigger = root.locator("#form-launch-time-trigger");
    const panel = root.locator("[data-form-time-panel]");
    const hiddenInput = page.locator('input[name="launchTime"]');

    await trigger.click();
    await expect(panel).toBeVisible();

    await panel.locator('[data-form-time-hour="14"]').click();
    await expect(panel).toBeVisible();
    await expect(hiddenInput).toHaveValue("14:30");

    await panel.locator('[data-form-time-minute="45"]').click();
    await expect(panel).toBeHidden();
    await expect(hiddenInput).toHaveValue("14:45");
    await expect(trigger).toBeFocused();
    await expect(trigger).toContainText("14:45");
  });

  test("nested time picker can stay inside an open date-range-with-time flow and updates the composed label", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const dateTrigger = page.locator("#form-release-window-trigger");
    const datePanel = page.locator('[data-picker-mode="range-time"] [data-form-date-panel]');
    const startTimeRoot = page.locator('[data-picker-mode="range-time"] [data-form-time-picker]').first();
    const startTimeTrigger = startTimeRoot.locator("#form-release-window-start-time-trigger");
    const startTimePanel = startTimeRoot.locator("[data-form-time-panel]");

    await dateTrigger.click();
    await expect(datePanel).toBeVisible();

    await startTimeTrigger.click();
    await expect(startTimePanel).toBeVisible();
    await expect(datePanel).toBeVisible();

    await startTimePanel.locator('[data-form-time-hour="13"]').click();
    await expect(startTimePanel).toBeVisible();

    await startTimePanel.locator('[data-form-time-minute="15"]').click();
    await expect(startTimePanel).toBeHidden();
    await expect(startTimeTrigger).toBeFocused();
    await expect(datePanel).toBeVisible();
    await expect(dateTrigger).toContainText("May 4, 2026 1:15 PM - May 10, 2026 5:00 PM");
  });

  test("mobile time picker stays hidden until opened, then uses overlay posture and returns focus on escape", async ({ page }) => {
    await page.goto("/design-system/templates/form?mobile=true&dir=rtl");

    const root = page.locator("[data-form-time-picker]").first();
    const trigger = root.locator("#form-launch-time-trigger");
    const panel = root.locator("[data-form-time-panel]");

    await expect(panel).toBeHidden();

    await trigger.click();
    await expect(panel).toBeVisible();

    const overlayState = await panel.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        position: style.position,
        top: style.top,
      };
    });

    expect(overlayState.position).toBe("fixed");
    expect(overlayState.top).toBe("0px");

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("clicking a form field while display settings is open preserves focus on that field", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const launcher = page.locator("#accessibility-button");
    const drawer = page.locator("#accessibility-drawer");
    const field = page.getByRole("textbox", { name: /^Text field\b/i });

    await expect(launcher).toBeVisible();
    await launcher.click();
    await expect(drawer).toBeVisible();

    await field.click();

    await expect(drawer).toBeHidden();
    await expect(field).toBeFocused();
  });

  test("drawer select traps keyboard focus until exit", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const trigger = page.locator("[data-form-drawer-select-button]").nth(1);
    const panel = page.locator("[data-form-drawer-select-panel]").nth(1);
    const searchInput = panel.locator("[data-form-drawer-select-search]");
    const closeButton = panel.getByRole("button", { name: /close tenant segment drawer/i });
    const lastOption = panel.locator("[data-form-drawer-select-option]:not(.hidden)").last();

    await trigger.click();

    await expect(panel).toBeVisible();
    await expect(searchInput).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(lastOption).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("opening a date picker passively closes unrelated open select, drawer-select, and standalone time-picker surfaces", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const selectTrigger = page.locator("[data-form-select-button]").first();
    const selectListbox = page.locator("[data-form-select-listbox]").first();
    const drawerTrigger = page.locator("[data-form-drawer-select-button]").first();
    const drawerPanel = page.locator("[data-form-drawer-select-panel]").first();
    const timeTrigger = page.locator("#form-launch-time-trigger");
    const timePanel = page.locator("[data-form-time-picker]").first().locator("[data-form-time-panel]");
    const dateTrigger = page.locator("#form-review-range-trigger");
    const datePanel = page.locator('[data-picker-mode="range"] [data-form-date-panel]');

    await selectTrigger.click();
    await expect(selectListbox).toBeVisible();

    await dateTrigger.click();
    await expect(datePanel).toBeVisible();
    await expect(selectListbox).toBeHidden();

    await drawerTrigger.click();
    await expect(drawerPanel).toBeVisible();

    await dateTrigger.click();
    await expect(datePanel).toBeVisible();
    await expect(drawerPanel).toBeHidden();

    await timeTrigger.click();
    await expect(timePanel).toBeVisible();

    await dateTrigger.click();
    await expect(datePanel).toBeVisible();
    await expect(timePanel).toBeHidden();
  });

  test("drawer select keeps search, empty states, and trigger summary in sync", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const collectionTrigger = page.locator("[data-form-drawer-select-button]").first();
    const collectionPanel = page.locator("[data-form-drawer-select-panel]").first();
    const collectionSearch = collectionPanel.locator("[data-form-drawer-select-search]");
    const collectionSelectedEmpty = collectionPanel.locator("[data-form-drawer-select-selected-empty]");
    const collectionSearchEmpty = collectionPanel.locator("[data-form-drawer-select-empty]");
    const financeAdminsOption = collectionPanel.locator("[data-form-drawer-select-option][data-value='finance-admins']");
    const financeAdminsChip = collectionPanel.locator("[data-form-drawer-select-remove='finance-admins']");
    const selectedCount = collectionPanel.locator("[data-form-drawer-select-selected-count]");

    await collectionTrigger.click();
    await expect(collectionPanel).toBeVisible();
    await expect(collectionSearch).toBeFocused();
    await expect(selectedCount).toHaveText("3 selected");

    await collectionSearch.fill("finance");
    await expect(financeAdminsOption).toBeVisible();
    await expect(collectionSearchEmpty).toBeHidden();

    await financeAdminsOption.click();
    await expect(selectedCount).toHaveText("4 selected");
    await expect(page.locator("[data-form-drawer-select-summary]").first()).toHaveText("Ops Core, Finance Admins +2 more");

    await collectionSearch.fill("zzzz");
    await expect(collectionSearchEmpty).toBeVisible();
    await expect(financeAdminsChip).toBeVisible();

    await financeAdminsChip.click();
    await expect(selectedCount).toHaveText("3 selected");
    await expect(page.locator("[data-form-drawer-select-summary]").first()).toHaveText("Ops Core, Customer Success +1 more");

    await collectionSearch.fill("");
    for (const value of ["ops-core", "customer-success", "renewals-watch"]) {
      await collectionPanel.locator(`[data-form-drawer-select-remove='${value}']`).click();
    }

    await expect(collectionSelectedEmpty).toBeVisible();
    await expect(selectedCount).toHaveText("0 selected");
    await expect(page.locator("[data-form-drawer-select-summary]").first()).toHaveText("Choose collections");

    await page.keyboard.press("Escape");
    await expect(collectionPanel).toBeHidden();

    await collectionTrigger.click();
    await expect(collectionPanel).toBeVisible();
    await expect(collectionSearch).toHaveValue("");
    await expect(collectionSearchEmpty).toBeHidden();
    await expect(collectionPanel.locator("[data-form-drawer-select-option]:not(.hidden)")).toHaveCount(8);

    await page.keyboard.press("Escape");
    await expect(collectionPanel).toBeHidden();

    const segmentTrigger = page.locator("[data-form-drawer-select-button]").nth(1);
    const segmentPanel = page.locator("[data-form-drawer-select-panel]").nth(1);

    await segmentTrigger.click();
    await expect(segmentPanel).toBeVisible();

    for (const value of ["new-admins", "at-risk-renewals"]) {
      await segmentPanel.locator(`[data-form-drawer-select-remove='${value}']`).click();
    }

    await expect(page.locator("[data-form-drawer-select-summary]").nth(1)).toHaveText("Choose segments");
  });

  test("parent drawer-select open state keeps search plus Selected and Available stacks visible for both variants", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    for (const index of [0, 1]) {
      const trigger = page.locator("[data-form-drawer-select-button]").nth(index);
      const panel = page.locator("[data-form-drawer-select-panel]").nth(index);
      const searchInput = panel.locator("[data-form-drawer-select-search]");
      const selectedTitle = panel.getByRole("heading", { name: "Selected", exact: true });
      const availableTitle = panel.getByRole("heading", { name: "Available", exact: true });
      const selectedCount = panel.locator("[data-form-drawer-select-selected-count]");
      const selectedChips = panel.locator(".form-drawer-select-selected-chip");
      const visibleOptions = panel.locator("[data-form-drawer-select-option]:not(.hidden)");

      await trigger.click();

      await expect(panel).toBeVisible();
      await expect(searchInput).toBeFocused();
      await expect(selectedTitle).toBeVisible();
      await expect(availableTitle).toBeVisible();
      await expect(selectedCount).toBeVisible();
      await expect(selectedChips).toHaveCount(index === 0 ? 3 : 2);
      await expect(visibleOptions).toHaveCount(index === 0 ? 8 : 6);

      const panelState = await panel.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);

        return {
          position: style.position,
          zIndex: style.zIndex,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        };
      });

      expect(panelState.position).toBe("fixed");
      expect(Number(panelState.zIndex)).toBeGreaterThanOrEqual(8);
      expect(panelState.top).toBeGreaterThanOrEqual(0);
      expect(panelState.left).toBeGreaterThanOrEqual(-1);
      expect(panelState.right).toBeLessThanOrEqual(panelState.viewportWidth + 1);
      expect(panelState.bottom).toBeLessThanOrEqual(panelState.viewportHeight + 1);

      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  });

  test("parent drawer-select panel stays layered and on-screen under rtl magnification stress", async ({ page }) => {
    await page.goto("/design-system/templates/form?dir=rtl&zoom=100");

    const trigger = page.locator("[data-form-drawer-select-button]").first();
    const panel = page.locator("[data-form-drawer-select-panel]").first();
    const searchInput = panel.locator("[data-form-drawer-select-search]");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await trigger.click();

    await expect(panel).toBeVisible();
    await expect(searchInput).toBeFocused();

    const stressState = await panel.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const selectedTitle = node.querySelector(".form-drawer-select-selected-title");
      const selectedTitleStyle = selectedTitle ? window.getComputedStyle(selectedTitle) : null;

      return {
        position: style.position,
        zIndex: style.zIndex,
        boxShadow: style.boxShadow,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        titleColor: selectedTitleStyle?.color ?? "",
        panelBackground: style.backgroundColor,
      };
    });

    expect(stressState.position).toBe("fixed");
    expect(Number(stressState.zIndex)).toBeGreaterThanOrEqual(8);
    expect(stressState.boxShadow).not.toBe("none");
    expect(stressState.top).toBeGreaterThanOrEqual(0);
    expect(stressState.left).toBeGreaterThanOrEqual(-1);
    expect(stressState.right).toBeLessThanOrEqual(stressState.viewportWidth + 1);
    expect(stressState.bottom).toBeLessThanOrEqual(stressState.viewportHeight + 1);
    expect(stressState.width).toBeGreaterThan(200);
    expect(stressState.titleColor).not.toBe(stressState.panelBackground);
  });

  test("mobile magnified long-copy review keeps section cadence and footer actions readable across mixed seams", async ({
    page,
  }) => {
    await page.goto("/design-system/templates/form?mobile=true&zoom=100");

    await page.evaluate(() => {
      const setText = (selector: string, text: string) => {
        const node = document.querySelector<HTMLElement>(selector);
        if (node) {
          node.textContent = text;
        }
      };

      setText(
        "#form-section-basics + .form-page-section-copy",
        "Keep the scheduling controls, helper copy, and field descriptions readable even when the launch owner needs more context before sending anything customer-facing.",
      );
      setText(
        "#form-section-preferences + .form-page-section-copy",
        "This section intentionally mixes child seams so operators can compare grouped choices, drawer-based selection, and toggle posture without losing the parent page rhythm.",
      );
      setText(
        'label[for="form-campaign-title"] + .form-field-help, [id="form-campaign-title"] ~ .form-field-help',
        "Use a specific campaign name that still reads clearly in audit trails, post-launch retrospectives, and any support conversation that references the message later.",
      );

      const helpNodes = Array.from(document.querySelectorAll<HTMLElement>(".form-field-help"));
      if (helpNodes[helpNodes.length - 1]) {
        helpNodes[helpNodes.length - 1].textContent =
          "Keep this toggle explanation long enough to stress the parent page rhythm, including mobile stacking, footer separation, and the ability to keep the action zone calm beneath dense settings.";
      }

      const footerButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".form-page-footer button"));
      if (footerButtons[1]) {
        footerButtons[1].textContent = "Save draft for final approval review";
      }
      if (footerButtons[2]) {
        footerButtons[2].textContent = "Publish campaign to the selected audience";
      }
    });

    const compositionState = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>(".form-page-shell");
      const card = document.querySelector<HTMLElement>(".form-page-card");
      const basics = document.getElementById("form-section-basics")?.closest<HTMLElement>(".form-page-section");
      const preferences = document.getElementById("form-section-preferences")?.closest<HTMLElement>(".form-page-section");
      const lastField = document.querySelector<HTMLElement>(".form-toggle-row");
      const footer = document.querySelector<HTMLElement>(".form-page-footer");
      const footerButtons = Array.from(document.querySelectorAll<HTMLElement>(".form-page-footer button"));

      const buttonRects = footerButtons.map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          scrollWidth: button.scrollWidth,
          clientWidth: button.clientWidth,
        };
      });

      const shellRect = shell?.getBoundingClientRect() ?? null;
      const cardRect = card?.getBoundingClientRect() ?? null;
      const basicsRect = basics?.getBoundingClientRect() ?? null;
      const preferencesRect = preferences?.getBoundingClientRect() ?? null;
      const lastFieldRect = lastField?.getBoundingClientRect() ?? null;
      const footerRect = footer?.getBoundingClientRect() ?? null;

      return {
        shellScrollWidth: shell?.scrollWidth ?? 0,
        shellClientWidth: shell?.clientWidth ?? 0,
        cardScrollWidth: card?.scrollWidth ?? 0,
        cardClientWidth: card?.clientWidth ?? 0,
        shellLeft: shellRect?.left ?? 0,
        shellRight: shellRect?.right ?? 0,
        cardLeft: cardRect?.left ?? 0,
        cardRight: cardRect?.right ?? 0,
        basicsBottom: basicsRect?.bottom ?? 0,
        preferencesTop: preferencesRect?.top ?? 0,
        lastFieldBottom: lastFieldRect?.bottom ?? 0,
        footerTop: footerRect?.top ?? 0,
        footerLeft: footerRect?.left ?? 0,
        footerRight: footerRect?.right ?? 0,
        footerScrollWidth: footer?.scrollWidth ?? 0,
        footerClientWidth: footer?.clientWidth ?? 0,
        buttonRects,
      };
    });

    expect(compositionState.shellScrollWidth).toBeLessThanOrEqual(compositionState.shellClientWidth + 2);
    expect(compositionState.cardScrollWidth).toBeLessThanOrEqual(compositionState.cardClientWidth + 2);
    expect(compositionState.cardLeft).toBeGreaterThanOrEqual(compositionState.shellLeft - 1);
    expect(compositionState.cardRight).toBeLessThanOrEqual(compositionState.shellRight + 1);
    expect(compositionState.basicsBottom).toBeLessThanOrEqual(compositionState.preferencesTop);
    expect(compositionState.lastFieldBottom).toBeLessThan(compositionState.footerTop);
    expect(compositionState.footerScrollWidth).toBeLessThanOrEqual(compositionState.footerClientWidth + 2);

    let previousBottom = 0;
    for (const rect of compositionState.buttonRects) {
      expect(rect.left).toBeGreaterThanOrEqual(compositionState.footerLeft - 1);
      expect(rect.right).toBeLessThanOrEqual(compositionState.footerRight + 1);
      expect(rect.scrollWidth).toBeLessThanOrEqual(rect.clientWidth + 2);
      expect(rect.top).toBeGreaterThanOrEqual(previousBottom - 1);
      previousBottom = rect.bottom;
    }
  });

  test("desktop magnified parent composition keeps mixed child seams and footer actions in distinct zones", async ({ page }) => {
    await page.goto("/design-system/templates/form?zoom=100");

    const compositionState = await page.evaluate(() => {
      const basics = document.getElementById("form-section-basics")?.closest<HTMLElement>(".form-page-section");
      const preferences = document.getElementById("form-section-preferences")?.closest<HTMLElement>(".form-page-section");
      const dateRangeField = document.querySelector<HTMLElement>('[data-picker-mode="range-with-time"]')?.closest(".form-field");
      const firstDrawerSelect = document.getElementById("form-collection-label")?.closest<HTMLElement>(".form-field");
      const sharedStatement = Array.from(document.querySelectorAll<HTMLElement>(".form-choice-group")).find((group) =>
        group.querySelector(".form-choice-legend")?.textContent?.trim() === "Checkboxes with shared statement",
      );
      const footer = document.querySelector<HTMLElement>(".form-page-footer");
      const footerButtons = Array.from(document.querySelectorAll<HTMLElement>(".form-page-footer button"));
      const card = document.querySelector<HTMLElement>(".form-page-card");

      const basicsRect = basics?.getBoundingClientRect() ?? null;
      const preferencesRect = preferences?.getBoundingClientRect() ?? null;
      const dateRangeRect = dateRangeField?.getBoundingClientRect() ?? null;
      const drawerRect = firstDrawerSelect?.getBoundingClientRect() ?? null;
      const sharedRect = sharedStatement?.getBoundingClientRect() ?? null;
      const footerRect = footer?.getBoundingClientRect() ?? null;
      const cardRect = card?.getBoundingClientRect() ?? null;

      return {
        cardScrollWidth: card?.scrollWidth ?? 0,
        cardClientWidth: card?.clientWidth ?? 0,
        basicsBottom: basicsRect?.bottom ?? 0,
        preferencesTop: preferencesRect?.top ?? 0,
        dateRangeBottom: dateRangeRect?.bottom ?? 0,
        drawerTop: drawerRect?.top ?? 0,
        sharedBottom: sharedRect?.bottom ?? 0,
        footerTop: footerRect?.top ?? 0,
        cardLeft: cardRect?.left ?? 0,
        cardRight: cardRect?.right ?? 0,
        footerButtonTops: footerButtons.map((button) => button.getBoundingClientRect().top),
        footerButtonRights: footerButtons.map((button) => button.getBoundingClientRect().right),
      };
    });

    expect(compositionState.cardScrollWidth).toBeLessThanOrEqual(compositionState.cardClientWidth + 2);
    expect(compositionState.basicsBottom).toBeLessThanOrEqual(compositionState.preferencesTop);
    expect(compositionState.dateRangeBottom).toBeLessThan(compositionState.drawerTop);
    expect(compositionState.sharedBottom).toBeLessThan(compositionState.footerTop);

    const firstButtonTop = compositionState.footerButtonTops[0] ?? 0;
    for (const top of compositionState.footerButtonTops) {
      expect(Math.abs(top - firstButtonTop)).toBeLessThanOrEqual(2);
    }

    let previousRight = compositionState.cardLeft;
    for (const right of compositionState.footerButtonRights) {
      expect(right).toBeLessThanOrEqual(compositionState.cardRight + 1);
      expect(right).toBeGreaterThan(previousRight);
      previousRight = right;
    }
  });

  test("icon grid modal searches the governed icon library and syncs the selected trigger state", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const trigger = page.locator("#form-campaign-icon-trigger");
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Choose campaign icon" });
    const search = dialog.getByPlaceholder("Search icons");

    await expect(dialog).toBeVisible();
    await expect(search).toBeFocused();
    await expect(dialog.locator("[data-form-icon-grid-option]")).toHaveCount(60);

    await search.fill("clock");
    await expect(dialog.locator("[data-form-icon-grid-option]")).toHaveCount(1);
    await dialog.getByRole("button", { name: "Choose Clock icon" }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('[data-form-icon-grid-value]')).toHaveValue("clock");
    await expect(page.locator("[data-form-icon-grid-current-label]")).toHaveText("Clock");
    await expect(trigger).toBeFocused();
  });

  test("icon grid uses tooltip labels so dense tiles stay compact", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    await page.locator("#form-campaign-icon-trigger").click();

    const clockOption = page.locator('[data-form-icon-grid-option="clock"]');
    await expect(clockOption).toHaveAttribute("data-tooltip", "Clock");

    await clockOption.hover();
    await expect(page.locator("#shared-floating-tooltip")).toHaveText("Clock");
  });

  test("icon grid opening closes other lightweight form overlays and escape returns focus to the trigger", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const dropdownTrigger = page.getByRole("button", { name: "Dropdown All active tenants" });
    await dropdownTrigger.click();
    await expect(page.locator("[data-form-select-listbox]")).toBeVisible();

    const iconTrigger = page.locator("#form-campaign-icon-trigger");
    await iconTrigger.click();

    await expect(page.locator("[data-form-select-listbox]")).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Choose campaign icon" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Choose campaign icon" })).toBeHidden();
    await expect(iconTrigger).toBeFocused();
  });
});
