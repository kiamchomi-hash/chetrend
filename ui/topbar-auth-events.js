export function bindTopbarAuthEvents(dom, handlers) {
  let isLoggedIn = false;

  function addListener(node, type, listener, options) {
    node?.addEventListener?.(type, listener, options);
  }

  function syncAuthUi() {
    const label = dom.authButton?.querySelector(".button-label");

    if (label) {
      label.textContent = isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión";
    }

    if (dom.authButton) {
      dom.authButton.className = isLoggedIn
        ? "text-button discreet-auth"
        : "text-button text-button--accent prominent-auth";
      dom.authButton.setAttribute("aria-label", isLoggedIn ? "Cerrar Sesión" : "Iniciar sesión");
    }

    if (dom.authTools) {
      dom.authTools.hidden = !isLoggedIn;
    }
  }

  addListener(dom.profileButton, "click", () => {
    handlers.flashTitle("Perfil listo para conectar");
  });

  syncAuthUi();
  addListener(dom.authButton, "click", () => {
    // Auth functionality moved to backend
  });

  addListener(dom.friendRequestsButton, "click", () => {
    handlers.flashTitle("Solicitudes de amistad abiertas");
  });

  addListener(dom.notificationsButton, "click", () => {
    handlers.flashTitle("Notificaciones abiertas");
  });

  addListener(dom.messagesButton, "click", () => {
    handlers.flashTitle("Mensajes abiertos");
  });

  addListener(dom.storeButton, "click", () => {
    handlers.flashTitle("Tienda en preparacion");
  });
}
