function resetInputState() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });

  bombPressed = false;
}

function handleCharacterSelectKeyDown(event) {
  if (event.code === "ArrowLeft") {
    event.preventDefault();
    moveCharacterSelect(-1);
    return;
  }

  if (event.code === "ArrowRight") {
    event.preventDefault();
    moveCharacterSelect(1);
    return;
  }

  if (event.code === "KeyZ") {
    event.preventDefault();
    confirmCharacterSelect();
    return;
  }

  if (event.code === "KeyX") {
    event.preventDefault();

    if (characterSelectMode === "detail") {
      backToCharacterSelect();
    }

    return;
  }
}

function handleDifficultySelectKeyDown(event) {
  if (event.code === "ArrowLeft") {
    event.preventDefault();
    moveDifficultySelect(-1);
    return;
  }

  if (event.code === "ArrowRight") {
    event.preventDefault();
    moveDifficultySelect(1);
    return;
  }

  if (event.code === "KeyZ") {
    event.preventDefault();
    confirmDifficultySelect();
    return;
  }
}

function handleKeyDown(event) {
  if (gameState === "characterSelect") {
    handleCharacterSelectKeyDown(event);
    return;
  }

  if (gameState === "difficultySelect") {
    handleDifficultySelectKeyDown(event);
    return;
  }

  if (event.code in keys) {
    keys[event.code] = true;
    event.preventDefault();
  }

  if (event.code === "KeyX") {
    event.preventDefault();

    if (!bombPressed) {
      useBomb();
      bombPressed = true;
    }
  }

  if (event.code === "Enter") {
    if (startScreen.classList.contains("active")) {
      openCharacterSelect();
      return;
    }

    if (gameOverScreen.classList.contains("active")) {
      openCharacterSelect();
      return;
    }

    if (nicknameScreen.classList.contains("active")) {
      saveCurrentScore();
    }
  }
}

function handleKeyUp(event) {
  if (event.code in keys) {
    keys[event.code] = false;
    event.preventDefault();
  }

  if (event.code === "KeyX") {
    bombPressed = false;
    event.preventDefault();
  }
}

function bindEvents() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  startButton.addEventListener("click", openCharacterSelect);
  restartButton.addEventListener("click", openCharacterSelect);
  saveRankButton.addEventListener("click", saveCurrentScore);

  rankingButton.addEventListener("click", openRankingModal);
  closeRankingButton.addEventListener("click", closeRankingModal);

  rankingModal.addEventListener("click", (event) => {
    if (event.target === rankingModal) {
      closeRankingModal();
    }
  });
}