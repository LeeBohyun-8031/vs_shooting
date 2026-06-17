function getRankings() {
  const savedRankings = localStorage.getItem(RANKING_KEY);

  if (!savedRankings) return [];

  try {
    const parsedRankings = JSON.parse(savedRankings);

    if (!Array.isArray(parsedRankings)) return [];

    return parsedRankings
      .filter((rank) => typeof rank.name === "string" && typeof rank.score === "number")
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  } catch {
    return [];
  }
}

function saveRankings(rankings) {
  localStorage.setItem(RANKING_KEY, JSON.stringify(rankings.slice(0, 5)));
}

function isRankableScore(currentScore) {
  if (currentScore <= 0) return false;

  const rankings = getRankings();

  if (rankings.length < 5) return true;

  const lowestTopScore = rankings[rankings.length - 1].score;

  return currentScore > lowestTopScore;
}

function saveCurrentScore() {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    alert("닉네임을 입력해주세요.");
    nicknameInput.focus();
    return;
  }

  const rankings = getRankings();

  rankings.push({
    name: nickname,
    score,
  });

  rankings.sort((a, b) => b.score - a.score);

  saveRankings(rankings);

  nicknameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");

  renderRankingList();
}

function renderRankingList() {
  const rankings = getRankings();

  rankingList.innerHTML = "";

  if (rankings.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "기록이 없습니다.";
    rankingList.appendChild(emptyItem);
    return;
  }

  rankings.forEach((rank, index) => {
    const item = document.createElement("li");

    const name = document.createElement("span");
    name.className = "rankName";
    name.textContent = `${index + 1}. ${rank.name}`;

    const scoreValue = document.createElement("span");
    scoreValue.className = "rankScore";
    scoreValue.textContent = `${rank.score}점`;

    item.appendChild(name);
    item.appendChild(scoreValue);

    rankingList.appendChild(item);
  });
}

function openRankingModal() {
  renderRankingList();
  rankingModal.classList.add("active");
}

function closeRankingModal() {
  rankingModal.classList.remove("active");
}