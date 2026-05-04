import { createMessageItem } from "../components.js";
import { getSelectedTopic } from "../model.js";
import { renderIntoTargets } from "./render-utils.js";

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
  if (!topic) {
    if (dom.messageStream) {
      dom.messageStream.innerHTML = "";
    }
    return;
  }

  renderIntoTargets([dom.messageStream], "message-stream", () => {
    return topic.messages.map((message) => createMessageItem(message, state.users));
  });

  syncMessageCardHeights(dom.messageStream);
  dom.messageStream.scrollTop = dom.messageStream.scrollHeight;
}

function syncMessageCardHeights(messageStream) {
  const messageCards = messageStream.querySelectorAll(".message");

  messageCards.forEach((card) => {
    const body = card.querySelector(".message__body");
    if (!body) {
      return;
    }

    card.style.height = "auto";
    card.style.minHeight = `${Math.max(84, body.scrollHeight)}px`;
  });
}

function syncChatComposer(topic, dom, isLoading) {
  const isCreatingTopic = !topic;
  const topicTitleField = dom.topicTitleInput?.closest(".composer__field");
  const chatHeader = dom.chatTitle?.closest(".panel__header--chat");
  const chatPanel = dom.messageForm?.closest(".panel--chat");

  if (topicTitleField) {
    topicTitleField.hidden = isLoading || !isCreatingTopic;
  }
  if (chatHeader) {
    chatHeader.hidden = isLoading || isCreatingTopic;
  }
  if (chatPanel) {
    chatPanel.classList.toggle("panel--topic-create", !isLoading && isCreatingTopic);
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
