import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initialUsers, topicSeedData } from "../data.js";
import {
  buildTopics,
  buildUsers,
  createTopic,
  createMessage,
  formatCommentCount,
  getSelectedTopic,
  summarizeTopicMessage,
  trimMessages
} from "../model.js";
import {
  GLOBAL_RANKING_STEPS,
  TOPIC_RANKING_STEPS,
  getActiveRankingIndex,
  getActiveRankingStep,
  setStoredRankingIndex
} from "../ranking-state.js";
import { buildPostRankingEntries, buildUserRankingEntries } from "../ui/ranking-data.js";

const rootDir = path.dirname(fileURLToPath(new URL("../app.js", import.meta.url)));
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".html", ".css", ".md"]);
const IGNORED_DIRECTORIES = new Set([".git", ".playwright-mcp"]);
const MOJIBAKE_PATTERNS = [
  String.fromCharCode(0xc3),
  String.fromCharCode(0xc2),
  String.fromCodePoint(0xfffd),
  "Todav\u00c3\u00ada",
  "aqu\u00c3\u00ad",
  "An\u00c3\u00b3nimo",
  "preparaci\u00c3\u00b3n"
];

async function read(name) {
  return readFile(path.join(rootDir, name), "utf8");
}

async function collectSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`fail - ${name}`);
    throw error;
  }
}

