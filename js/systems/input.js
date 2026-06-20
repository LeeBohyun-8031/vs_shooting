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

function isMobileControlMode() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function setMobileControlsVisible(visible) {
  if (!mobileControls) return;
  mobileControls.classList.toggle(
    "active",
    visible && gameState === "playing" && isMobileControlMode()
  );
}

function handleSelectionCardKeyDown(event, confirmSelection) {
  if (!isMobileControlMode()) return;
  if (event.code !== "Enter" && event.code !== "Space") return;
  event.preventDefault();
  confirmSelection();
}

function bindSelectionControls() {
  const selectionElements = [
    characterPrevButton,
    characterNextButton,
    characterSelectButton,
    difficultyPrevButton,
    difficultyNextButton,
    difficultySelectButton,
    difficultyGuideText,
  ];

  const updateSelectionTabOrder = () => {
    const tabIndex = isMobileControlMode() ? "0" : "-1";
    selectionElements.forEach((element) => element.setAttribute("tabindex", tabIndex));
  };

  updateSelectionTabOrder();

  characterPrevButton.addEventListener("click", () => {
    if (isMobileControlMode()) moveCharacterSelect(-1);
  });
  characterNextButton.addEventListener("click", () => {
    if (isMobileControlMode()) moveCharacterSelect(1);
  });
  characterSelectButton.addEventListener("click", () => {
    if (isMobileControlMode()) confirmCharacterSelect();
  });
  characterSelectButton.addEventListener("keydown", (event) => {
    handleSelectionCardKeyDown(event, confirmCharacterSelect);
  });

  difficultyPrevButton.addEventListener("click", () => {
    if (isMobileControlMode()) moveDifficultySelect(-1);
  });
  difficultyNextButton.addEventListener("click", () => {
    if (isMobileControlMode()) moveDifficultySelect(1);
  });
  difficultySelectButton.addEventListener("click", () => {
    if (isMobileControlMode()) confirmDifficultySelect();
  });
  difficultySelectButton.addEventListener("keydown", (event) => {
    handleSelectionCardKeyDown(event, confirmDifficultySelect);
  });

  difficultyGuideText.addEventListener("click", () => {
    if (!isMobileControlMode()) return;
    playInputSfx("select");
    openCharacterSelect();
  });

  window.addEventListener("resize", updateSelectionTabOrder);
}

function handleMobileDirectionPress(code) {
  safeUnlockSound();

  if (gameState === "characterSelect") {
    if (code === "ArrowLeft") moveCharacterSelect(-1);
    if (code === "ArrowRight") moveCharacterSelect(1);
    return;
  }

  if (gameState === "difficultySelect") {
    if (code === "ArrowLeft") moveDifficultySelect(-1);
    if (code === "ArrowRight") moveDifficultySelect(1);
    return;
  }

  if (gameState === "playing" && code in keys) keys[code] = true;
}

function handleMobileFirePress() {
  safeUnlockSound();

  if (gameState === "characterSelect") {
    confirmCharacterSelect();
    return;
  }

  if (gameState === "difficultySelect") {
    confirmDifficultySelect();
    return;
  }

  if (gameState === "playing" && stagePhase === "clear") {
    playInputSfx("confirm");
    if (typeof goToNextStageFromClear === "function") goToNextStageFromClear();
    return;
  }

  if (gameState === "playing") keys.KeyZ = true;
}

function handleMobileBombPress() {
  safeUnlockSound();

  if (gameState === "characterSelect" && characterSelectMode === "detail") {
    backToCharacterSelect();
    return;
  }

  if (gameState === "difficultySelect") {
    playInputSfx("select");
    openCharacterSelect();
    return;
  }

  if (gameState === "playing" && stagePhase === "clear") {
    playInputSfx("select");
    if (typeof finishGameFromStageClear === "function") finishGameFromStageClear();
    return;
  }

  if (gameState === "playing" && !bombPressed) {
    useBomb();
    bombPressed = true;
  }
}

function releaseMobileControl(button) {
  const code = button.dataset.key;
  const action = button.dataset.action;

  if (code && code in keys) keys[code] = false;
  if (action === "fire") keys.KeyZ = false;
  if (action === "bomb") bombPressed = false;
  button.classList.remove("pressed");
}

function bindMobileControls() {
  if (!mobileControls) return;

  mobileControls.querySelectorAll("button").forEach((button) => {
    button.addEventListener("contextmenu", (event) => event.preventDefault());
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      button.classList.add("pressed");

      const code = button.dataset.key;
      const action = button.dataset.action;

      if (code) handleMobileDirectionPress(code);
      if (action === "fire") handleMobileFirePress();
      if (action === "bomb") handleMobileBombPress();
      if (action === "pause") pauseGame();
    });

    ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
      button.addEventListener(eventName, () => releaseMobileControl(button));
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetInputState();
  });
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

function handlePauseKeyDown(event) {
  if (event.code !== "Escape") {
    return false;
  }

  event.preventDefault();

  if (gameState === "playing") {
    playInputSfx("select");
    pauseGame();
    return true;
  }

  if (gameState === "paused") {
    playInputSfx("confirm");
    resumeGame();
    return true;
  }

  return false;
}

function handleStageClearKeyDown(event) {
  if (gameState !== "playing") return false;
  if (stagePhase !== "clear") return false;

  if (event.code === "KeyZ") {
    event.preventDefault();
    playInputSfx("confirm");

    if (typeof goToNextStageFromClear === "function") {
      goToNextStageFromClear();
    }

    return true;
  }

  if (event.code === "KeyX") {
    event.preventDefault();
    playInputSfx("select");

    if (typeof finishGameFromStageClear === "function") {
      finishGameFromStageClear();
    }

    return true;
  }

  if (event.code in keys || event.code === "Enter") {
    event.preventDefault();
    return true;
  }

  return false;
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

  if (handlePauseKeyDown(event)) {
    return;
  }

  if (handleStageClearKeyDown(event)) {
    return;
  }

  if (gameState === "paused") {
    event.preventDefault();
    return;
  }

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
  bindMobileControls();
  bindSelectionControls();

  startButton.addEventListener("click", () => {
    safeUnlockSound();
    playInputSfx("gameStart");
    openCharacterSelect();
    setMobileControlsVisible(true);
  });

  restartButton.addEventListener("click", () => {
    safeUnlockSound();
    playInputSfx("confirm");
    openCharacterSelect();
    setMobileControlsVisible(true);
  });

  saveRankButton.addEventListener("click", () => {
    safeUnlockSound();
    saveCurrentScore();
  });

  rankingButton.addEventListener("click", () => {
    safeUnlockSound();
    openRankingModal();
  });

  if (resumeButton) {
    resumeButton.addEventListener("click", () => {
      safeUnlockSound();
      playInputSfx("confirm");
      resumeGame();
    });
  }

  if (pauseRestartButton) {
    pauseRestartButton.addEventListener("click", () => {
      safeUnlockSound();
      playInputSfx("gameStart");
      restartPausedGame();
    });
  }

  if (pauseMainButton) {
    pauseMainButton.addEventListener("click", () => {
      safeUnlockSound();
      playInputSfx("select");
      returnToMainFromPause();
    });
  }

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
