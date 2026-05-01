export function bindTopbarRankingEvents(dom, handlers) {
  dom.rankingScopeButton.addEventListener("click", handlers.toggleRankingScope);
  dom.drawerRankingScopeButton.addEventListener("click", handlers.toggleRankingScope);
  dom.rankingPrev.addEventListener("click", () => handlers.setRankingStep(-1));
  dom.rankingCurrent.addEventListener("click", () => handlers.setRankingStep(1));
  dom.rankingNext.addEventListener("click", () => handlers.setRankingStep(1));
  dom.drawerRankingPrev.addEventListener("click", () => handlers.setRankingStep(-1));
  dom.drawerRankingCurrent.addEventListener("click", () => handlers.setRankingStep(1));
  dom.drawerRankingNext.addEventListener("click", () => handlers.setRankingStep(1));

  bindScopeTabs(dom.rankingScopeTabs, handlers.setRankingScope);
  bindScopeTabs(dom.drawerRankingScopeTabs, handlers.setRankingScope);
  bindModeList(dom.rankingModeList, handlers.selectRankingStep);
  bindModeList(dom.drawerRankingModeList, handlers.selectRankingStep);
}

function bindScopeTabs(container, onSelect) {
  if (!container) {
    return;
  }

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ranking-scope]");
    if (!button || !container.contains(button)) {
      return;
    }

    onSelect(button.dataset.rankingScope);
  });
}

function bindModeList(container, onSelect) {
  if (!container) {
    return;
  }

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ranking-index]");
    if (!button || !container.contains(button)) {
      return;
    }

    onSelect(Number(button.dataset.rankingIndex));
  });
}
