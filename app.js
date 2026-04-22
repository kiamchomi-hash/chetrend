const state = {
  theme: "light",
  selectedTopicId: "topic-1",
  rankingMode: "global",
  refreshCount: 0,
  mobileView: "browse",
  mobileCreateOpen: false,
  currentUserId: "u1",
  topics: [],
  users: []
};

const topicSeedData = [
  ["Café de madrugada", "Discusión abierta para la ronda de la noche."],
  ["Balance del clan", "Ideas para ajustar economía y roles."],
  ["Eventos del domingo", "Armen propuestas y horarios."],
  ["Memes internos", "Solo material del servidor, sin compilar ajeno."],
  ["Guías y rutas", "Tips cortos para gente nueva."],
  ["Mercado local", "Intercambios, ventas y reservas."],
  ["Encuentros RP", "Coordinación de escenas y personajes."],
  ["Ajustes del HUD", "Feedback visual y comodidad."],
  ["Arte y capturas", "Imágenes del juego y fanart."],
  ["Combate y builds", "Probamos configuraciones y counters."],
  ["Preguntas rápidas", "Espacio para dudas cortas."],
  ["Buzón de ideas", "Mejoras, sugerencias y experimentos."],
  ["Historias del server", "Recuerdos, anécdotas y episodios."],
  ["Música de fondo", "Listas para acompañar partidas largas."],
  ["Alianzas", "Negociaciones entre facciones."],
  ["Torneo semanal", "Inscripción, brackets y resultados."],
  ["Novedades", "Cambios recientes y anuncios suaves."],
  ["Códigos y macros", "Atajos, bindings y trucos útiles."],
  ["Radio interna", "Temas de charla para el descanso."],
  ["Cocina del café", "Lo que se sirve cuando baja la intensidad."]
];

const initialUsers = [
  { id: "u1", name: "Coco Mora", role: "Tú", score: 142 },
  { id: "u2", name: "Nadia", role: "Moderación", score: 129 },
  { id: "u3", name: "Rulo", role: "Veterano", score: 117 },
  { id: "u4", name: "Mara", role: "Diseño", score: 103 },
  { id: "u5", name: "Tano", role: "Explorador", score: 98 },
  { id: "u6", name: "Luna", role: "Soporte", score: 91 },
  { id: "u7", name: "Ivo", role: "Clan", score: 84 }
];

function nowLabel() {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function createMessage(authorId, text, minutesAgo, kind = "user") {
  return {
    id: crypto.randomUUID(),
    authorId,
    text,
    kind,
    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000)
  };
}

function buildTopics() {
  return topicSeedData.map(([title, subtitle], index) => {
    const authorSet = ["u1", "u2", "u3", "u4", "u5", "u6", "u7"];
    const messages = [
      createMessage(authorSet[index % authorSet.length], `${title} quedó abierto para coordinar sin ruido.` , 48),
      createMessage(authorSet[(index + 1) % authorSet.length], subtitle, 34),
      createMessage(authorSet[(index + 2) % authorSet.length], `Dejo un aporte para el hilo ${index + 1}.`, 21),
      createMessage(authorSet[(index + 3) % authorSet.length], `Si hace falta, lo seguimos acá mismo.`, 8)
    ];

    return {
      id: `topic-${index + 1}`,
      title,
      subtitle,
      messages,
      visible: true
    };
  });
}

function bootstrap() {
  state.topics = buildTopics();
  state.users = initialUsers.map((user, index) => ({
    ...user,
    online: index < 6,
    initials: user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }));

  const rootTheme = localStorage.getItem("chetrend-theme");
  if (rootTheme === "dark" || rootTheme === "light") {
    state.theme = rootTheme;
  }
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.previewMode = getPreviewMode();

  bindEvents();
  syncResponsiveView();
  render();
}

