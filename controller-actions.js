import { createChatActions } from "./controller-chat-actions.js";
import { createRankingActions } from "./controller-ranking-actions.js";

export function createActionHandlers({
  state,
  dom,
  renderRef,
  syncResponsiveView,
  isMobileViewport,
  closeDrawers
}) {
  function render() {
    renderRef.current();
  }

  function flashTitle(text) {
    void text;
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("chetrend-theme", state.theme);
    render();
  }

  const rankingActions = createRankingActions({
    state,
    isMobileViewport,
    syncResponsiveView,
    render
  });

  const chatActions = createChatActions({
    state,
    dom,
    render
  });

  return {
    flashTitle,
    toggleTheme,
    toggleRankingScope: rankingActions.toggleRankingScope,
    focusTopic: rankingActions.focusTopic,
    setRankingStep: rankingActions.setRankingStep,
    createNewTopic: chatActions.createNewTopic,
    submitMessage: chatActions.submitMessage,
    refreshCurrentTopic: chatActions.refreshCurrentTopic,
    closeDrawers
  };
}
