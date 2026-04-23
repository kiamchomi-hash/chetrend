import { createTopicItem } from "../components.js";
import { renderIntoTargets } from "./render-utils.js";

export function renderTopics(state, dom, onFocusTopic) {
  const topics = state.topics.slice(0, 20);

  renderIntoTargets([dom.topicList, dom.leftDrawerTopics], "scroll-list topic-list", () =>
    topics.map((topic) => {
      const button = createTopicItem(topic, state.users, topic.id === state.selectedTopicId);
      button.addEventListener("click", () => onFocusTopic(topic.id));
      return button;
    })
  );
}