function bindEvents() {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("refreshButton").addEventListener("click", refreshCurrentTopic);
  document.getElementById("messageForm").addEventListener("submit", submitMessage);
  document.getElementById("createTopicForm").addEventListener("submit", createTopic);
    document.getElementById("mobileCreateTopicForm").addEventListener("submit", createTopic);
    document.getElementById("openMobileCreate").addEventListener("click", toggleMobileCreate);
    document.getElementById("closeMobileCreate").addEventListener("click", closeMobileCreate);
    document.getElementById("closeMobileCreateMobile").addEventListener("click", closeMobileCreate);
    document.getElementById("rankingPrev").addEventListener("click", () => setRankingMode("global"));
    document.getElementById("rankingNext").addEventListener("click", () => setRankingMode("topic"));
    document.getElementById("drawerRankingPrev").addEventListener("click", () => setRankingMode("global"));
    document.getElementById("drawerRankingNext").addEventListener("click", () => setRankingMode("topic"));
    document.getElementById("openRightDrawer").addEventListener("click", () => openDrawer("right"));
    document.getElementById("drawerBackdrop").addEventListener("click", closeDrawers);

  document.querySelectorAll("[data-close-drawer]").forEach((button) => {
    button.addEventListener("click", closeDrawers);
  });

  document.getElementById("profileButton").addEventListener("click", () => {
    flashTitle("Perfil listo para conectar");
  });

  document.getElementById("backToTopics").addEventListener("click", () => {
    state.mobileView = "browse";
    state.mobileCreateOpen = false;
    syncResponsiveView();
    render();
  });

  document.getElementById("contactAdminButton").addEventListener("click", () => {
    flashTitle("Contacto admin abierto");
  });

  document.getElementById("storeButton").addEventListener("click", () => {
    flashTitle("Tienda en preparación");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawers();
    }
  });

  window.addEventListener("resize", () => {
    syncResponsiveView();
    render();
  });

  document.addEventListener("wheel", handleScrollableWheel, { passive: false, capture: true });
}

function flashTitle(text) {
  const stateNode = document.getElementById("refreshState");
  stateNode.textContent = text;
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem("chetrend-theme", state.theme);
  render();
}

function focusTopic(topicId) {
  state.selectedTopicId = topicId;
  state.mobileCreateOpen = false;
  if (isMobileViewport()) {
    state.mobileView = "chat";
    syncResponsiveView();
  }
  render();
}

function setRankingMode(mode) {
  state.rankingMode = mode;
  render();
}

function openDrawer(side) {
  const drawer = document.getElementById(side === "left" ? "leftDrawer" : "rightDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  drawer.classList.remove("is-closing");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closeDrawers() {
  const leftDrawer = document.getElementById("leftDrawer");
  const rightDrawer = document.getElementById("rightDrawer");
  const backdrop = document.getElementById("drawerBackdrop");

  leftDrawer.classList.remove("is-open", "is-closing");
  leftDrawer.setAttribute("aria-hidden", "true");

  if (isMobileViewport() && rightDrawer.classList.contains("is-open")) {
    rightDrawer.classList.add("is-closing");
    rightDrawer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      rightDrawer.classList.remove("is-open", "is-closing");
      backdrop.hidden = true;
    }, 220);
    return;
  }

  rightDrawer.classList.remove("is-open", "is-closing");
  rightDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}

function getSelectedTopic() {
  return state.topics.find((topic) => topic.id === state.selectedTopicId) ?? state.topics[0];
}

function render() {
  syncResponsiveView();
  renderTopics();
  renderTopics("leftDrawerTopics");
  renderChat();
  renderUsers();
  renderUsers("drawerUserList");
  renderRankings();
  renderRankings("drawerRankingList");
  renderTitles();
  syncMobileStageAccessibility();
  updateLayoutMetrics();
}


let topicAvatarSyncFrame = 0;

function scheduleTopicAvatarSync() {
  window.cancelAnimationFrame(topicAvatarSyncFrame);
  topicAvatarSyncFrame = window.requestAnimationFrame(() => {
    syncTopicAvatarSizes();
  });
}

