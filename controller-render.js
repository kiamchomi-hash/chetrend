import { closeDrawers } from "./ui/drawers.js";
import { renderChat } from "./ui/chat.js";
import { renderRankings } from "./ui/rankings.js";
import { renderTitles } from "./ui/titles.js";
import { renderTopics } from "./ui/topics.js";
import { renderUsers } from "./ui/users.js";

export function createRenderers({ state, dom, actions, responsive, closeTimerRef, getTransitionDurationMs }) {
  function render() {
    responsive.syncResponsiveView();
    renderTopics(state, dom, (topicId) => {
      actions.focusTopic(topicId);
      closeDrawers(dom, responsive.isMobileViewport, getTransitionDurationMs, closeTimerRef);
    });
    renderChat(state, dom);
    renderUsers(state, dom);
    renderRankings(state, dom);
    renderTitles(state, dom);
    responsive.updateLayoutMetrics();
  }

  return { render };
}
