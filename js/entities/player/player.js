function createInitialPlayer() {
  return {
    x: CANVAS_WIDTH / 2 - PLAYER_CONFIG.width / 2,
    y: CANVAS_HEIGHT - 72,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    speed: PLAYER_CONFIG.speed,
    type: selectedCharacterType,

    attackPower: 1,
    powerItemCount: 0,
    shotLevel: 1,

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

function useBomb() {
  if (gameState !== "playing") return;
  if (bomb <= 0) return;

  bomb -= 1;

  playSfx("bomb");

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