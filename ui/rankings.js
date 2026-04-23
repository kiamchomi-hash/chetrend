import { createRankingItem } from "../components.js";
import { buildGlobalRankingEntries, buildTopicRankingEntries, getSelectedTopic } from "../model.js";
import { renderIntoTargets } from "./render-utils.js";

export function renderRankings(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId) ?? { messages: [] };
  const rankings =
    state.rankingMode === "global"
      ? buildGlobalRankingEntries(state.topics, state.users, state.currentUserId)
      : buildTopicRankingEntries(topic, state.users, state.currentUserId);

  renderIntoTargets([dom.rankingList, dom.drawerRankingList], "scroll-list ranking-list", () =>
    rankings.map((entry, index) => createRankingItem(entry, index))
  );
}
