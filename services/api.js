import { buildUsers, buildTopics } from "../model.js";
import { initialUsers, topicSeedData } from "../data.js";

/**
 * API Service
 * Encapsulates all data fetching and persistence.
 * Transition point for future backend integration.
 */
export const api = {
  /**
   * Initial data load simulation
   */
  async fetchInitialData() {
    const users = buildUsers(initialUsers);
    const topics = buildTopics(topicSeedData, users);
    resolve({ users, topics });
  },

  /**
   * Placeholder for future message submission
   */
  async submitMessage(topicId, text) {
    // This will eventually call the backend
    return { success: true, timestamp: Date.now() };
  },

  /**
   * Placeholder for future topic creation
   */
  async createTopic(title, text) {
    // This will eventually call the backend
    return { success: true, id: `topic-${crypto.randomUUID()}` };
  }
};
