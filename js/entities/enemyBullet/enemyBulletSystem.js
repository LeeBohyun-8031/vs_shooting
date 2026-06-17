function updateEnemyAttacks() {
  enemies.forEach((enemy) => {
    updateEnemyShotReadiness(enemy);

    if (!canEnemyShoot(enemy)) return;

    enemy.shotTimer += 1;

    const difficulty = getSelectedDifficultyConfig();
    const shotCooldown = Math.max(
      enemy.shotCooldown / difficulty.enemyBulletRateMultiplier,
      1
    );

    if (enemy.shotTimer < shotCooldown) return;

    enemy.shotTimer = 0;
    enemy.shotCount += 1;

    fireEnemyShotPattern(enemy);
  });
}

function updateEnemyShotReadiness(enemy) {
  if (!isEnemyReadyToCountShotDelay(enemy)) {
    enemy.visibleShotAge = 0;
    return;
  }

  enemy.visibleShotAge = (enemy.visibleShotAge || 0) + 1;
}

function isEnemyReadyToCountShotDelay(enemy) {
  if (!isEnemyVisibleForShooting(enemy)) {
    return false;
  }

  if (enemy.onlyShootOnWait && enemy.state !== "wait") {
    return false;
  }

  return true;
}

function canEnemyShoot(enemy) {
  if (!enemy.shotPattern) return false;
  if (enemy.shotCount >= enemy.shotLimit) return false;

  if (!isEnemyReadyToCountShotDelay(enemy)) {
    return false;
  }

  if ((enemy.visibleShotAge || 0) < enemy.shotDelay) {
    return false;
  }

  return true;
}

function fireEnemyShotPattern(enemy) {
  if (enemy.shotPattern === "down") {
    shootEnemyBulletDown(enemy);
    return;
  }

  if (enemy.shotPattern === "aimed") {
    shootAimedEnemyBullet(enemy);
    return;
  }

  if (enemy.shotPattern === "spread") {
    shootSpreadEnemyBullets(enemy);
    return;
  }

  if (enemy.shotPattern === "circle") {
    shootCircleEnemyBullets(enemy);
    return;
  }

  if (enemy.shotPattern === "wideRain") {
    shootWideRainBullets(enemy);
    return;
  }

  if (enemy.shotPattern === "curtain") {
    shootCurtainBullets(enemy);
    return;
  }

  if (enemy.shotPattern === "sideFan") {
    shootSideFanBullets(enemy);
    return;
  }

  if (enemy.shotPattern === "randomAimedRain") {
    shootRandomAimedRainBullets(enemy);
    return;
  }

  shootEnemyBulletDown(enemy);
}

function updateEnemyBullets() {
  enemyBullets = enemyBullets.filter((enemyBullet) => {
    enemyBullet.x += enemyBullet.vx;
    enemyBullet.y += enemyBullet.vy;
    enemyBullet.age += 1;

    return !isEnemyBulletOutOfScreen(enemyBullet);
  });
}

function isEnemyBulletOutOfScreen(enemyBullet) {
  const margin = 40;

  return (
    enemyBullet.x < -margin ||
    enemyBullet.x > CANVAS_WIDTH + margin ||
    enemyBullet.y < -margin ||
    enemyBullet.y > CANVAS_HEIGHT + margin
  );
}

function checkPlayerEnemyBulletCollision() {
  if (!player || player.invincibleTime > 0) return;

  const playerHitbox = getPlayerHitbox(player);

  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    const enemyBullet = enemyBullets[i];
    const enemyBulletHitbox = getEnemyBulletHitbox(enemyBullet);

    if (!isColliding(playerHitbox, enemyBulletHitbox)) continue;

    enemyBullets.splice(i, 1);
    life -= 1;

    createHitEffect(
      playerHitbox.x + playerHitbox.width / 2,
      playerHitbox.y + playerHitbox.height / 2,
      12
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