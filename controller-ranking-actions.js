import { getActiveRankingIndex, getStoredRankingIndex, setStoredRankingIndex } from "./ranking-state.js";

export function createRankingActions({ state, isMobileViewport, syncResponsiveView, render }) {
  function setRankingScope(scope) {
    if (scope !== "global" && scope !== "topic") {
      return;
    }
    if (state.rankingScope === scope) {
      return;
    }

    state.rankingScope = scope;
    setStoredRankingIndex(state, getStoredRankingIndex(state));
    render();
  }

  function toggleRankingScope() {
    setRankingScope(state.rankingScope === "global" ? "topic" : "global");
  }

  function focusTopic(topicId) {
    state.selectedTopicId = topicId;
    if (isMobileViewport()) {
      state.mobileView = "chat";
      syncResponsiveView();
    }
    render();
  }

  function applyRankingStep(index) {
    setStoredRankingIndex(state, index);
    render();
  }

  function setRankingStep(delta) {
    applyRankingStep(getActiveRankingIndex(state) + delta);
  }

  return {
    setRankingScope,
    toggleRankingScope,
    focusTopic,
    setRankingStep,
    selectRankingStep: applyRankingStep
  };
}
