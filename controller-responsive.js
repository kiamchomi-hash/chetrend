export function createResponsiveHelpers({ state, dom }) {
  function isMobileViewport() {
    return window.matchMedia("(max-width: 960px)").matches;
  }

  function syncResponsiveView() {
    const shell = dom.shell;
    if (!shell) {
      return;
    }

    const mobile = isMobileViewport();
    document.documentElement.classList.toggle("is-mobile-viewport", mobile);
    document.documentElement.classList.toggle("is-desktop-viewport", !mobile);

    if (!mobile) {
      state.mobileView = "browse";
      shell.dataset.mobileView = "desktop";
      return;
    }

    if (state.mobileView !== "chat" && state.mobileView !== "browse") {
      state.mobileView = "browse";
    }

    shell.dataset.mobileView = state.mobileView;
  }

  function updateLayoutMetrics() {
    const topbar = dom.topbar;
    if (!topbar) {
      return;
    }

    document.documentElement.style.setProperty(
      "--topbar-offset",
      `${Math.ceil(topbar.getBoundingClientRect().height)}px`
    );
  }

  function handleScrollableWheel(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const container = target.closest(".scroll-list, .message-stream");
    if (!container) {
      return;
    }

    const delta = event.deltaY;
    if (!delta) {
      return;
    }

    const canScroll = container.scrollHeight > container.clientHeight + 1;
    if (!canScroll) {
      return;
    }

    event.preventDefault();
    container.scrollTop += delta;
  }

  return {
    isMobileViewport,
    syncResponsiveView,
    updateLayoutMetrics,
    handleScrollableWheel
  };
}
