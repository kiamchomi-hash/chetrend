import { createTopicItem, createTopicSkeleton } from "../components.js";
import { renderIntoTargets } from "./render-utils.js";

export function renderTopics(state, dom, onFocusTopic) {
  const topics = state.topics.slice(0, 20);
  const isLoading = topics.length === 0;

  renderIntoTargets([dom.topicList, dom.leftDrawerTopics], "scroll-list topic-list", () => {
    if (isLoading) {
      return Array.from({ length: 20 }, (_, i) => createTopicSkeleton(i));
    }

    return topics.map((topic) => {
      const button = createTopicItem(topic, state.users, topic.id === state.selectedTopicId);
      button.addEventListener("click", () => onFocusTopic(topic.id));
      return button;
    });
  });
}