await (async () => {
  await test("buildUsers decorates seed users", () => {
    const users = buildUsers(initialUsers);

    assert.equal(users.length, initialUsers.length);
    assert.equal(users[0].online, true);
    assert.equal(users[6].online, true);
    assert.equal(users[0].initials, "CM");
  });

  await test("buildTopics creates a topic per seed with rotating authors", () => {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users, 1_700_000_000_000);

    assert.equal(topics.length, topicSeedData.length);
    assert.equal(topics[0].messages.length, 10);
    assert.equal(topics[0].messages[0].authorId, "u1");
    assert.equal(topics[0].messages[1].authorId, "u2");
    assert.equal(topics[0].messages[0].timestamp instanceof Date, true);
    assert.equal(typeof topics[0].authorId, "string");
  });

  await test("getSelectedTopic returns null when no topic is selected", () => {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users, 1_700_000_000_000);

    assert.equal(getSelectedTopic(topics, "missing"), null);
    assert.equal(getSelectedTopic(topics, null), null);
  });

  await test("trimMessages keeps the latest 30 messages", () => {
    const messages = Array.from({ length: 35 }, (_, index) => createMessage("u1", `m${index}`, index));
    const trimmed = trimMessages(messages, 30);

    assert.equal(trimmed.length, 30);
    assert.equal(trimmed[0].text, "m5");
    assert.equal(trimmed[29].text, "m34");
  });

  await test("createTopic builds a new topic from title and first message", () => {
    const topic = createTopic("u1", "  Nuevo tema  ", "  Primer mensaje para abrir el hilo.  ", 1_700_000_000_000);

    assert.match(topic.id, /^topic-/);
    assert.equal(topic.title, "Nuevo tema");
    assert.equal(topic.subtitle, "Primer mensaje para abrir el hilo.");
    assert.equal(topic.authorId, "u1");
    assert.equal(topic.visible, true);
    assert.equal(topic.messages.length, 1);
    assert.equal(topic.messages[0].authorId, "u1");
    assert.equal(topic.messages[0].text, "Primer mensaje para abrir el hilo.");
    assert.equal(summarizeTopicMessage("a".repeat(110)).endsWith("…"), true);
  });

  await test("ranking builders summarise activity and handle empty topics", () => {
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

  await test("ranking state helpers keep indices isolated per scope", () => {
    const state = {
      rankingScope: "global",
      globalRankingIndex: 0,
      topicRankingIndex: 1
    };

    assert.equal(GLOBAL_RANKING_STEPS.length, 4);
    assert.equal(TOPIC_RANKING_STEPS.length, 2);
    assert.equal(getActiveRankingIndex(state), 0);
    assert.deepEqual(getActiveRankingStep(state), {
      type: "posts",
      metric: "comments",
      index: 0
    });

    setStoredRankingIndex(state, 6);
    assert.equal(state.globalRankingIndex, 2);
    assert.deepEqual(getActiveRankingStep(state), {
      type: "users",
      metric: "comments",
      index: 2
    });

    state.rankingScope = "topic";
    assert.equal(getActiveRankingIndex(state), 1);
    assert.deepEqual(getActiveRankingStep(state), {
      type: "users",
      metric: "likes",
      index: 1
    });

    setStoredRankingIndex(state, -1);
    assert.equal(state.topicRankingIndex, 1);

    state.rankingScope = "global";
    assert.equal(state.globalRankingIndex, 2);
    assert.deepEqual(getActiveRankingStep(state), {
      type: "users",
      metric: "comments",
      index: 2
    });
  });

  await test("source files stay free of mojibake markers", async () => {
    const files = await collectSourceFiles(rootDir);
    const offenders = [];

    for (const file of files) {
      const text = await readFile(file, "utf8");
      const hit = MOJIBAKE_PATTERNS.find((pattern) => text.includes(pattern));
      if (hit) {
        offenders.push(`${path.relative(rootDir, file)} => ${JSON.stringify(hit)}`);
      }
    }

    assert.equal(offenders.length, 0, offenders.join("\n"));
  });

  await test("index and app structure stay trimmed", async () => {
    const html = await read("index.html");
    const app = await read("app.js");
    const controller = await read("controller.js");
    const controllerApp = await read("controller-app.js");
    const controllerTheme = await read("controller-theme.js");
    const controllerViewport = await read("controller-viewport.js");
    const actions = await read("controller-actions.js");
    const rankingActions = await read("controller-ranking-actions.js");
    const rankingState = await read("ranking-state.js");
    const responsiveController = await read("controller-responsive.js");
    const renderController = await read("controller-render.js");
    const stateStore = await read("state-store.js");
    const domStore = await read("dom-store.js");
    const timerStore = await read("timer-store.js");
    const store = await read("app-store.js");
    const data = await read("data.js");
    const styles = await read("styles.css");
    const domModule = await read("ui/dom.js");
    const eventsModule = await read("ui/events.js");
    const chat = await read("ui/chat.js");
    const rankings = await read("ui/rankings.js");
    const rankingLabels = await read("ui/ranking-labels.js");
    const rankingIcons = await read("ui/ranking-icons.js");
    const titles = await read("ui/titles.js");
    const topics = await read("ui/topics.js");
    const users = await read("ui/users.js");
    const renderUtils = await read("ui/render-utils.js");
    const drawers = await read("ui/drawers.js");
    const topbar = await read("ui/topbar.js");

    assert.match(html, /id="topicList"/);
    assert.match(html, /id="createTopicButton"/);
    assert.match(html, /id="topicTitleInput"/);
    assert.match(html, /id="chatTitle"/);
    assert.match(html, /id="leftDrawerTopics"/);
    assert.match(html, /refresh-button__wheel/);
    assert.match(html, /id="backToTopics"/);
    assert.match(html, /placeholder="Escribe aquí\.\.\."/);
    assert.match(html, /<p class="panel__kicker">Menú<\/p>/);
    assert.match(html, /id="rankingPrev"/);
    assert.match(html, /id="rankingCurrent"/);
    assert.match(html, /id="rankingNext"/);
    assert.match(html, /id="drawerRankingPrev"/);
    assert.match(html, /id="drawerRankingCurrent"/);
    assert.match(html, /id="drawerRankingNext"/);
    assert.match(html, /<h3>Usuarios conectados<\/h3>/);
    assert.match(html, /<h3 id="rankingsTitle">Ranking<\/h3>/);
    assert.match(html, /<h3 id="drawerRankingsTitle">Ranking<\/h3>/);
    assert.doesNotMatch(html, /createTopicForm|mobileCreateTopicForm|Nuevo tema|Ordenados por presencia/);
    assert.match(data, /"Café de madrugada"/);
    assert.match(data, /"Moderación"/);
    assert.match(styles, /\.topic-item__title,\s*\.topic-item__meta\s*\{[\s\S]*text-overflow:\s*ellipsis;/);
    assert.match(styles, /\.topic-item\s*\{[\s\S]*width:\s*100%;[\s\S]*min-width:\s*0;/);
    assert.match(styles, /\.workspace\s*\{[\s\S]*grid-template-columns:\s*minmax\(275px,\s*1fr\)\s*minmax\(0,\s*1\.78fr\)\s*minmax\(275px,\s*1fr\);/);
    assert.match(styles, /html\.is-desktop-viewport \.panel--topics \.topic-item__title\s*\{[\s\S]*font-size:\s*0\.98rem;/);
    assert.match(app, /from "\.\/controller\.js"/);
    assert.match(controller, /export \{ bootstrap \} from "\.\/controller-app\.js";/);
    assert.match(controllerApp, /from "\.\/ui\/transition-utils\.js"/);
    assert.match(controllerTheme, /export function applyStoredTheme/);
    assert.match(controllerViewport, /export function createBackToTopicsHandler/);
    assert.match(controllerViewport, /export function createResizeHandler/);
    assert.match(controllerApp, /from "\.\/app-store\.js"/);
    assert.match(controllerApp, /from "\.\/ui\/dom\.js"/);
    assert.match(controllerApp, /from "\.\/ui\/events\.js"/);
    assert.match(controllerApp, /from "\.\/controller-actions\.js"/);
    assert.match(controllerApp, /from "\.\/controller-responsive\.js"/);
    assert.match(controllerApp, /from "\.\/controller-render\.js"/);
    assert.match(controllerApp, /from "\.\/controller-runtime\.js"/);
    assert.doesNotMatch(controllerApp, /function cacheDom|function bindEvents|function renderIntoTargets|function getTransitionDurationMs|function bindTopbarEvents|function toggleTheme|function submitMessage/);
    assert.match(actions, /export function createActionHandlers/);
    assert.match(actions, /createNewTopic/);
    assert.match(rankingActions, /from "\.\/ranking-state\.js"/);
    assert.match(rankingState, /export function getActiveRankingStep/);
    assert.match(rankingState, /export function setStoredRankingIndex/);
    assert.match(responsiveController, /export function createResponsiveHelpers/);
    assert.match(renderController, /export function createRenderers/);
    assert.match(chat, /renderChat/);
    assert.match(rankings, /renderRankings/);
    assert.match(rankings, /getActiveRankingStep/);
    assert.match(rankingLabels, /getActiveRankingStep/);
    assert.match(rankingIcons, /getActiveRankingStep/);
    assert.match(titles, /renderTitles/);
    assert.match(topics, /renderTopics/);
    assert.match(users, /renderUsers/);
    assert.match(domModule, /export function cacheDom/);
    assert.match(domModule, /chatTitle/);
    assert.match(domModule, /topicTitleInput/);
    assert.match(domModule, /assertRequiredDom/);
    assert.match(domModule, /Missing required DOM nodes/);
    assert.match(eventsModule, /export function bindPageEvents/);
    assert.match(renderUtils, /renderIntoTargets/);
    assert.match(drawers, /getTransitionDurationMs/);
    assert.match(topbar, /bindTopbarEvents/);
    assert.match(store, /export \{ state \} from "\.\/state-store\.js";/);
    assert.match(store, /export \{ dom \} from "\.\/dom-store\.js";/);
    assert.match(store, /export \{ closeTimerRef \} from "\.\/timer-store\.js";/);
    assert.match(stateStore, /export const state/);
    assert.doesNotMatch(stateStore, /\brankingType\b|\brankingMetric\b|\brankingIndex\b/);
    assert.match(domStore, /export const dom/);
    assert.match(timerStore, /export const closeTimerRef/);
    assert.doesNotMatch(app, /createTopicForm|mobileCreateTopicForm/);
  });

  console.log("all tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
