import { bindTopbarActionEvents } from "./topbar-action-events.js";
import { bindTopbarDrawerEvents } from "./topbar-drawer-events.js";
import { bindTopbarRankingEvents } from "./topbar-ranking-events.js";

export function bindTopbarEvents(dom, handlers) {
  bindTopbarActionEvents(dom, handlers);
  bindTopbarRankingEvents(dom, handlers);
  bindTopbarDrawerEvents(dom, handlers);
}
