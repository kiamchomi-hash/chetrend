import { initialUsers, topicSeedData } from "./data.js";
import { buildTopics, buildUsers } from "./model.js";
import { getTransitionDurationMs, openDrawer, closeDrawers } from "./ui/drawers.js";
import { bindPageEvents } from "./ui/events.js";
import { cacheDom } from "./ui/dom.js";
import { createActionHandlers } from "./controller-actions.js";
import { createResponsiveHelpers } from "./controller-responsive.js";
import { createRenderers } from "./controller-render.js";
import { closeTimerRef, dom, state } from "./app-store.js";

export function bootstrap() {
  state.users = buildUsers(initialUsers);
  state.topics = buildTopics(topicSeedData, state.users);

  const rootTheme = localStorage.getItem("chetrend-theme");
  if (rootTheme === "dark" || rootTheme === "light") {
    state.theme = rootTheme;
  }

  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.previewMode = getPreviewMode();

  Object.assign(dom, cacheDom());

  const responsive = createResponsiveHelpers({ state, dom });
  const renderRef = { current: () => {} };
  const actions = createActionHandlers({
    state,
    dom,
    renderRef,
    syncResponsiveView: responsive.syncResponsiveView,
    isMobileViewport: responsive.isMobileViewport,
    closeDrawers: () => closeDrawers(dom, responsive.isMobileViewport, getTransitionDurationMs, closeTimerRef),
    nowLabel
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

  bindPageEvents(dom, {
    toggleTheme: actions.toggleTheme,
    refreshCurrentTopic: actions.refreshCurrentTopic,
    submitMessage: actions.submitMessage,
    setRankingMode: actions.setRankingMode,
    openDrawer: (side) => openDrawer(side, dom, closeTimerRef),
    closeDrawers: actions.closeDrawers,
    flashTitle: actions.flashTitle,
    backToTopics: () => {
      state.mobileView = "browse";
      responsive.syncResponsiveView();
      renderers.render();
    },
    onResize: () => {
      const wasMobile = document.documentElement.classList.contains("is-mobile-viewport");
      responsive.syncResponsiveView();
      responsive.updateLayoutMetrics();
      const isMobile = document.documentElement.classList.contains("is-mobile-viewport");
      if (wasMobile !== isMobile) {
        renderers.render();
      }
    },
    onWheel: responsive.handleScrollableWheel
  });

  responsive.syncResponsiveView();
  renderers.render();
}

function nowLabel() {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getPreviewMode() {
  return window.CHTREND_PREVIEW_MODE || "responsive";
}
