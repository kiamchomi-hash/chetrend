import { getActiveRankingIndex, getStoredRankingIndex, setStoredRankingIndex } from "./ranking-state.js";

export function createRankingActions({ state, isMobileViewport, syncResponsiveView, render }) {
  function toggleRankingScope() {
    state.rankingScope = state.rankingScope === "global" ? "topic" : "global";
    setStoredRankingIndex(state, getStoredRankingIndex(state));
    render();
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
    toggleRankingScope,
    focusTopic,
    setRankingStep
  };
}
