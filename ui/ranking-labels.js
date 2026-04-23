import { getMetricIcon } from "./ranking-icons.js";

const RANKING_TITLES = {
  posts: {
    comments: "TEMA | COMENTARIOS",
    likes: "TEMA | LIKES"
  },
  users: {
    comments: "USUARIO | COMENTARIOS",
    likes: "USUARIO | LIKES"
  }
};

export function renderRankingLabel(label) {
  if (!label.includes(" | ")) {
    return label;
  }

  const [main, secondary] = label.split(" | ");
  return `
    <span class="ranking-label__main">${main}</span>
    <span class="ranking-label__icon" aria-hidden="true">${getMetricIcon(secondary === "LIKES" ? "likes" : "comments")}</span>
  `;
}

export function getCurrentRankingLabel(state) {
  if (state.rankingScope === "topic") {
    return state.rankingMetric === "likes" ? "LIKES" : "COMENTARIOS";
  }

  return RANKING_TITLES[state.rankingType]?.[state.rankingMetric] ?? "Ranking";
}
