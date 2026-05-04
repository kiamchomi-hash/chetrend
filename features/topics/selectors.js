import { getUserNameById } from "../shared/entities.js";

export function selectTopicsViewModel(state) {
  const items = state.topics.allIds.slice(0, 20).map((id) => {
    const topic = state.topics.byId[id];
    const userMessages = topic.messages.filter((message) => message.kind === "user");
    const lastComment = [...userMessages].reverse()[0] ?? null;
    const lastCommenterName = lastComment
      ? getUserNameById(state.users, lastComment.authorId)
      : "Sin actividad";

    return {
      id: topic.id,
      title: topic.title,
      meta: `${userMessages.length}, ${lastCommenterName}`,
      selected: topic.id === state.selectedTopicId
    };
  });

  return {
    isLoading: state.topics.allIds.length === 0,
    items
  };
}
