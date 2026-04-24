export function applyStoredTheme(state) {
  const rootTheme = localStorage.getItem("chetrend-theme");
  if (rootTheme === "dark" || rootTheme === "light") {
    state.theme = rootTheme;
  }

  document.documentElement.dataset.theme = state.theme;
}
