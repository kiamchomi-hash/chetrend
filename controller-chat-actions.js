import { createMessage, createTopic, getSelectedTopic, trimMessages } from "./model.js";

export function createChatActions({ state, dom, render, refreshFeedbackMs = 750 }) {
  let refreshFeedbackTimer = 0;

  function setRefreshButtonState(isRefreshing) {
    if (!dom.refreshButton) {
      return;
    }

    dom.refreshButton.classList.toggle("is-refreshing", isRefreshing);
    dom.refreshButton.setAttribute("aria-busy", String(isRefreshing));
  }

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
    if (refreshFeedbackTimer) {
      clearTimeout(refreshFeedbackTimer);
    }

    setRefreshButtonState(true);
    refreshFeedbackTimer = setTimeout(() => {
      setRefreshButtonState(false);
      refreshFeedbackTimer = 0;
    }, refreshFeedbackMs);
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
