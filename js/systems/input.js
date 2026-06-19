function resetInputState() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });

  bombPressed = false;
}

function safeUnlockSound() {
  if (typeof unlockSound === "function") {
    unlockSound();
  }
}

function playInputSfx(type) {
  if (typeof playSfx === "function") {
    playSfx(type);
  }
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

  if (event.code === "KeyX") {
    event.preventDefault();
    playInputSfx("select");
    openCharacterSelect();
    return;
  }
}

function handleStartOrRestartKeyDown(event) {
  if (event.code !== "Enter" && event.code !== "KeyZ") {
    return false;
  }

  if (startScreen.classList.contains("active")) {
    event.preventDefault();

    playInputSfx("gameStart");
    openCharacterSelect();

    return true;
  }

  if (gameOverScreen.classList.contains("active")) {
    event.preventDefault();

    playInputSfx("confirm");
    openCharacterSelect();

    return true;
  }

  return false;
}

function handleKeyDown(event) {
  safeUnlockSound();

  if (gameState === "characterSelect") {
    handleCharacterSelectKeyDown(event);
    return;
  }

  if (gameState === "difficultySelect") {
    handleDifficultySelectKeyDown(event);
    return;
  }

  if (handleStartOrRestartKeyDown(event)) {
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
    if (nicknameScreen.classList.contains("active")) {
      event.preventDefault();
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

  startButton.addEventListener("click", () => {
    safeUnlockSound();
    playInputSfx("gameStart");
    openCharacterSelect();
  });

  restartButton.addEventListener("click", () => {
    safeUnlockSound();
    playInputSfx("confirm");
    openCharacterSelect();
  });

  saveRankButton.addEventListener("click", () => {
    safeUnlockSound();
    saveCurrentScore();
  });

  rankingButton.addEventListener("click", () => {
    safeUnlockSound();
    openRankingModal();
  });

  if (soundToggleButton) {
    soundToggleButton.addEventListener("click", () => {
      safeUnlockSound();

      if (typeof toggleSound === "function") {
        toggleSound();
      }
    });
  }

  closeRankingButton.addEventListener("click", closeRankingModal);

  rankingModal.addEventListener("click", (event) => {
    if (event.target === rankingModal) {
      closeRankingModal();
    }
  });
}