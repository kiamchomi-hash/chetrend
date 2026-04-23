import { getSelectedTopic } from "../model.js";
import { getCurrentRankingLabel, renderRankingLabel } from "./ranking-labels.js";
import { getRankingGlyph, getScopeIcon } from "./ranking-icons.js";

export function renderTitles(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);

  if (dom.chatTopicName) {
    dom.chatTopicName.textContent = topic ? topic.title : "Tema";
  }
  if (dom.chatTopicDescription) {
    dom.chatTopicDescription.textContent = topic
      ? topic.subtitle
      : "Selecciona un tema para empezar a chatear.";
  }

  if (dom.rankingsTitle) {
    dom.rankingsTitle.textContent = "Ranking";
  }
  if (dom.drawerRankingsTitle) {
    dom.drawerRankingsTitle.textContent = "Ranking";
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
