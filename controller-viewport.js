export function createBackToTopicsHandler(state, responsive, render) {
  return function backToTopics() {
    state.mobileView = "browse";
    responsive.syncResponsiveView();
    render();
  };
}

export function createResizeHandler({ responsive, render, actions, syncRankingListHeights = () => {} }) {
  return function handleResize() {
    const wasMobile = responsive.isMobileViewport();
    responsive.syncResponsiveView();
    responsive.updateLayoutMetrics();
    const isMobile = responsive.isMobileViewport();
    if (wasMobile && !isMobile) {
      actions.closeDrawers();
    }
    if (wasMobile !== isMobile) {
      render();
      return;
    }

    syncRankingListHeights();
  };
}
