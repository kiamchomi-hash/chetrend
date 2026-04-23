import { bindTopbarEvents } from "./topbar.js";

export function bindPageEvents(dom, handlers) {
  bindTopbarEvents(dom, handlers);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handlers.closeDrawers();
    }
  });

  window.addEventListener("resize", handlers.onResize);
  document.addEventListener("wheel", handlers.onWheel, { passive: false, capture: true });
}
