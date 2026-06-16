function createInitialPlayer() {
  return {
    x: CANVAS_WIDTH / 2 - PLAYER_CONFIG.width / 2,
    y: CANVAS_HEIGHT - 72,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    speed: PLAYER_CONFIG.speed,
    type: selectedCharacterType,
    invincibleTime: 0,
  };
}

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

function resetInputState() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });

  bombPressed = false;
}

function resetGame() {
  score = 0;
  life = INITIAL_LIFE;
  bomb = INITIAL_BOMB;

  player = createInitialPlayer();
  bullets = [];
  enemies = [];
  particles = [];

  lastShotTime = 0;
  lastEnemySpawnTime = 0;
  bombPressed = false;

  deathAnimationStartTime = 0;
  deathAnimationX = 0;
  deathAnimationY = 0;

  updateGameInfo();
}

function openCharacterSelect() {
  gameState = "characterSelect";
  characterSelectMode = "select";

  cancelAnimationFrame(animationId);
  resetInputState();

  startScreen.classList.remove("active");
  characterScreen.classList.add("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.remove("hidden");

  updateCharacterSelectUI();
}

function updateCharacterSelectUI() {
  const character = CHARACTER_CONFIGS[selectedCharacterIndex];

  selectedCharacterType = character.type;
  characterImageText.textContent = character.imageText;
  characterNameText.textContent = character.name;
  characterDescriptionText.textContent = character.description;

  if (characterSelectMode === "select") {
    characterDescriptionBox.classList.remove("active");
    characterGuideText.textContent = "Z : 설명 보기";
  }

  if (characterSelectMode === "detail") {
    characterDescriptionBox.classList.add("active");
    characterGuideText.textContent = "Z : 선택 / X : 돌아가기";
  }
}

function moveCharacterSelect(direction) {
  if (characterSelectMode !== "select") return;

  selectedCharacterIndex += direction;

  if (selectedCharacterIndex < 0) {
    selectedCharacterIndex = CHARACTER_CONFIGS.length - 1;
  }

  if (selectedCharacterIndex >= CHARACTER_CONFIGS.length) {
    selectedCharacterIndex = 0;
  }

  updateCharacterSelectUI();
}

function showCharacterDetail() {
  characterSelectMode = "detail";
  updateCharacterSelectUI();
}

function backToCharacterSelect() {
  characterSelectMode = "select";
  updateCharacterSelectUI();
}

function confirmCharacterSelect() {
  if (characterSelectMode === "select") {
    showCharacterDetail();
    return;
  }

  if (characterSelectMode === "detail") {
    startGame();
  }
}

function startGame() {
  resetInputState();
  resetGame();

  gameState = "playing";

  startScreen.classList.remove("active");
  characterScreen.classList.remove("active");
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

  if (gameState !== "playing") {
    updateParticles();
    updateGameInfo();
    return;
  }

  updateParticles();

  checkBulletEnemyCollision();
  checkPlayerEnemyCollision();

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

function updatePlayer() {
  if (!player) return;

  if (keys.ArrowUp) player.y -= player.speed;
  if (keys.ArrowDown) player.y += player.speed;
  if (keys.ArrowLeft) player.x -= player.speed;
  if (keys.ArrowRight) player.x += player.speed;

  player.x = clamp(player.x, 0, CANVAS_WIDTH - player.width);
  player.y = clamp(player.y, 0, CANVAS_HEIGHT - player.height);

  if (keys.KeyZ) {
    shootBullet();
  }

  if (player.invincibleTime > 0) {
    player.invincibleTime -= 1;
  }
}

function shootBullet() {
  if (!player) return;

  const now = Date.now();

  if (now - lastShotTime < SHOT_COOLDOWN) return;

  bullets.push({
    x: player.x + player.width / 2 - BULLET_CONFIG.width / 2,
    y: player.y - 12,
    width: BULLET_CONFIG.width,
    height: BULLET_CONFIG.height,
    speed: BULLET_CONFIG.speed,
  });

  lastShotTime = now;
}

function updateBullets() {
  bullets = bullets.filter((bullet) => {
    bullet.y -= bullet.speed;
    return bullet.y + bullet.height > 0;
  });
}

function spawnEnemy() {
  const size = randomInt(ENEMY_CONFIG.minSize, ENEMY_CONFIG.maxSize);

  enemies.push({
    x: randomInt(0, CANVAS_WIDTH - size),
    y: -size,
    width: size,
    height: size,
    speed: Math.random() * ENEMY_CONFIG.maxAdditionalSpeed + ENEMY_CONFIG.minSpeed,
    hp: size >= 38 ? 2 : 1,
    score: size >= 38 ? 30 : 10,
  });
}

function updateEnemies(timestamp) {
  if (timestamp - lastEnemySpawnTime > ENEMY_SPAWN_COOLDOWN) {
    spawnEnemy();
    lastEnemySpawnTime = timestamp;
  }

  enemies = enemies.filter((enemy) => {
    if (gameState !== "playing") return true;

    enemy.y += enemy.speed;

    if (enemy.y > CANVAS_HEIGHT) {
      return false;
    }

    return true;
  });
}

function useBomb() {
  if (gameState !== "playing") return;
  if (bomb <= 0) return;

  bomb -= 1;

  enemies.forEach((enemy) => {
    createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12);
    score += Math.floor(enemy.score / 2);
  });

  enemies = [];
  updateGameInfo();
}

function checkBulletEnemyCollision() {
  for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = bullets[bulletIndex];

    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = enemies[enemyIndex];

      if (!isColliding(bullet, enemy)) continue;

      bullets.splice(bulletIndex, 1);
      enemy.hp -= 1;

      createHitEffect(
        bullet.x + bullet.width / 2,
        bullet.y,
        5
      );

      if (enemy.hp <= 0) {
        score += enemy.score;
        createExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          10
        );
        enemies.splice(enemyIndex, 1);
      }

      break;
    }
  }
}

