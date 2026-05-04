import { el } from "../../shared/components/base.js";

export function createRankingSkeleton(index) {
  const node = el("article", `ranking-item ranking-item--skeleton ranking-item--rank-${index + 1}`);
  const badge = el("span", "ranking-item__badge");
  badge.setAttribute("aria-hidden", "true");

  const content = el("div", "ranking-item__content");
  content.append(
    el("div", "ranking-item__skeleton-line"),
    el("div", "ranking-item__skeleton-line ranking-item__skeleton-line--short")
  );

  node.append(badge, content);
  return node;
}

export function createRankingItem(entry, index, scope = "global") {
  const node = el(
    "article",
    `ranking-item ranking-item--rank-${index + 1}${scope === "global" ? " ranking-item--global" : ""}${entry.active ? " is-active" : ""}`
  );
  const badge = el("span", "ranking-item__badge", String(index + 1));
  badge.setAttribute("aria-hidden", "true");
  if (scope === "topic") {
    badge.classList.add("ranking-item__badge--topic");
  }

  const content = el("div", "ranking-item__content");
  content.append(
    el("p", "ranking-item__title", entry.title),
    el("p", "ranking-item__meta", entry.meta)
  );

  node.append(badge, content);
  return node;
}
