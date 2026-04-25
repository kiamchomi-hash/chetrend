export function showRankingEmpty(dom, emptyHtml) {
  if (dom.rankingsEmpty) {
    dom.rankingsEmpty.innerHTML = emptyHtml;
    dom.rankingsEmpty.hidden = false;
  }
  if (dom.drawerRankingsEmpty) {
    dom.drawerRankingsEmpty.innerHTML = emptyHtml;
    dom.drawerRankingsEmpty.hidden = false;
  }
  if (dom.rankingsBody) {
    dom.rankingsBody.classList.add("is-empty");
  }
  if (dom.drawerRankingsBody) {
    dom.drawerRankingsBody.classList.add("is-empty");
  }
  if (dom.rankingsPanel) {
    dom.rankingsPanel.classList.add("is-empty");
  }
  if (dom.drawerRankingsSection) {
    dom.drawerRankingsSection.classList.add("is-empty");
  }
  if (dom.rankingList) {
    dom.rankingList.hidden = true;
  }
  if (dom.drawerRankingList) {
    dom.drawerRankingList.hidden = true;
  }
  if (dom.rankingCarousel) {
    dom.rankingCarousel.hidden = true;
  }
  if (dom.drawerRankingSwitch) {
    dom.drawerRankingSwitch.hidden = true;
  }
  resetRankingScroll(dom);
}

export function resetRankingScroll(dom) {
  if (dom.rankingList) {
    dom.rankingList.scrollTop = 0;
  }
  if (dom.drawerRankingList) {
    dom.drawerRankingList.scrollTop = 0;
  }
}

export function showRankingList(dom) {
  if (dom.rankingsEmpty) {
    dom.rankingsEmpty.hidden = true;
  }
  if (dom.drawerRankingsEmpty) {
    dom.drawerRankingsEmpty.hidden = true;
  }
  if (dom.rankingsBody) {
    dom.rankingsBody.classList.remove("is-empty");
    dom.rankingsBody.classList.remove("is-loading");
  }
  if (dom.drawerRankingsBody) {
    dom.drawerRankingsBody.classList.remove("is-empty");
    dom.drawerRankingsBody.classList.remove("is-loading");
  }
  if (dom.rankingsPanel) {
    dom.rankingsPanel.classList.remove("is-empty");
    dom.rankingsPanel.classList.remove("is-loading");
  }
  if (dom.drawerRankingsSection) {
    dom.drawerRankingsSection.classList.remove("is-empty");
    dom.drawerRankingsSection.classList.remove("is-loading");
  }
  if (dom.rankingList) {
    dom.rankingList.hidden = false;
  }
  if (dom.drawerRankingList) {
    dom.drawerRankingList.hidden = false;
  }
  if (dom.rankingCarousel) {
    dom.rankingCarousel.hidden = false;
  }
  if (dom.drawerRankingSwitch) {
    dom.drawerRankingSwitch.hidden = false;
  }
}

export function showRankingLoading(dom) {
  if (dom.rankingsBody) {
    dom.rankingsBody.classList.add("is-loading");
  }
  if (dom.drawerRankingsBody) {
    dom.drawerRankingsBody.classList.add("is-loading");
  }
  if (dom.rankingsPanel) {
    dom.rankingsPanel.classList.add("is-loading");
  }
  if (dom.drawerRankingsSection) {
    dom.drawerRankingsSection.classList.add("is-loading");
  }
  if (dom.rankingList) {
    dom.rankingList.hidden = true;
  }
  if (dom.drawerRankingList) {
    dom.drawerRankingList.hidden = true;
  }
}
