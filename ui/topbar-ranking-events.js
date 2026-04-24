export function bindTopbarRankingEvents(dom, handlers) {
  dom.rankingScopeButton?.addEventListener("click", handlers.toggleRankingScope);
  dom.drawerRankingScopeButton?.addEventListener("click", handlers.toggleRankingScope);
  dom.rankingPrev.addEventListener("click", () => handlers.setRankingStep(-1));
  dom.rankingCurrent.addEventListener("click", () => handlers.setRankingStep(1));
  dom.rankingNext.addEventListener("click", () => handlers.setRankingStep(1));
  dom.drawerRankingPrev.addEventListener("click", () => handlers.setRankingStep(-1));
  dom.drawerRankingCurrent.addEventListener("click", () => handlers.setRankingStep(1));
  dom.drawerRankingNext.addEventListener("click", () => handlers.setRankingStep(1));
}
