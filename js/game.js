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
  particles = [];

  lastShotTime = 0;
  lastEnemySpawnTime = 0;
  bombPressed = false;

  deathAnimationStartTime = 0;
  deathAnimationX = 0;
  deathAnimationY = 0;

  updateGameInfo();
}

function startGame() {
  resetInputState();
  resetGame();

  gameState = "playing";

  startScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  difficultyScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.add("hidden");

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameState = "gameOver";
  cancelAnimationFrame(animationId);

  finalScoreText.textContent = score;
  rankingButton.classList.remove("hidden");

  if (isRankableScore(score)) {
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
  updatePlayer();
  updateBullets();
  updateEnemies(timestamp);
  updateEnemyAttacks();
  updateEnemyBullets();

  if (gameState !== "playing") {
    updateParticles();
    updateGameInfo();
    return;
  }

  updateParticles();

  checkBulletEnemyCollision();
  checkPlayerEnemyCollision();
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