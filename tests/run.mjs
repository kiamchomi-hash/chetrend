import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initialUsers, topicSeedData } from "../data.js";
import {
  buildTopics,
  buildUsers,
  createMessage,
  getSelectedTopic,
  trimMessages
} from "../model.js";
import {
  buildPostRankingEntries,
  buildUserRankingEntries
} from "../ui/ranking-data.js";
import { formatCommentCount } from "../model.js";

const rootDir = path.dirname(fileURLToPath(new URL("../app.js", import.meta.url)));

async function read(name) {
  return readFile(path.join(rootDir, name), "utf8");
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`fail - ${name}`);
    throw error;
  }
}

await (async () => {
  test("buildUsers decorates seed users", () => {
    const users = buildUsers(initialUsers);

    assert.equal(users.length, initialUsers.length);
    assert.equal(users[0].online, true);
    assert.equal(users[6].online, true);
    assert.equal(users[0].initials, "CM");
  });

  test("buildTopics creates a topic per seed with rotating authors", () => {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users, 1_700_000_000_000);

    assert.equal(topics.length, topicSeedData.length);
    assert.equal(topics[0].messages.length, 10);
    assert.equal(topics[0].messages[0].authorId, "u1");
    assert.equal(topics[0].messages[1].authorId, "u2");
    assert.equal(topics[0].messages[0].timestamp instanceof Date, true);
    assert.equal(typeof topics[0].authorId, "string");
  });

  test("getSelectedTopic returns null when no topic is selected", () => {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users, 1_700_000_000_000);

    assert.equal(getSelectedTopic(topics, "missing"), null);
    assert.equal(getSelectedTopic(topics, null), null);
  });

  test("trimMessages keeps the latest 30 messages", () => {
    const messages = Array.from({ length: 35 }, (_, index) => createMessage("u1", `m${index}`, index));
    const trimmed = trimMessages(messages, 30);

    assert.equal(trimmed.length, 30);
    assert.equal(trimmed[0].text, "m5");
    assert.equal(trimmed[29].text, "m34");
  });

  test("ranking builders summarise activity and handle empty topics", () => {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users, 1_700_000_000_000);

    const postComments = buildPostRankingEntries(topics, users, "u1", "comments");
    const postLikes = buildPostRankingEntries(topics, users, "u1", "likes");
    const userComments = buildUserRankingEntries(topics, users, "u1", "comments");
    const userLikes = buildUserRankingEntries(topics, users, "u1", "likes");

    assert.equal(postComments.length, 3);
    assert.equal(postLikes.length, 3);
    assert.equal(userComments.length, 3);
    assert.equal(userLikes.length, 3);
    assert.ok(postComments[0].count >= postComments[1].count);
    assert.ok(postLikes[0].count >= postLikes[1].count);
    assert.ok(userComments[0].count >= userComments[1].count);
    assert.ok(userLikes[0].count >= userLikes[1].count);
    assert.equal(formatCommentCount(1), "1 comentario");
    assert.equal(formatCommentCount(2), "2 comentarios");
  });

  test("index and app structure stay trimmed", async () => {
    const html = await read("index.html");
    const app = await read("app.js");
    const controller = await read("controller.js");
    const controllerApp = await read("controller-app.js");
    const actions = await read("controller-actions.js");
    const responsiveController = await read("controller-responsive.js");
    const renderController = await read("controller-render.js");
    const store = await read("app-store.js");
    const domModule = await read("ui/dom.js");
    const eventsModule = await read("ui/events.js");
    const chat = await read("ui/chat.js");
    const rankings = await read("ui/rankings.js");
    const titles = await read("ui/titles.js");
    const topics = await read("ui/topics.js");
    const users = await read("ui/users.js");
    const renderUtils = await read("ui/render-utils.js");
    const drawers = await read("ui/drawers.js");
    const topbar = await read("ui/topbar.js");

    assert.match(html, /id="topicList"/);
    assert.match(html, /id="leftDrawerTopics"/);
    assert.match(html, /<p class="chat-hero__label">Tema<\/p>/);
    assert.match(html, /id="rankingPrev"/);
    assert.match(html, /id="rankingCurrent"/);
    assert.match(html, /id="rankingNext"/);
    assert.match(html, /id="drawerRankingPrev"/);
    assert.match(html, /id="drawerRankingCurrent"/);
    assert.match(html, /id="drawerRankingNext"/);
    assert.match(html, /<h2 id="usersTitle">Usuarios conectados<\/h2>/);
    assert.match(html, /<h2 id="rankingsTitle">Ranking<\/h2>/);
    assert.match(html, /<h3 id="drawerRankingsTitle">Ranking<\/h3>/);
    assert.doesNotMatch(html, /createTopicForm|mobileCreateTopicForm|Nuevo tema|Ordenados por presencia/);
    assert.match(app, /from "\.\/controller\.js"/);
    assert.match(controller, /export \{ bootstrap \} from "\.\/controller-app\.js";/);
    assert.match(controllerApp, /from "\.\/app-store\.js"/);
    assert.match(controllerApp, /from "\.\/ui\/dom\.js"/);
    assert.match(controllerApp, /from "\.\/ui\/events\.js"/);
    assert.match(controllerApp, /from "\.\/controller-actions\.js"/);
    assert.match(controllerApp, /from "\.\/controller-responsive\.js"/);
    assert.match(controllerApp, /from "\.\/controller-render\.js"/);
    assert.match(controllerApp, /from "\.\/controller-runtime\.js"/);
    assert.doesNotMatch(controllerApp, /function cacheDom|function bindEvents|function renderIntoTargets|function getTransitionDurationMs|function bindTopbarEvents|function toggleTheme|function submitMessage/);
    assert.match(actions, /export function createActionHandlers/);
    assert.match(responsiveController, /export function createResponsiveHelpers/);
    assert.match(renderController, /export function createRenderers/);
    assert.match(chat, /renderChat/);
    assert.match(rankings, /renderRankings/);
    assert.match(titles, /renderTitles/);
    assert.match(topics, /renderTopics/);
    assert.match(users, /renderUsers/);
    assert.match(domModule, /export function cacheDom/);
    assert.match(eventsModule, /export function bindPageEvents/);
    assert.match(renderUtils, /renderIntoTargets/);
    assert.match(drawers, /getTransitionDurationMs/);
    assert.match(topbar, /bindTopbarEvents/);
    assert.match(store, /export const state/);
    assert.match(store, /export const dom/);
    assert.doesNotMatch(app, /createTopicForm|mobileCreateTopicForm/);
  });

  console.log("all tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
