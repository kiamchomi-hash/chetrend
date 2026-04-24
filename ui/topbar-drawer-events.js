export function bindTopbarDrawerEvents(dom, handlers) {
  dom.openRightDrawer.addEventListener("click", () => handlers.openDrawer("right"));
  dom.drawerBackdrop.addEventListener("click", handlers.closeDrawers);

  dom.drawerCloseButtons.forEach((button) => {
    button.addEventListener("click", handlers.closeDrawers);
  });
}
