import { getSelectedTopic } from "../model.js";

export function renderTitles(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);
  if (dom.chatTopicName && topic) {
    dom.chatTopicName.textContent = topic.title;
  }
  if (dom.chatTopicDescription && topic) {
    dom.chatTopicDescription.textContent = topic.subtitle;
  }

  const rankingLabel = state.rankingMode === "global" ? "Ranking global" : `Ranking ${topic?.title ?? "tema"}`;
  if (dom.rankingsTitle) {
    dom.rankingsTitle.textContent = rankingLabel;
  }
  if (dom.drawerRankingsTitle) {
    dom.drawerRankingsTitle.textContent = rankingLabel;
  }
}
