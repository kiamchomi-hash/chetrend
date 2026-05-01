function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function getUserName(users, userId, fallback = "Anonimo") {
  return users.find((user) => user.id === userId)?.name ?? fallback;
}

function createProfileAvatar(className = "topic-item__avatar") {
  const avatar = el("span", className);
  avatar.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "4");
  rect.setAttribute("y", "4");
  rect.setAttribute("width", "40");
  rect.setAttribute("height", "40");
  rect.setAttribute("rx", "10");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "24");
  circle.setAttribute("cy", "18");
  circle.setAttribute("r", "7");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M11.5 38c2.6-6.2 7.7-9.3 12.5-9.3S33.9 31.8 36.5 38");

  svg.append(rect, circle, path);
  avatar.appendChild(svg);
  return avatar;
}

export function createTopicItem(topic, users, selected = false) {
  const button = el("button", `topic-item${selected ? " is-active" : ""}`);
  button.type = "button";

  const topicCommentCount = topic.messages.filter((message) => message.kind === "user").length;
  const lastCommentAuthor = [...topic.messages].reverse().find((message) => message.kind === "user");
  const lastCommenterName = lastCommentAuthor
    ? getUserName(users, lastCommentAuthor.authorId)
    : "Sin actividad";

  const avatar = createProfileAvatar();
  const content = el("span", "topic-item__content");
  content.append(
    el("span", "topic-item__title", topic.title),
    el("span", "topic-item__meta", `${topicCommentCount}, ${lastCommenterName}`)
  );

  button.append(avatar, content);
  return button;
}

export function createTopicSkeleton() {
  const button = el("button", "topic-item topic-item--skeleton");
  button.type = "button";
  button.disabled = true;

  const avatar = createProfileAvatar();
  const content = el("span", "topic-item__content");
  content.append(
    el("span", "topic-item__title"),
    el("span", "topic-item__meta")
  );

  button.append(avatar, content);
  return button;
}

export function createUserSkeleton() {
  const node = el("article", "user-item user-item--skeleton");
  const info = el("div", "user-item__info");
  info.append(el("div", "user-item__skeleton-line"));

  const actions = el("div", "user-item__actions");
  actions.append(
    el("div", "user-item__skeleton-circle"),
    el("div", "user-item__skeleton-circle")
  );

  node.append(info, actions);
  return node;
}

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

export function createMessageItem(message, users) {
  const node = el("article", `message${message.kind === "system" ? " message--system" : ""}`);
  const author = message.kind === "system" ? "Sistema" : getUserName(users, message.authorId);
  const avatar = createProfileAvatar("message__avatar");
  const body = el("div", "message__body");

  const meta = el("div", "message__meta");
  meta.append(
    el("span", "message__author", author),
    el("span", "message__time", message.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }))
  );

  body.append(meta, el("p", "message__text", message.text));
  node.append(avatar, body);
  return node;
}

export function createUserItem(user, currentUserId, activeConnectedUserId = null) {
  const isCurrentUser = user.id === currentUserId;
  const isActive = user.id === activeConnectedUserId;
  const node = el("article", `user-item${isCurrentUser ? " is-current" : ""}${isActive ? " is-active" : ""}`);
  node.tabIndex = 0;
  node.setAttribute("role", "button");
  node.setAttribute("aria-pressed", String(isActive));
  node.setAttribute("aria-label", `${user.name}${isCurrentUser ? ", usuario actual" : ""}`);
  node.dataset.connectedUserId = user.id;

  const info = el("div", "user-item__info");
  info.append(el("p", "user-item__name", user.name));

  const actions = el("div", "user-item__actions");
  actions.append(
    createUserActionButton("Ver perfil", "profile"),
    createUserActionButton("Mensaje directo", "message")
  );

  node.append(info, actions);
  return node;
}

function createUserActionButton(label, kind) {
  const button = el("button", "user-item__action");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.dataset.userAction = kind;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  if (kind === "profile") {
    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("cx", "12");
    head.setAttribute("cy", "8.5");
    head.setAttribute("r", "3.2");

    const shoulders = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shoulders.setAttribute("d", "M5.5 19c1.4-3.6 4-5.4 6.5-5.4s5.1 1.8 6.5 5.4");

    svg.append(head, shoulders);
  } else {
    const bubble = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bubble.setAttribute("d", "M5 6.5h14v8H9.2L6 17.5V14.5H5z");

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "path");
    dot.setAttribute("d", "M9 10h6");

    svg.append(bubble, dot);
  }

  button.appendChild(svg);
  return button;
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
