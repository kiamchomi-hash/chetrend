import { getSelectedTopic } from "../model.js";
import { getCurrentRankingLabel, renderRankingLabel } from "./ranking-labels.js";
import { getRankingGlyph, getScopeIcon } from "./ranking-icons.js";

export function renderTitles(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);
  const chatTitleWrapper = dom.chatTitle?.parentElement ?? null;

  if (dom.chatTitle) {
    dom.chatTitle.textContent = topic ? topic.title : "";
  }
  if (chatTitleWrapper) {
    chatTitleWrapper.hidden = !topic;
  }

  if (dom.chatTopicName) {
    dom.chatTopicName.textContent = topic ? topic.title : "Crear un tema";
  }
  if (dom.chatTopicDescription) {
    dom.chatTopicDescription.textContent = topic
      ? topic.subtitle
      : "Escribe un título y el primer mensaje para abrir un tema nuevo.";
  }

  if (dom.rankingsTitle) {
    dom.rankingsTitle.innerHTML = state.rankingScope === "global" ? "Ranking<br>Histórico" : "Ranking<br>Por Tema";
  }
  if (dom.drawerRankingsTitle) {
    dom.drawerRankingsTitle.innerHTML = state.rankingScope === "global" ? "Ranking<br>Histórico" : "Ranking<br>Por Tema";
  }
  const currentLabel = getCurrentRankingLabel(state);
  const currentAriaLabel = `Modo actual: ${currentLabel}`;
  [
    dom.rankingCurrent,
    dom.drawerRankingCurrent
  ].forEach((button) => {
    if (!button) {
      return;
    }
    const label = button.querySelector(".button-label");
    if (label) {
      label.innerHTML = renderRankingLabel(currentLabel);
    }
    button.setAttribute("aria-label", currentAriaLabel);
  });

  const glyph = getRankingGlyph(state);
  if (dom.rankingsGlyph) {
    dom.rankingsGlyph.innerHTML = glyph;
  }
  if (dom.drawerRankingsGlyph) {
    dom.drawerRankingsGlyph.innerHTML = glyph;
  }

  const scopeIcon = getScopeIcon(state.rankingScope);
  if (dom.rankingScopeButton) {
    dom.rankingScopeButton.setAttribute(
      "aria-label",
      state.rankingScope === "global" ? "Cambiar a ranking por tema" : "Cambiar a ranking global"
    );
  }
  if (dom.rankingScopeIcon) {
    dom.rankingScopeIcon.innerHTML = scopeIcon;
  }
  if (dom.drawerRankingScopeButton) {
    dom.drawerRankingScopeButton.setAttribute(
      "aria-label",
      state.rankingScope === "global" ? "Cambiar a ranking por tema" : "Cambiar a ranking global"
    );
  }
  if (dom.drawerRankingScopeIcon) {
    dom.drawerRankingScopeIcon.innerHTML = scopeIcon;
  }
}
