import { getActiveRankingStep } from "../../ranking-state.js";
import { buildPostRankingEntries, buildUserRankingEntries } from "../../ui/ranking-data.js";

function createRankingEmptyMarkup() {
  return `
    <div class="ranking-empty">
      <div class="ranking-empty__text">Selecciona un tema para ver las estadisticas</div>
    </div>
  `;
}

export function selectRankingsViewModel(state) {
  const activeRankingStep = getActiveRankingStep(state);
  const showTopicEmpty = state.rankingScope === "topic" && !state.selectedTopicId;
  const showTopicSelected = state.rankingScope === "topic" && !!state.selectedTopicId;
  const showGlobalSelected = state.rankingScope === "global";
  const showExtendedRanking = showGlobalSelected || showTopicSelected;
  const isLoading = state.topics.allIds.length === 0 || state.users.allIds.length === 0;

  if (isLoading) {
    return {
      isLoading: true,
      showTopicEmpty: false,
      showTopicSelected,
      showExtendedRanking,
      entries: [],
      emptyMarkup: null,
      scope: state.rankingScope
    };
  }

  if (showTopicEmpty) {
    return {
      isLoading: false,
      showTopicEmpty: true,
      showTopicSelected: false,
      showExtendedRanking: false,
      entries: [],
      emptyMarkup: createRankingEmptyMarkup(),
      scope: state.rankingScope
    };
  }

  const entries =
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

  return {
    isLoading: false,
    showTopicEmpty: false,
    showTopicSelected,
    showExtendedRanking,
    entries,
    emptyMarkup: null,
    scope: state.rankingScope
  };
}
