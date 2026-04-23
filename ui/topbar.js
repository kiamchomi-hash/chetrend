export function bindTopbarEvents(dom, handlers) {
  dom.themeToggle.addEventListener("click", handlers.toggleTheme);
  dom.refreshButton.addEventListener("click", handlers.refreshCurrentTopic);
  dom.messageForm.addEventListener("submit", handlers.submitMessage);
  dom.rankingPrev.addEventListener("click", () => handlers.setRankingMode("global"));
  dom.rankingNext.addEventListener("click", () => handlers.setRankingMode("topic"));
  dom.drawerRankingPrev.addEventListener("click", () => handlers.setRankingMode("global"));
  dom.drawerRankingNext.addEventListener("click", () => handlers.setRankingMode("topic"));
  dom.openRightDrawer.addEventListener("click", () => handlers.openDrawer("right"));
  dom.drawerBackdrop.addEventListener("click", handlers.closeDrawers);

  dom.drawerCloseButtons.forEach((button) => {
    button.addEventListener("click", handlers.closeDrawers);
  });

  dom.profileButton.addEventListener("click", () => {
    handlers.flashTitle("Perfil listo para conectar");
  });

  dom.backToTopics.addEventListener("click", handlers.backToTopics);

  dom.contactAdminButton.addEventListener("click", () => {
    handlers.flashTitle("Contacto admin abierto");
  });

  dom.storeButton.addEventListener("click", () => {
    handlers.flashTitle("Tienda en preparación");
  });

  dom.paletteButton.addEventListener("click", () => {
    handlers.flashTitle("Selector de paletas en preparación");
  });
}
