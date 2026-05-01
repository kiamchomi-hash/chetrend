import { bindTopbarEvents } from "./topbar.js";

export function bindPageEvents(dom, handlers) {
  bindTopbarEvents(dom, handlers);

  function handleConnectedUserActivation(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    const userItem = target.closest("[data-connected-user-id]");
    if (!(userItem instanceof HTMLElement)) {
      return false;
    }

    const userId = userItem.dataset.connectedUserId;
    if (!userId) {
      return false;
    }

    const actionButton = target.closest("[data-user-action]");
    const action = actionButton instanceof HTMLElement ? actionButton.dataset.userAction || "item" : "item";
    handlers.activateConnectedUser?.(userId, action);
    return true;
  }

  function bindConnectedUserListEvents(listNode) {
    if (!(listNode instanceof HTMLElement)) {
      return;
    }

    listNode.addEventListener("click", (event) => {
      handleConnectedUserActivation(event.target);
    });

    listNode.addEventListener("keydown", (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      if (event.target.matches("[data-user-action]")) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const handled = handleConnectedUserActivation(event.target);
      if (!handled) {
        return;
      }

      event.preventDefault();
    });
  }

  bindConnectedUserListEvents(dom.userList);
  bindConnectedUserListEvents(dom.drawerUserList);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const pickerMarkedOpen = document.documentElement?.dataset?.customPickerOpen === "true";
    const picker = document.querySelector(".clr-picker");
    const pickerIsOpen = pickerMarkedOpen || (picker instanceof HTMLElement && picker.classList.contains("clr-open"));
    if (!pickerIsOpen || typeof globalThis.Coloris?.close !== "function") {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation?.();
    globalThis.Coloris.close();
  }, true);

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape") {
      handlers.closePaletteModal();
      handlers.closeDrawers();
    }
  });

  window.addEventListener("resize", handlers.onResize);
  document.addEventListener("wheel", handlers.onWheel, { passive: false, capture: true });
}
