import { createMessageItem } from "../components.js";
import { getSelectedTopic } from "../model.js";

export function renderChat(state, dom) {
  const topic = getSelectedTopic(state.topics, state.selectedTopicId);
  const isMobileViewport = document.documentElement.classList.contains("is-mobile-viewport");
  const isLoading = state.topics.length === 0;

  syncChatComposer(topic, dom, isLoading);

  if (!dom.messageStream) {
    return;
  }

  const chatHero = dom.chatTopicName?.closest(".chat-hero");
  if (chatHero) {
    chatHero.hidden = isLoading || !topic || !isMobileViewport;
  }

  dom.messageStream.hidden = isLoading || !topic;
  dom.messageStream.innerHTML = "";
  if (!topic) {
    return;
  }

  topic.messages.forEach((message) => {
    dom.messageStream.appendChild(createMessageItem(message, state.users));
  });
  dom.messageStream.scrollTop = dom.messageStream.scrollHeight;
}

function syncChatComposer(topic, dom, isLoading) {
  const isCreatingTopic = !topic;
  const topicTitleField = dom.topicTitleInput?.closest(".composer__field");
  const chatHeader = dom.chatTitle?.closest(".panel__header--chat");

  if (topicTitleField) {
    topicTitleField.hidden = isLoading || !isCreatingTopic;
  }
  if (chatHeader) {
    chatHeader.hidden = isLoading || isCreatingTopic;
  }
  if (dom.messageForm) {
    dom.messageForm.hidden = isLoading;
    dom.messageForm.classList.toggle("composer--topic-create", isCreatingTopic);
  }
  if (dom.messageInput) {
    dom.messageInput.placeholder = isCreatingTopic ? "Mensaje" : "Escribe aquí...";
    dom.messageInput.rows = isCreatingTopic ? 4 : 2;
  }
}
