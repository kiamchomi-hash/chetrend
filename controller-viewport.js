export function createBackToTopicsHandler(state, responsive, render) {
  return function backToTopics() {
    state.mobileView = "browse";
    responsive.syncResponsiveView();
    render();
  };
}

export function createResizeHandler({ responsive, render, actions }) {
  return function handleResize() {
    const wasMobile = document.documentElement.classList.contains("is-mobile-viewport");
    responsive.syncResponsiveView();
    responsive.updateLayoutMetrics();
    const isMobile = document.documentElement.classList.contains("is-mobile-viewport");
    if (wasMobile && !isMobile) {
      actions.closeDrawers();
    }
    if (wasMobile !== isMobile) {
      render();
    }
  };
}