function checkPlayerEnemyCollision() {
  if (!player || player.invincibleTime > 0) return;

  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];

    if (!isColliding(player, enemy)) continue;

    enemies.splice(i, 1);
    life -= 1;

    createExplosion(
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height / 2,
      14
    );

    if (life <= 0) {
      life = 0;
      startPlayerDeath();
      break;
    }

    player.invincibleTime = PLAYER_CONFIG.invincibleFrame;
    break;
  }
}

function startPlayerDeath() {
  if (gameState === "dying" || gameState === "gameOver") return;

  gameState = "dying";
  life = 0;
  updateGameInfo();

  deathAnimationStartTime = performance.now();

  deathAnimationX = player
    ? player.x + player.width / 2
    : CANVAS_WIDTH / 2;

  deathAnimationY = player
    ? player.y + player.height / 2
    : CANVAS_HEIGHT - 72;

  createPlayerDeathEffect(deathAnimationX, deathAnimationY);

  player = null;
}

function createPlayerDeathEffect(x, y) {
  for (let i = 0; i < PLAYER_DEATH_PARTICLE_COUNT; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 3 + 2,
      vx: Math.random() * 9 - 4.5,
      vy: Math.random() * 9 - 4.5,
      life: 40,
      color: Math.random() > 0.5 ? "#38bdf8" : "#f97316",
    });
  }
}

function updateDeathAnimation() {
  updateParticles();

  const elapsedTime = performance.now() - deathAnimationStartTime;

  if (elapsedTime >= PLAYER_DEATH_ANIMATION_DURATION) {
    endGame();
  }
}

function drawPlayerDeathAnimation() {
  if (gameState !== "dying") return;

  const elapsedTime = performance.now() - deathAnimationStartTime;
  const progress = Math.min(elapsedTime / PLAYER_DEATH_ANIMATION_DURATION, 1);

  const outerRadius = 12 + progress * 90;
  const innerRadius = 4 + progress * 42;
  const alpha = 1 - progress;

  ctx.save();

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(deathAnimationX, deathAnimationY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.8;
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(deathAnimationX, deathAnimationY, innerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.7;
  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.arc(deathAnimationX, deathAnimationY, 10 + progress * 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function createHitEffect(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 2 + 1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      life: 18,
      color: "#7dd3fc",
    });
  }
}

function createExplosion(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 3 + 2,
      vx: Math.random() * 7 - 3.5,
      vy: Math.random() * 7 - 3.5,
      life: 28,
      color: Math.random() > 0.5 ? "#facc15" : "#fb7185",
    });
  }
}

function updateParticles() {
  particles = particles.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 1;
    return particle.life > 0;
  });
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();
  drawBullets();
  drawEnemies();
  drawPlayer();
  drawParticles();
  drawPlayerDeathAnimation();
}

function drawBackground() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  stars.forEach((star) => {
    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer() {
  if (!player) return;

  if (player.invincibleTime > 0 && Math.floor(player.invincibleTime / 6) % 2 === 0) {
    return;
  }

  const centerX = player.x + player.width / 2;

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(centerX, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.moveTo(centerX, player.y + 8);
  ctx.lineTo(centerX - 8, player.y + player.height - 6);
  ctx.lineTo(centerX + 8, player.y + player.height - 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(centerX - 8, player.y + player.height);
  ctx.lineTo(centerX, player.y + player.height + 12);
  ctx.lineTo(centerX + 8, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.fillStyle = "#facc15";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    ctx.fillRect(bullet.x - 3, bullet.y + 4, bullet.width + 6, bullet.height);
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;

    ctx.fillStyle = enemy.hp >= 2 ? "#a855f7" : "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, enemy.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(centerX - enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
    ctx.arc(centerX + enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, enemy.width / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(particle.life / 40, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
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

function handleKeyDown(event) {
  if (gameState === "characterSelect") {
    handleCharacterSelectKeyDown(event);
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

function initGame() {
  bindEvents();
  createStars();
  resetGame();
  renderRankingList();
  draw();
}

initGame();