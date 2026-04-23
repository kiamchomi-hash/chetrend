function setEmptySizing(emptyEl, bodyEl) {
  if (!emptyEl || !bodyEl) {
    return;
  }

  const bodyRect = bodyEl.getBoundingClientRect();
  const styles = getComputedStyle(bodyEl);
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const availableHeight = Math.max(0, Math.round(bodyRect.height - paddingTop - paddingBottom));

  emptyEl.style.minHeight = `${availableHeight}px`;
  emptyEl.style.height = `${availableHeight}px`;
  emptyEl.style.flex = "0 0 auto";
}

function clearEmptySizing(emptyEl) {
  if (!emptyEl) {
    return;
  }

  emptyEl.style.minHeight = "";
  emptyEl.style.height = "";
  emptyEl.style.flex = "";
}

export function resetRankingScroll(dom) {
  if (dom.rankingList) {
    dom.rankingList.scrollTop = 0;
  }
  if (dom.drawerRankingList) {
    dom.drawerRankingList.scrollTop = 0;
  }
}

export function showRankingEmpty(dom, emptyHtml) {
  if (dom.rankingsEmpty) {
    dom.rankingsEmpty.innerHTML = emptyHtml;
    dom.rankingsEmpty.hidden = false;
    setEmptySizing(dom.rankingsEmpty, dom.rankingsBody);
  }
  if (dom.drawerRankingsEmpty) {
    dom.drawerRankingsEmpty.innerHTML = emptyHtml;
    dom.drawerRankingsEmpty.hidden = false;
    setEmptySizing(dom.drawerRankingsEmpty, dom.drawerRankingsBody);
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

export function showRankingList(dom) {
  if (dom.rankingsEmpty) {
    dom.rankingsEmpty.hidden = true;
    clearEmptySizing(dom.rankingsEmpty);
  }
  if (dom.drawerRankingsEmpty) {
    dom.drawerRankingsEmpty.hidden = true;
    clearEmptySizing(dom.drawerRankingsEmpty);
  }
  if (dom.rankingsBody) {
    dom.rankingsBody.classList.remove("is-empty");
  }
  if (dom.drawerRankingsBody) {
    dom.drawerRankingsBody.classList.remove("is-empty");
  }
  if (dom.rankingsPanel) {
    dom.rankingsPanel.classList.remove("is-empty");
  }
  if (dom.drawerRankingsSection) {
    dom.drawerRankingsSection.classList.remove("is-empty");
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
