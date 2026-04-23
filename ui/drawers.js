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

export function getTransitionDurationMs(element) {
  const styles = window.getComputedStyle(element);
  const durations = styles.transitionDuration.split(",").map(parseTimeToMs);
  const delays = styles.transitionDelay.split(",").map(parseTimeToMs);
  const count = Math.max(durations.length, delays.length);

  let total = 0;
  for (let index = 0; index < count; index += 1) {
    const duration = durations[index] ?? durations[durations.length - 1] ?? 0;
    const delay = delays[index] ?? delays[delays.length - 1] ?? 0;
    total = Math.max(total, duration + delay);
  }

  return total;
}

function parseTimeToMs(value) {
  const text = value.trim();
  if (text.endsWith("ms")) {
    return Number.parseFloat(text) || 0;
  }
  if (text.endsWith("s")) {
    return (Number.parseFloat(text) || 0) * 1000;
  }
  return Number.parseFloat(text) || 0;
}
