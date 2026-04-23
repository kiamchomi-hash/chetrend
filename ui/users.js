import { createUserItem } from "../components.js";
import { renderIntoTargets } from "./render-utils.js";

export function renderUsers(state, dom) {
  const ordered = [...state.users].sort((a, b) => {
    if (a.id === state.currentUserId) return -1;
    if (b.id === state.currentUserId) return 1;
    return Number(b.online) - Number(a.online) || b.score - a.score;
  });

  renderIntoTargets([dom.userList, dom.drawerUserList], "scroll-list user-list", () =>
    ordered.map((user) => createUserItem(user, state.currentUserId))
  );
}
