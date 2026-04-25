import { createRankingItem, createRankingSkeleton } from "../components.js";
import { getActiveRankingStep } from "../ranking-state.js";
import { buildPostRankingEntries, buildUserRankingEntries } from "./ranking-data.js";
import { renderIntoTargets } from "./render-utils.js";
import { resetRankingScroll, showRankingEmpty, showRankingList, showRankingLoading } from "./ranking-panel-state.js";

export function renderRankings(state, dom) {
  const activeRankingStep = getActiveRankingStep(state);
  const showTopicEmpty = state.rankingScope === "topic" && !state.selectedTopicId;
  const showTopicSelected = state.rankingScope === "topic" && !!state.selectedTopicId;
  const isLoading = state.topics.length === 0 || state.users.length === 0;

  if (dom.rankingsBody) {
    dom.rankingsBody.classList.toggle("is-topic-selected", showTopicSelected);
  }
  if (dom.drawerRankingsBody) {
    dom.drawerRankingsBody.classList.toggle("is-topic-selected", showTopicSelected);
  }

  if (isLoading) {
    showRankingList(dom);
    renderIntoTargets([dom.rankingList, dom.drawerRankingList], "scroll-list ranking-list", () =>
      Array.from({ length: 3 }, (_, i) => createRankingSkeleton(i))
    );
    return;
  }

  if (showTopicEmpty) {
    showRankingEmpty(
      dom,
      `
    <div class="ranking-empty">
      <div class="ranking-empty__text">Selecciona un tema para ver las estadísticas</div>
    </div>
  `
    );
    renderIntoTargets([dom.rankingList, dom.drawerRankingList], "scroll-list ranking-list", () => []);
    return;
  }

  const rankings =
    state.rankingScope === "topic" || activeRankingStep.type === "users"
      ? buildUserRankingEntries(
          state.topics,
          state.users,
          state.currentUserId,
          activeRankingStep.metric,
          state.selectedTopicId,
          state.rankingScope
        )
      : buildPostRankingEntries(
          state.topics,
          state.users,
          state.currentUserId,
          activeRankingStep.metric,
          state.selectedTopicId,
          state.rankingScope
        );

  showRankingList(dom);

  renderIntoTargets([dom.rankingList, dom.drawerRankingList], "scroll-list ranking-list", () =>
    rankings.map((entry, index) => createRankingItem(entry, index, state.rankingScope))
  );
  resetRankingScroll(dom);
}
