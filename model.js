export function formatCommentCount(count) {
  return count === 1 ? "1 comentario" : `${count} comentarios`;
}

export function createMessage(authorId, text, minutesAgo, kind = "user", now = Date.now()) {
  return {
    id: crypto.randomUUID(),
    authorId,
    text,
    kind,
    likes: 0,
    timestamp: new Date(now - minutesAgo * 60 * 1000)
  };
}

export function buildUsers(seedUsers) {
  return seedUsers.map((user, index) => ({
    ...user,
    online: true,
    connectedOrder: index,
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
  const authorIndexById = new Map(users.map((user, index) => [user.id, index]));
  const topicAuthorPattern = [0, 1, 2, 0, 3, 0, 1, 4, 0, 5, 0, 2, 6, 0, 1, 7, 0, 8, 9, 0];
  const messageTemplates = [
    (title) => `${title} quedó abierto para coordinar sin ruido.`,
    (subtitle) => subtitle,
    (index) => `Dejo un aporte para el hilo ${index + 1}.`,
    () => "Si hace falta, lo seguimos acá mismo.",
    (index) => `Suma otro comentario para mover el ranking ${index + 1}.`,
    () => "Cierro con una nota más para variar la lista."
  ];

  return topicSeedData.map(([title, subtitle], index) => {
    const topicAuthorId = authorIds[topicAuthorPattern[index % topicAuthorPattern.length] % authorIds.length];
    const messageCount = 10;

    const minutesAgo = [48, 44, 39, 34, 29, 24, 19, 14, 9, 4];
    const messages = Array.from({ length: messageCount }, (_, messageIndex) => {
      const authorId = authorIds[(index + messageIndex) % authorIds.length];
      const textFactory = messageTemplates[messageIndex] ?? messageTemplates[messageTemplates.length - 1];
      const message = createMessage(authorId, textFactory(title, subtitle, index), minutesAgo[messageIndex] ?? 1, "user", now);
      const authorIndex = authorIndexById.get(message.authorId) ?? 0;
      message.likes = 1 + ((index * 3 + messageIndex + authorIndex) % 5);
      return message;
    });

    return {
      id: `topic-${index + 1}`,
      title,
      subtitle,
      authorId: topicAuthorId,
      visible: true,
      messages
    };
  });
}

export function getSelectedTopic(topics, selectedTopicId) {
  if (!selectedTopicId) {
    return null;
  }

  return topics.find((topic) => topic.id === selectedTopicId) ?? null;
}

export function trimMessages(messages, limit = 30) {
  return messages.length > limit ? messages.slice(-limit) : messages;
}
