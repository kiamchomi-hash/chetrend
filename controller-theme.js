export function applyStoredTheme(state) {
  const hasStorage = typeof localStorage !== "undefined";
  const hasDocument = typeof document !== "undefined";
  if (hasStorage) {
    const rootTheme = localStorage.getItem("chetrend-theme");
    if (rootTheme === "dark" || rootTheme === "light") {
      state.theme = rootTheme;
    }
  }

  if (hasDocument) {
    document.documentElement.dataset.theme = state.theme;
  }
}