function syncTopicAvatarSizes() {
  const items = document.querySelectorAll(".topic-item");
  if (!items.length) {
    return;
  }

  for (let pass = 0; pass < 3; pass += 1) {
    let changed = false;

    items.forEach((item) => {
      const nextSize = Math.max(0, Math.round(item.getBoundingClientRect().height));
      if (!nextSize) {
        return;
      }

      const currentSize = Number.parseFloat(item.style.getPropertyValue("--topic-avatar-size")) || 0;
      if (Math.abs(nextSize - currentSize) > 1) {
        item.style.setProperty("--topic-avatar-size", `${nextSize}px`);
        changed = true;
      }
    });

    if (!changed) {
      break;
    }
  }
}

function syncResponsiveView() {
  const shell = document.querySelector(".shell");
  if (!shell) {
    return;
  }

  const mobile = isMobileViewport();
  document.documentElement.classList.toggle("is-mobile-viewport", mobile);
  document.documentElement.classList.toggle("is-desktop-viewport", !mobile);

  if (!mobile) {
    state.mobileCreateOpen = false;
    state.mobileView = "browse";
    shell.dataset.mobileView = "desktop";
    shell.dataset.mobileCreate = "closed";
    syncMobileStageAccessibility();
    return;
  }

  if (state.mobileView !== "chat" && state.mobileView !== "browse" && state.mobileView !== "create") {
    state.mobileView = "browse";
  }

  shell.dataset.mobileView = state.mobileView;
  shell.dataset.mobileCreate = state.mobileCreateOpen ? "open" : "closed";
  syncMobileStageAccessibility();
}

function syncMobileStageAccessibility() {
  const listView = document.querySelector(".mobile-topic-stage__view--list");
  const createView = document.querySelector(".mobile-topic-stage__view--create");
  const toggle = document.getElementById("openMobileCreate");

  if (toggle) {
    toggle.setAttribute("aria-expanded", state.mobileView === "create" ? "true" : "false");
  }

  if (listView) {
    listView.setAttribute("aria-hidden", state.mobileView === "create" ? "true" : "false");
  }

  if (createView) {
    createView.setAttribute("aria-hidden", state.mobileView === "create" ? "false" : "true");
  }
}

function renderTitles() {
  const topic = getSelectedTopic();
  const currentTopicTitle = document.getElementById("currentTopicTitle");
  if (currentTopicTitle) {
    currentTopicTitle.textContent = topic.title;
  }
  document.getElementById("chatTopicName").textContent = topic.title;
  document.getElementById("chatTopicDescription").textContent = topic.subtitle;
  const rankingLabel = getRankingModeLabel(topic.title);
  const rankingsTitle = document.getElementById("rankingsTitle");
  if (rankingsTitle) {
    rankingsTitle.textContent = rankingLabel;
  }
  const drawerRankingsTitle = document.getElementById("drawerRankingsTitle");
  if (drawerRankingsTitle) {
    drawerRankingsTitle.textContent = rankingLabel;
  }
}

function getRankingModeLabel(topicTitle) {
  return state.rankingMode === "global" ? "Ranking global" : `Ranking ${topicTitle}`;
}

