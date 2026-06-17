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

function getPlayerHitbox(playerObject) {
  const hitboxSize = PLAYER_CONFIG.hitboxSize;

  return {
    x: playerObject.x + playerObject.width / 2 - hitboxSize / 2,
    y: playerObject.y + playerObject.height / 2 - hitboxSize / 2,
    width: hitboxSize,
    height: hitboxSize,
  };
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

function useBomb() {
  if (gameState !== "playing") return;
  if (bomb <= 0) return;

  bomb -= 1;

  enemies.forEach((enemy) => {
    createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12);
    score += Math.floor(enemy.score / 2);
  });

  enemyBullets.forEach((enemyBullet) => {
    createHitEffect(enemyBullet.x, enemyBullet.y, 3);
  });

  enemies = [];
  enemyBullets = [];

  updateGameInfo();
}