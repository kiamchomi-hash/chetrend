const NAVIGATION_ACTION_TYPES = {
  setMobileView: "navigation/setMobileView"
};

export function setMobileViewAction(view) {
  return {
    type: NAVIGATION_ACTION_TYPES.setMobileView,
    payload: { view }
  };
}

export function isNavigationStateAction(action) {
  return Object.values(NAVIGATION_ACTION_TYPES).includes(action?.type);
}

export function reduceNavigationState(state, action) {
  switch (action.type) {
    case NAVIGATION_ACTION_TYPES.setMobileView: {
      const view = action.payload?.view;
      if (state.mobileView === view) {
        return { changed: false };
      }
      state.mobileView = view;
      return { changed: true, view };
    }
    default:
      return { changed: false };
  }
}