function renderTopics(targetId = "topicList") {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.className = "scroll-list topic-list";
  target.innerHTML = "";

  state.topics.slice(0, 20).forEach((topic, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `topic-item${topic.id === state.selectedTopicId ? " is-active" : ""}`;
    const topicCommentCount = topic.messages.filter((message) => message.kind === "user").length;
    const lastCommentAuthor = [...topic.messages].reverse().find((message) => message.kind === "user");
    const lastCommenterName = lastCommentAuthor ? getUser(lastCommentAuthor.authorId)?.name ?? "An�nimo" : "Sin actividad";
    button.innerHTML = `
      <span class="topic-item__avatar" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10"></rect>
          <circle cx="24" cy="18" r="7"></circle>
          <path d="M11.5 38c2.6-6.2 7.7-9.3 12.5-9.3S33.9 31.8 36.5 38"></path>
        </svg>
      </span>
      <span class="topic-item__content">
        <span class="topic-item__title">${escapeHtml(topic.title)}</span>
        <span class="topic-item__meta">${topicCommentCount}, ${escapeHtml(lastCommenterName)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      focusTopic(topic.id);
      closeDrawers();
    });
    target.appendChild(button);
  });
}

function renderChat() {
  const topic = getSelectedTopic();
  const stream = document.getElementById("messageStream");
  stream.innerHTML = "";
  topic.messages.forEach((message) => {
    stream.appendChild(renderMessage(message));
  });
  stream.scrollTop = stream.scrollHeight;
}

function renderMessage(message) {
  const node = document.createElement("article");
  node.className = `message${message.kind === "system" ? " message--system" : ""}`;
  const author = message.kind === "system" ? "Sistema" : getUser(message.authorId)?.name ?? "Anónimo";
  const role = message.kind === "system" ? "Aviso" : getUser(message.authorId)?.role ?? "Invitado";
  node.innerHTML = `
    <div class="message__meta">
      <span class="message__author">${escapeHtml(author)}</span>
      <span>${escapeHtml(role)}</span>
      <span>${message.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
    </div>
    <p class="message__text">${escapeHtml(message.text)}</p>
  `;
  return node;
}

function renderUsers(targetId = "userList") {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.className = "scroll-list user-list";
  target.innerHTML = "";

  const ordered = [...state.users].sort((a, b) => {
    if (a.id === state.currentUserId) return -1;
    if (b.id === state.currentUserId) return 1;
    return Number(b.online) - Number(a.online) || b.score - a.score;
  });

  ordered.forEach((user) => {
    const item = document.createElement("article");
    item.className = `user-item${user.id === state.currentUserId ? " is-current" : ""}`;
    item.innerHTML = `
      <p class="user-item__name">${escapeHtml(user.name)}</p>
      <div class="user-item__meta">${escapeHtml(user.role)} · ${user.online ? "Conectado" : "Offline"} · ${user.score} pts</div>
    `;
    target.appendChild(item);
  });
}

function renderRankings(targetId = "rankingList") {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.className = "scroll-list ranking-list";
  target.innerHTML = "";

  const topic = getSelectedTopic();
  const rankings = state.rankingMode === "global"
    ? [...state.users].sort((a, b) => b.score - a.score).slice(0, 7).map((user, index) => ({
        id: `global-${user.id}`,
        title: user.name,
        meta: `${user.score} puntos globales`,
        active: user.id === state.currentUserId
      }))
    : buildTopicRanking(topic);

  rankings.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = `ranking-item${entry.active ? " is-active" : ""}`;
    item.innerHTML = `
      <p class="ranking-item__title">${index + 1}. ${escapeHtml(entry.title)}</p>
      <div class="ranking-item__meta">${escapeHtml(entry.meta)}</div>
    `;
    target.appendChild(item);
  });
}

function buildTopicRanking(topic) {
  const counts = new Map();
  topic.messages.forEach((message) => {
    if (message.kind !== "user") {
      return;
    }
    counts.set(message.authorId, (counts.get(message.authorId) ?? 0) + 1);
  });

  const ranking = [...counts.entries()]
    .map(([authorId, count]) => {
      const user = getUser(authorId);
      return {
        id: authorId,
        title: user?.name ?? "Anónimo",
        meta: `${count} mensajes en ${topic.title}`,
        count,
        active: authorId === state.currentUserId
      };
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  if (!ranking.length) {
    return [
      {
        id: "empty",
        title: "Sin actividad",
        meta: "Todavía no hay participación en este tema.",
        active: false
      }
    ];
  }

  return ranking;
}

function getUser(userId) {
  return state.users.find((user) => user.id === userId);
}

function submitMessage(event) {
  event.preventDefault();
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text) {
    return;
  }

  const topic = getSelectedTopic();
  topic.messages.push(createMessage(state.currentUserId, text, 0));
  trimMessages(topic);
  input.value = "";
  state.rankingMode = "topic";
  render();
}

function createTopic(event) {
  event.preventDefault();
  const { titleInput, descriptionInput } = getCreateInputs();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim() || "Nuevo espacio abierto para conversar.";

  if (!title) {
    return;
  }

  const topic = {
    id: `topic-${Date.now()}`,
    title,
    subtitle: description,
    messages: [
      createMessage(state.currentUserId, description, 0),
      createMessage("u2", "Tema creado. Seguimos de cerca este hilo.", 1, "system")
    ]
  };

  state.topics.unshift(topic);
  trimTopicList();
  state.selectedTopicId = topic.id;
  clearCreateInputs();
  state.rankingMode = "topic";
  closeMobileCreate();
  render();
}

function trimTopicList() {
  state.topics = state.topics.slice(0, 20);
}

function trimMessages(topic) {
  if (topic.messages.length > 30) {
    topic.messages = topic.messages.slice(-30);
  }
}

function refreshCurrentTopic() {
  const topic = getSelectedTopic();
  state.refreshCount += 1;
  const last = topic.messages[topic.messages.length - 1];
  if (!last || last.kind !== "system" || state.refreshCount % 3 === 0) {
    topic.messages.push(
      createMessage(
        "u2",
        `Actualización manual ${state.refreshCount}: la sala sigue estable y sin sincronización en tiempo real.`,
        0,
        "system"
      )
    );
    trimMessages(topic);
  }
  document.getElementById("refreshState").textContent = `Actualizado ${nowLabel()}`;
  renderChat();
  renderRankings();
  renderTitles();
}

function toggleMobileCreate() {
  if (!isMobileViewport()) {
    return;
  }

  state.mobileCreateOpen = !state.mobileCreateOpen;
  if (state.mobileCreateOpen) {
    state.mobileView = "create";
  } else {
    state.mobileView = "browse";
  }
  syncResponsiveView();
  render();
}

function closeMobileCreate() {
  state.mobileCreateOpen = false;
  state.mobileView = "browse";
  syncResponsiveView();
  render();
}

function handleScrollableWheel(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }

  const container = target.closest(".scroll-list, .message-stream");
  if (!container) {
    return;
  }

  const delta = event.deltaY;
  if (!delta) {
    return;
  }

  const canScroll = container.scrollHeight > container.clientHeight + 1;
  if (!canScroll) {
    return;
  }

  event.preventDefault();
  container.scrollTop += delta;
}

function getCreateInputs() {
  if (isMobileViewport() && state.mobileView === "create") {
    return {
      titleInput: document.getElementById("mobileTopicTitleInput"),
      descriptionInput: document.getElementById("mobileTopicDescriptionInput")
    };
  }

  return {
    titleInput: document.getElementById("topicTitleInput"),
    descriptionInput: document.getElementById("topicDescriptionInput")
  };
}

function clearCreateInputs() {
  [
    document.getElementById("topicTitleInput"),
    document.getElementById("topicDescriptionInput"),
    document.getElementById("mobileTopicTitleInput"),
    document.getElementById("mobileTopicDescriptionInput")
  ].forEach((input) => {
    if (input) {
      input.value = "";
    }
  });
}

function isMobileViewport() {
  const previewMode = getPreviewMode();
  if (previewMode === "mobile") {
    return true;
  }
  if (previewMode === "desktop") {
    return false;
  }
  return window.matchMedia("(max-width: 960px)").matches;
}

function getPreviewMode() {
  return window.CHTREND_PREVIEW_MODE || "responsive";
}

function updateLayoutMetrics() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) {
    return;
  }

  document.documentElement.style.setProperty(
    "--topbar-offset",
    `${Math.ceil(topbar.getBoundingClientRect().height)}px`
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

bootstrap();






