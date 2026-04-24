import { createMessage, createTopic, getSelectedTopic, trimMessages } from "./model.js";

export function createChatActions({ state, dom, render }) {
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
      const titleInput = dom.topicTitleInput;
      const title = titleInput?.value.trim() ?? "";
      if (!title) {
        titleInput?.focus();
        return;
      }

      const createdTopic = createTopic(state.currentUserId, title, text);
      state.topics = [createdTopic, ...state.topics];
      state.selectedTopicId = createdTopic.id;
      if (titleInput) {
        titleInput.value = "";
      }
      input.value = "";
      render();
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

    render();
  }

  function createNewTopic() {
    state.selectedTopicId = null;
    if (dom.topicTitleInput) {
      dom.topicTitleInput.value = "";
    }
    if (dom.messageInput) {
      dom.messageInput.value = "";
    }
    render();

    if (dom.topicTitleInput) {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => dom.topicTitleInput?.focus());
      } else {
        dom.topicTitleInput.focus();
      }
    }
  }

  return {
    createNewTopic,
    submitMessage,
    refreshCurrentTopic
  };
}
