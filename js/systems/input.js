function resetInputState() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });

  bombPressed = false;

  if (typeof resetMobileCanvasGesture === "function") {
    resetMobileCanvasGesture();
  }
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

let activeCanvasPointerId = null;
let bombTouchPointerId = null;
let canvasTouchLastX = 0;
let canvasTouchLastY = 0;
let twoFingerBombTriggered = false;

function resetMobileCanvasGesture() {
  keys.KeyZ = false;
  activeCanvasPointerId = null;
  bombTouchPointerId = null;
  twoFingerBombTriggered = false;
}

function releaseMobileCanvasTouch(event) {
  if (event.pointerId === bombTouchPointerId) {
    bombTouchPointerId = null;
    twoFingerBombTriggered = false;
    return;
  }

  if (event.pointerId !== activeCanvasPointerId) return;

  keys.KeyZ = false;
  activeCanvasPointerId = null;
  bombTouchPointerId = null;
  twoFingerBombTriggered = false;
}

function bindMobileCanvasControls() {
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || gameState !== "playing") return;

    event.preventDefault();
    safeUnlockSound();

    if (stagePhase === "clear") {
      const rect = canvas.getBoundingClientRect();
      const canvasX = (event.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
      const canvasY = (event.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
      const action =
        typeof getStageClearTouchActionAt === "function"
          ? getStageClearTouchActionAt(canvasX, canvasY)
          : null;

      if (action === "next") {
        playInputSfx("confirm");
        if (typeof goToNextStageFromClear === "function") goToNextStageFromClear();
      }

      if (action === "exit") {
        playInputSfx("select");
        if (typeof finishGameFromStageClear === "function") finishGameFromStageClear();
      }

      return;
    }

    if (stagePhase === "gameClear") {
      playInputSfx("confirm");
      if (typeof finishGameClearFromTouch === "function") finishGameClearFromTouch();
      return;
    }

    if (activeCanvasPointerId !== null) {
      if (!twoFingerBombTriggered) {
        useBomb();
        twoFingerBombTriggered = true;
        bombTouchPointerId = event.pointerId;
        canvas.setPointerCapture(event.pointerId);
      }

      return;
    }

    activeCanvasPointerId = event.pointerId;
    canvasTouchLastX = event.clientX;
    canvasTouchLastY = event.clientY;
    twoFingerBombTriggered = false;

    canvas.setPointerCapture(event.pointerId);
    keys.KeyZ = true;
    shootBullet();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activeCanvasPointerId || !player || gameState !== "playing") return;

    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const deltaX = event.clientX - canvasTouchLastX;
    const deltaY = event.clientY - canvasTouchLastY;

    canvasTouchLastX = event.clientX;
    canvasTouchLastY = event.clientY;

    player.x = clamp(
      player.x + deltaX * (CANVAS_WIDTH / rect.width),
      0,
      CANVAS_WIDTH - player.width
    );
    player.y = clamp(
      player.y + deltaY * (CANVAS_HEIGHT / rect.height),
      0,
      CANVAS_HEIGHT - player.height
    );
  });

  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
    canvas.addEventListener(eventName, releaseMobileCanvasTouch);
  });
}

function bindMobileControls() {
  if (!mobileControls) return;

  mobileControls.querySelectorAll("button").forEach((button) => {
    button.addEventListener("contextmenu", (event) => event.preventDefault());
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      button.classList.add("pressed");

      const action = button.dataset.action;

      if (action === "pause") pauseGame();
    });

    ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
      button.addEventListener(eventName, () => button.classList.remove("pressed"));
    });
  });

  const pauseForMobileInterruption = () => {
    resetInputState();

    if (!isMobileControlMode()) return;

    if (gameState === "playing") {
      pauseGame();
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseForMobileInterruption();
  });

  window.addEventListener("pagehide", pauseForMobileInterruption);

  window.addEventListener("orientationchange", () => {
    resetMobileCanvasGesture();

    window.setTimeout(() => {
      if (isMobileControlMode() && window.innerWidth > window.innerHeight) {
        pauseForMobileInterruption();
      }
    }, 120);
  });
}

function bindMobileKeyboardLayout() {
  const updateViewportHeight = () => {
    const viewportHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

    document.documentElement.style.setProperty(
      "--mobile-viewport-height",
      `${Math.round(viewportHeight)}px`
    );
  };

  const openKeyboardLayout = () => {
    if (!isMobileControlMode()) return;
    document.body.classList.add("mobile-keyboard-open");
    updateViewportHeight();
  };

  const closeKeyboardLayout = () => {
    document.body.classList.remove("mobile-keyboard-open");
    updateViewportHeight();
  };

  nicknameInput.addEventListener("focus", openKeyboardLayout);
  nicknameInput.addEventListener("blur", closeKeyboardLayout);
  window.addEventListener("resize", updateViewportHeight);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportHeight);
  }

  updateViewportHeight();
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
  bindMobileCanvasControls();
  bindMobileKeyboardLayout();
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
