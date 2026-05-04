import { createProfileAvatar, el } from "../../shared/components/base.js";

export function createMessageItem(message) {
  const node = el("article", `message${message.kind === "system" ? " message--system" : ""}`);
  node.dataset.id = message.id;
  const avatar = createProfileAvatar("message__avatar");
  const body = el("div", "message__body");

  const meta = el("div", "message__meta");
  meta.append(
    el("span", "message__author", message.author),
    el("span", "message__time", message.timeText)
  );

  body.append(meta, el("p", "message__text", message.text));
  node.append(avatar, body);
  return node;
}
