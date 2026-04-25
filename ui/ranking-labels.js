import { getActiveRankingStep } from "../ranking-state.js";
import { getMetricIcon } from "./ranking-icons.js";

const RANKING_TITLES = {
  posts: {
    comments: "Comentarios",
    likes: "Likes"
  },
  users: {
    comments: "Comentarios",
    likes: "Likes"
  }
};

export function renderRankingLabel(label) {
  const upperLabel = label.toUpperCase();
  if (upperLabel === "COMENTARIOS" || upperLabel === "TEMAS COMENTARIOS" || upperLabel === "USUARIOS COMENTARIOS") {
    return `
      <span class="ranking-label__main">${label}</span>
      <span class="ranking-label__icon" aria-hidden="true">${getMetricIcon("comments")}</span>
    `;
  }
  if (upperLabel === "LIKES" || upperLabel === "TEMAS LIKES" || upperLabel === "USUARIOS LIKES") {
    return `
      <span class="ranking-label__main">${label}</span>
      <span class="ranking-label__icon" aria-hidden="true">${getMetricIcon("likes")}</span>
    `;
  }
  if (!label.includes(" | ")) {
    return label;
  }

  const [main, secondary] = label.split(" | ");
  return `
    <span class="ranking-label__main">${main}</span>
    <span class="ranking-label__icon" aria-hidden="true">${getMetricIcon(secondary.toUpperCase() === "LIKES" ? "likes" : "comments")}</span>
  `;
}

export function getCurrentRankingLabel(state) {
  const { type, metric } = getActiveRankingStep(state);

  if (state.rankingScope === "topic") {
    return metric === "likes" ? "Likes" : "Comentarios";
  }

  if (type === "posts") {
    return metric === "likes" ? "TEMAS LIKES" : "TEMAS COMENTARIOS";
  } else {
    return metric === "likes" ? "USUARIOS LIKES" : "USUARIOS COMENTARIOS";
  }
}
