export class DrawerService {
  constructor(dom, closeTimerRef, isMobileViewport, getTransitionDurationMs) {
    this.dom = dom;
    this.closeTimerRef = closeTimerRef;
    this.isMobileViewport = isMobileViewport;
    this.getTransitionDurationMs = getTransitionDurationMs;
  }

  open(side) {
    const drawer = side === "left" ? this.dom.leftDrawer : this.dom.rightDrawer;
    const backdrop = this.dom.drawerBackdrop;
    if (!drawer || !backdrop) return;

    window.clearTimeout(this.closeTimerRef.current);
    this.closeTimerRef.current = 0;
    drawer.classList.remove("is-closing");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
  }

  close() {
    const { leftDrawer, rightDrawer, drawerBackdrop: backdrop } = this.dom;
    if (!leftDrawer || !rightDrawer || !backdrop) return;

    leftDrawer.classList.remove("is-open", "is-closing");
    leftDrawer.setAttribute("aria-hidden", "true");

    if (this.isMobileViewport() && rightDrawer.classList.contains("is-open")) {
      rightDrawer.classList.add("is-closing");
      rightDrawer.setAttribute("aria-hidden", "true");
      window.clearTimeout(this.closeTimerRef.current);
      this.closeTimerRef.current = window.setTimeout(() => {
        rightDrawer.classList.remove("is-open", "is-closing");
        backdrop.hidden = true;
        this.closeTimerRef.current = 0;
      }, this.getTransitionDurationMs(rightDrawer));
      return;
    }

    rightDrawer.classList.remove("is-open", "is-closing");
    rightDrawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
  }
}
