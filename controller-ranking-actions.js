const GLOBAL_RANKING_STEPS = [
  { type: "posts", metric: "comments" },
  { type: "posts", metric: "likes" },
  { type: "users", metric: "comments" },
  { type: "users", metric: "likes" }
];

const TOPIC_RANKING_STEPS = [
  { type: "users", metric: "comments" },
  { type: "users", metric: "likes" }
];

export function createRankingActions({ state, isMobileViewport, syncResponsiveView, render }) {
  function toggleRankingScope() {
    if (state.rankingScope === "global") {
      state.globalRankingIndex = state.rankingIndex;
      state.rankingScope = "topic";
      state.rankingIndex = state.topicRankingIndex;
    } else {
      state.topicRankingIndex = state.rankingIndex;
      state.rankingScope = "global";
      state.rankingIndex = state.globalRankingIndex;
    }

    const steps = state.rankingScope === "topic" ? TOPIC_RANKING_STEPS : GLOBAL_RANKING_STEPS;
    const step = steps[(state.rankingIndex + steps.length) % steps.length];
    state.rankingIndex = (state.rankingIndex + steps.length) % steps.length;
    state.rankingType = step.type;
    state.rankingMetric = step.metric;
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
    const steps = state.rankingScope === "topic" ? TOPIC_RANKING_STEPS : GLOBAL_RANKING_STEPS;
    const normalizedIndex = (index + steps.length) % steps.length;
    const step = steps[normalizedIndex];
    state.rankingIndex = normalizedIndex;
    state.rankingType = step.type;
    state.rankingMetric = step.metric;
    if (state.rankingScope === "global") {
      state.globalRankingIndex = state.rankingIndex;
    } else {
      state.topicRankingIndex = state.rankingIndex;
    }
    render();
  }

  function setRankingStep(delta) {
    applyRankingStep(state.rankingIndex + delta);
  }

  return {
    toggleRankingScope,
    focusTopic,
    setRankingStep
  };
}
