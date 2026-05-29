(function () {
  function activateTab(tabList, nextTab) {
    const tabs = Array.from(tabList.querySelectorAll("[data-showcase-tab]"));

    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const selected = tab === nextTab;

      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", selected ? "0" : "-1");

      if (panel) {
        panel.hidden = !selected;
      }
    }
  }

  function moveFocus(tabList, currentTab, direction) {
    const tabs = Array.from(tabList.querySelectorAll("[data-showcase-tab]"));
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    nextTab.focus();
    activateTab(tabList, nextTab);
  }

  for (const showcase of document.querySelectorAll("[data-public-site-showcase]")) {
    const tabList = showcase.querySelector("[role='tablist']");

    if (!tabList) {
      continue;
    }

    const tabs = Array.from(tabList.querySelectorAll("[data-showcase-tab]"));

    for (const [index, tab] of tabs.entries()) {
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");

      tab.addEventListener("click", () => {
        activateTab(tabList, tab);
      });

      tab.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          moveFocus(tabList, tab, 1);
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          moveFocus(tabList, tab, -1);
        }

        if (event.key === "Home") {
          event.preventDefault();
          tabs[0].focus();
          activateTab(tabList, tabs[0]);
        }

        if (event.key === "End") {
          event.preventDefault();
          const finalTab = tabs[tabs.length - 1];
          finalTab.focus();
          activateTab(tabList, finalTab);
        }
      });
    }
  }
})();
