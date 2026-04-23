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

function getUserName(users, userId, fallback = "Anónimo") {
  return users.find((user) => user.id === userId)?.name ?? fallback;
}

function getUserRole(users, userId, fallback = "Invitado") {
  return users.find((user) => user.id === userId)?.role ?? fallback;
}

export function createTopicItem(topic, users, selected = false) {
  const button = el("button", `topic-item${selected ? " is-active" : ""}`);
  button.type = "button";

  const topicCommentCount = topic.messages.filter((message) => message.kind === "user").length;
  const lastCommentAuthor = [...topic.messages].reverse().find((message) => message.kind === "user");
  const lastCommenterName = lastCommentAuthor
    ? getUserName(users, lastCommentAuthor.authorId)
    : "Sin actividad";

  const avatar = el("span", "topic-item__avatar");
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

  const content = el("span", "topic-item__content");
  content.append(
    el("span", "topic-item__title", topic.title),
    el("span", "topic-item__meta", `${topicCommentCount} comentarios, ${lastCommenterName}`)
  );

  button.append(avatar, content);
  return button;
}

export function createMessageItem(message, users) {
  const node = el("article", `message${message.kind === "system" ? " message--system" : ""}`);
  const author = message.kind === "system" ? "Sistema" : getUserName(users, message.authorId);
  const role = message.kind === "system" ? "Aviso" : getUserRole(users, message.authorId);

  const meta = el("div", "message__meta");
  meta.append(
    el("span", "message__author", author),
    el("span", null, role),
    el("span", null, message.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }))
  );

  node.append(meta, el("p", "message__text", message.text));
  return node;
}

export function createUserItem(user, currentUserId) {
  const node = el("article", `user-item${user.id === currentUserId ? " is-current" : ""}`);
  node.append(
    el("p", "user-item__name", user.name),
    el("div", "user-item__meta", `${user.role} · ${user.online ? "Conectado" : "Offline"} · ${user.score} pts`)
  );
  return node;
}

export function createRankingItem(entry, index) {
  const node = el("article", `ranking-item${entry.active ? " is-active" : ""}`);
  const badge = el("span", "ranking-item__badge", String(index + 1));
  badge.setAttribute("aria-hidden", "true");

  const content = el("div", "ranking-item__content");
  content.append(
    el("p", "ranking-item__title", entry.title),
    el("div", "ranking-item__meta", entry.meta)
  );

  node.append(badge, content);
  return node;
}
