export function formatCommentCount(count) {
  return count === 1 ? "1 comentario" : `${count} comentarios`;
}

export function createMessage(authorId, text, minutesAgo, kind = "user", now = Date.now()) {
  return {
    id: crypto.randomUUID(),
    authorId,
    text,
    kind,
    timestamp: new Date(now - minutesAgo * 60 * 1000)
  };
}

export function buildUsers(seedUsers) {
  return seedUsers.map((user, index) => ({
    ...user,
    online: index < 6,
    initials: user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }));
}

export function buildTopics(topicSeedData, users, now = Date.now()) {
  const authorIds = users.map((user) => user.id);

  return topicSeedData.map(([title, subtitle], index) => ({
    id: `topic-${index + 1}`,
    title,
    subtitle,
    visible: true,
    messages: [
      createMessage(authorIds[index % authorIds.length], `${title} quedó abierto para coordinar sin ruido.`, 48, "user", now),
      createMessage(authorIds[(index + 1) % authorIds.length], subtitle, 34, "user", now),
      createMessage(authorIds[(index + 2) % authorIds.length], `Dejo un aporte para el hilo ${index + 1}.`, 21, "user", now),
      createMessage(authorIds[(index + 3) % authorIds.length], `Si hace falta, lo seguimos acá mismo.`, 8, "user", now)
    ]
  }));
}

export function getSelectedTopic(topics, selectedTopicId) {
  return topics.find((topic) => topic.id === selectedTopicId) ?? topics[0] ?? null;
}

export function trimMessages(messages, limit = 30) {
  return messages.length > limit ? messages.slice(-limit) : messages;
}

function countMessagesByAuthor(messages) {
  const counts = new Map();
  messages.forEach((message) => {
    if (message.kind !== "user") {
      return;
    }
    counts.set(message.authorId, (counts.get(message.authorId) ?? 0) + 1);
  });
  return counts;
}

function buildRankingEntries(counts, users, currentUserId, emptyTitle, emptyMeta, limit = Infinity) {
  const entries = [...counts.entries()]
    .map(([authorId, count]) => ({
      id: authorId,
      title: users.find((user) => user.id === authorId)?.name ?? "Anónimo",
      meta: formatCommentCount(count),
      count,
      active: authorId === currentUserId
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  if (!entries.length) {
    return [
      {
        id: "empty",
        title: emptyTitle,
        meta: emptyMeta,
        active: false
      }
    ];
  }

  return entries;
}

export function buildGlobalRankingEntries(topics, users, currentUserId) {
  const counts = new Map();

  topics.forEach((topic) => {
    countMessagesByAuthor(topic.messages).forEach((count, authorId) => {
      counts.set(authorId, (counts.get(authorId) ?? 0) + count);
    });
  });

  return buildRankingEntries(counts, users, currentUserId, "Sin actividad", "Todavía no hay participación.", 3);
}

export function buildTopicRankingEntries(topic, users, currentUserId) {
  const counts = countMessagesByAuthor(topic.messages);
  return buildRankingEntries(
    counts,
    users,
    currentUserId,
    "Sin actividad",
    "Todavía no hay participación en este tema."
  );
}
