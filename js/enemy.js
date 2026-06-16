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

function getEnemySpawnCooldown() {
  const difficulty = getSelectedDifficultyConfig();

  return ENEMY_SPAWN_COOLDOWN / difficulty.enemySpawnRateMultiplier;
}

function updateEnemies(timestamp) {
  if (timestamp - lastEnemySpawnTime > getEnemySpawnCooldown()) {
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