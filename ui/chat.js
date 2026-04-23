import { createMessageItem } from "../components.js";
import { getSelectedTopic } from "../model.js";

export function renderChat(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);
  if (!dom.messageStream || !topic) {
    return;
  }

  dom.messageStream.innerHTML = "";
  topic.messages.forEach((message) => {
    dom.messageStream.appendChild(createMessageItem(message, state.users));
  });
  dom.messageStream.scrollTop = dom.messageStream.scrollHeight;
}
