import { initialUsers, topicSeedData } from "./data.js";
import { buildTopics, buildUsers } from "./model.js";
import { openDrawer, closeDrawers } from "./ui/drawers.js";
import { bindPageEvents } from "./ui/events.js";
import { cacheDom } from "./ui/dom.js";
import { createActionHandlers } from "./controller-actions.js";
import { createResponsiveHelpers } from "./controller-responsive.js";
import { createRenderers } from "./controller-render.js";
import { closeTimerRef, dom, state } from "./app-store.js";
import { applyStoredTheme, createBackToTopicsHandler, createResizeHandler } from "./controller-runtime.js";
import { getTransitionDurationMs } from "./ui/transition-utils.js";

export function bootstrap() {
  state.users = buildUsers(initialUsers);
  state.topics = buildTopics(topicSeedData, state.users);
  applyStoredTheme(state);

  Object.assign(dom, cacheDom());

  const responsive = createResponsiveHelpers({ state, dom });
  const renderRef = { current: () => {} };
  const actions = createActionHandlers({
    state,
    dom,
    renderRef,
    syncResponsiveView: responsive.syncResponsiveView,
    isMobileViewport: responsive.isMobileViewport,
    closeDrawers: () => closeDrawers(dom, responsive.isMobileViewport, getTransitionDurationMs, closeTimerRef)
  });
  const renderers = createRenderers({
    state,
    dom,
    actions,
    responsive,
    closeTimerRef,
    getTransitionDurationMs
  });

  renderRef.current = renderers.render;

  const backToTopics = createBackToTopicsHandler(state, responsive, renderers.render);
  const handleResize = createResizeHandler({
    responsive,
    render: renderers.render,
    actions
  });

  bindPageEvents(dom, {
    toggleTheme: actions.toggleTheme,
    toggleRankingScope: actions.toggleRankingScope,
    refreshCurrentTopic: actions.refreshCurrentTopic,
    createNewTopic: actions.createNewTopic,
    submitMessage: actions.submitMessage,
    setRankingStep: actions.setRankingStep,
    openDrawer: (side) => openDrawer(side, dom, closeTimerRef),
    closeDrawers: actions.closeDrawers,
    flashTitle: actions.flashTitle,
    backToTopics,
    onResize: handleResize,
    onWheel: responsive.handleScrollableWheel
  });

  responsive.syncResponsiveView();
  renderers.render();
}
