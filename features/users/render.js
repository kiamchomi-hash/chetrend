import { createUserItem, createUserSkeleton } from "./components/user-item.js";
import { renderIntoTargets } from "../../ui/render-utils.js";
import { selectUsersViewModel } from "./selectors.js";

export function renderUsersPanel(state, dom) {
  const viewModel = selectUsersViewModel(state);

  renderIntoTargets([dom.userList, dom.drawerUserList], "scroll-list user-list", () => {
    if (viewModel.isLoading) {
      return Array.from({ length: 10 }, () => createUserSkeleton());
    }

    return viewModel.items.map((user) => createUserItem(user));
  });
}
