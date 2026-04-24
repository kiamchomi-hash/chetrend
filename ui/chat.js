import { createMessageItem } from "../components.js";
import { getSelectedTopic } from "../model.js";

export function renderChat(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);
  const isMobileViewport = document.documentElement.classList.contains("is-mobile-viewport");
  syncChatComposer(topic, dom);

  if (!dom.messageStream) {
    return;
  }

  const chatHero = dom.chatTopicName?.closest(".chat-hero");
  if (chatHero) {
    chatHero.hidden = !topic || !isMobileViewport;
  }

  dom.messageStream.hidden = !topic;
  dom.messageStream.innerHTML = "";
  if (!topic) {
    return;
  }

  topic.messages.forEach((message) => {
    dom.messageStream.appendChild(createMessageItem(message, state.users));
  });
  dom.messageStream.scrollTop = dom.messageStream.scrollHeight;
}

function syncChatComposer(topic, dom) {
  const isCreatingTopic = !topic;
  const topicTitleField = dom.topicTitleInput?.closest(".composer__field");
  const chatHeader = dom.chatTitle?.closest(".panel__header--chat");

  if (topicTitleField) {
    topicTitleField.hidden = !isCreatingTopic;
  }
  if (chatHeader) {
    chatHeader.hidden = isCreatingTopic;
  }
  if (dom.messageForm) {
    dom.messageForm.classList.toggle("composer--topic-create", isCreatingTopic);
  }
  if (dom.messageInput) {
    dom.messageInput.placeholder = isCreatingTopic ? "Mensaje" : "Escribe aquí...";
    dom.messageInput.rows = isCreatingTopic ? 4 : 2;
  }
}
