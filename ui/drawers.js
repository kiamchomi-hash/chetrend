import { getTransitionDurationMs } from "./transition-utils.js";

export function openDrawer(side, dom, closeTimerRef) {
  const drawer = side === "left" ? dom.leftDrawer : dom.rightDrawer;
  const backdrop = dom.drawerBackdrop;
  if (!drawer || !backdrop) {
    return;
  }

  window.clearTimeout(closeTimerRef.current);
  closeTimerRef.current = 0;
  drawer.classList.remove("is-closing");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

export function closeDrawers(dom, isMobileViewport, getTransitionDurationMs, closeTimerRef) {
  const leftDrawer = dom.leftDrawer;
  const rightDrawer = dom.rightDrawer;
  const backdrop = dom.drawerBackdrop;
  if (!leftDrawer || !rightDrawer || !backdrop) {
    return;
  }

  leftDrawer.classList.remove("is-open", "is-closing");
  leftDrawer.setAttribute("aria-hidden", "true");

  if (isMobileViewport() && rightDrawer.classList.contains("is-open")) {
    rightDrawer.classList.add("is-closing");
    rightDrawer.setAttribute("aria-hidden", "true");
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      rightDrawer.classList.remove("is-open", "is-closing");
      backdrop.hidden = true;
      closeTimerRef.current = 0;
    }, getTransitionDurationMs(rightDrawer));
    return;
  }

  rightDrawer.classList.remove("is-open", "is-closing");
  rightDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}
