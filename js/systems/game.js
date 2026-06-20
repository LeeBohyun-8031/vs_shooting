function createStars() {
  stars = [];

  for (let i = 0; i < 80; i += 1) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1.5 + 0.5,
    });
  }
}

function resetGame() {
  const difficulty = getSelectedDifficultyConfig();

  score = 0;
  life = difficulty.initialLife;
  bomb = difficulty.initialBomb;

  player = createInitialPlayer();
  bullets = [];
  enemies = [];
  enemyBullets = [];
  items = [];
  particles = [];

  lastShotTime = 0;
  lastEnemySpawnTime = 0;
  bombPressed = false;
  pausedStartTime = 0;

  deathAnimationStartTime = 0;
  deathAnimationX = 0;
  deathAnimationY = 0;

  if (typeof resetItems === "function") {
    resetItems();
  }

  if (typeof resetStageState === "function") {
    resetStageState();
  }

  updateGameInfo();
}

function startGame() {
  resetInputState();
  resetGame();

  gameState = "playing";
  setMobileControlsVisible(true);

  hidePauseScreen();

  if (typeof startStage === "function") {
    startStage(0);
  }

  startScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  difficultyScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.add("hidden");

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (gameState !== "playing") return;

  gameState = "paused";
  setMobileControlsVisible(false);
  pausedStartTime = performance.now();

  resetInputState();

  cancelAnimationFrame(animationId);

  if (pauseScreen) {
    pauseScreen.classList.add("active");
  }
}

function resumeGame() {
  if (gameState !== "paused") return;

  const pauseDuration = performance.now() - pausedStartTime;

  if (typeof applyStagePauseDuration === "function") {
    applyStagePauseDuration(pauseDuration);
  }

  pausedStartTime = 0;
  gameState = "playing";
  setMobileControlsVisible(true);

  resetInputState();

  hidePauseScreen();

  lastEnemySpawnTime = performance.now();
  lastShotTime = Date.now();

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function restartPausedGame() {
  if (gameState !== "paused") return;

  hidePauseScreen();

  resetInputState();
  resetGame();

  gameState = "playing";
  setMobileControlsVisible(true);

  if (typeof startStage === "function") {
    startStage(0);
  }

  rankingButton.classList.add("hidden");

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function returnToMainFromPause() {
  if (gameState !== "paused") return;

  hidePauseScreen();

  cancelAnimationFrame(animationId);
  resetInputState();
  resetGame();

  gameState = "ready";
  setMobileControlsVisible(false);

  startScreen.classList.add("active");
  characterScreen.classList.remove("active");
  difficultyScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.remove("hidden");

  draw();
}

function hidePauseScreen() {
  if (!pauseScreen) return;

  pauseScreen.classList.remove("active");
}

function endGame(forceNickname = false) {
  gameState = "gameOver";
  setMobileControlsVisible(false);
  cancelAnimationFrame(animationId);

  hidePauseScreen();

  finalScoreText.textContent = score;
  rankingButton.classList.remove("hidden");

  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  if (forceNickname || isRankableScore(score)) {
    nicknameInput.value = "";
    nicknameScreen.classList.add("active");
    nicknameInput.focus();
    return;
  }

  gameOverScreen.classList.add("active");
}

function updateGameInfo() {
  scoreText.textContent = score;
  lifeText.textContent = life;
  bombText.textContent = bomb;
}

function gameLoop(timestamp) {
  if (gameState !== "playing" && gameState !== "dying") return;

  if (gameState === "playing") {
    update(timestamp);
  }

  if (gameState === "dying") {
    updateDeathAnimation();
  }

  draw();

  if (gameState === "playing" || gameState === "dying") {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function update(timestamp) {
  updateStars();

  if (typeof updateStage === "function") {
    updateStage(timestamp);
  }

  if (typeof updateBossSystem === "function") {
    updateBossSystem(timestamp);
  }

  updatePlayer();
  updateBullets();
  updateEnemies(timestamp);
  updateEnemyAttacks();
  updateEnemyBullets();

  if (typeof updateItems === "function") {
    updateItems();
  }

  if (gameState !== "playing") {
    updateParticles();
    updateGameInfo();
    return;
  }

  updateParticles();

  checkBulletEnemyCollision();

  if (typeof checkBulletBossCollision === "function") {
    checkBulletBossCollision();
  }

  checkPlayerEnemyCollision();

  if (typeof checkPlayerBossCollision === "function") {
    checkPlayerBossCollision();
  }

  checkPlayerEnemyBulletCollision();

  updateGameInfo();
}

function updateStars() {
  stars.forEach((star) => {
    star.y += star.speed;

    if (star.y > CANVAS_HEIGHT) {
      star.x = Math.random() * CANVAS_WIDTH;
      star.y = -star.size;
    }
  });
}

function initGame() {
  bindEvents();
  createStars();
  resetGame();
  renderRankingList();
  draw();
}

initGame();
