export function getUserNameById(users, userId, fallback = "Anonimo") {
  if (users.byId && users.byId[userId]) {
    return users.byId[userId].name;
  }
  
  // Fallback for cases where users might be passed as array (legacy or specific components)
  if (Array.isArray(users)) {
    return users.find((user) => user.id === userId)?.name ?? fallback;
  }
  
  return fallback;
}

export function formatMessageTime(timestamp, locale = "es-AR") {
  return timestamp.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit"
  });
}
