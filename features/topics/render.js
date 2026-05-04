import { createTopicItem, createTopicSkeleton } from "./components/topic-item.js";
import { renderIntoTargets } from "../../ui/render-utils.js";
import { selectTopicsViewModel } from "./selectors.js";

export function renderTopicsPanel(state, dom, onFocusTopic) {
  const viewModel = selectTopicsViewModel(state);

  renderIntoTargets([dom.topicList, dom.leftDrawerTopics], "scroll-list topic-list", () => {
    if (viewModel.isLoading) {
      return Array.from({ length: 20 }, () => createTopicSkeleton());
    }

    return viewModel.items.map((topic) => {
      const button = createTopicItem(topic);
      // We re-bind the listener, but Smart Rendering preserves the node if ID matches
      button.onclick = () => onFocusTopic(topic.id);
      return button;
    });
  });
}
