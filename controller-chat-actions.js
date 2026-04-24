import { createMessage, getSelectedTopic, trimMessages } from "./model.js";

export function createChatActions({ state, dom, nowLabel, render }) {
  function submitMessage(event) {
    event.preventDefault();
    const input = dom.messageInput;
    if (!input) {
      return;
    }

    const text = input.value.trim();
    if (!text) {
      return;
    }

    const topic = getSelectedTopic(state.topics, state.selectedTopicId);
    if (!topic) {
      return;
    }

    topic.messages.push(createMessage(state.currentUserId, text, 0));
    topic.messages = trimMessages(topic.messages);
    input.value = "";
    render();
  }

  function refreshCurrentTopic() {
    const topic = getSelectedTopic(state.topics, state.selectedTopicId);
    if (!topic) {
      return;
    }

    state.refreshCount += 1;
    const last = topic.messages[topic.messages.length - 1];
    if (!last || last.kind !== "system" || state.refreshCount % 3 === 0) {
      topic.messages.push(
        createMessage(
          "u2",
          `Actualización manual ${state.refreshCount}: la sala sigue estable y sin sincronización en tiempo real.`,
          0,
          "system"
        )
      );
      topic.messages = trimMessages(topic.messages);
    }

    if (dom.refreshState) {
      dom.refreshState.textContent = `Actualizado ${nowLabel()}`;
    }
    render();
  }

  return {
    submitMessage,
    refreshCurrentTopic
  };
}
