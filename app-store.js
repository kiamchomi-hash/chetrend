export const state = {
  theme: "light",
  selectedTopicId: "topic-1",
  rankingMode: "global",
  refreshCount: 0,
  mobileView: "browse",
  currentUserId: "u1",
  topics: [],
  users: []
};

export const dom = {
  shell: null,
  topbar: null,
  themeToggle: null,
  refreshButton: null,
  messageForm: null,
  rankingPrev: null,
  rankingNext: null,
  drawerRankingPrev: null,
  drawerRankingNext: null,
  openRightDrawer: null,
  drawerBackdrop: null,
  profileButton: null,
  backToTopics: null,
  contactAdminButton: null,
  storeButton: null,
  paletteButton: null,
  refreshState: null,
  chatTopicName: null,
  chatTopicDescription: null,
  rankingsTitle: null,
  drawerRankingsTitle: null,
  messageInput: null,
  messageStream: null,
  topicList: null,
  leftDrawerTopics: null,
  userList: null,
  drawerUserList: null,
  rankingList: null,
  drawerRankingList: null,
  leftDrawer: null,
  rightDrawer: null,
  drawerCloseButtons: []
};

export const closeTimerRef = { current: 0 };
