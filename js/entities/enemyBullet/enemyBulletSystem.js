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
  const nextEnemyBullets = [];

  enemyBullets.forEach((enemyBullet) => {
    enemyBullet.x += enemyBullet.vx;
    enemyBullet.y += enemyBullet.vy;
    enemyBullet.age += 1;

    if (shouldSplitEnemyBullet(enemyBullet)) {
      enemyBullet.hasSplit = true;
      createSplitEnemyBullets(enemyBullet, nextEnemyBullets);

      if (enemyBullet.split.removeParent) {
        return;
      }
    }

    if (!isEnemyBulletOutOfScreen(enemyBullet)) {
      nextEnemyBullets.push(enemyBullet);
    }
  });

  enemyBullets = nextEnemyBullets;
}

function shouldSplitEnemyBullet(enemyBullet) {
  if (!enemyBullet.split) return false;
  if (enemyBullet.hasSplit) return false;

  return enemyBullet.age >= enemyBullet.split.delay;
}

function createSplitEnemyBullets(parentBullet, targetBullets) {
  const split = parentBullet.split;
  const angles = getSplitEnemyBulletAngles(parentBullet, split);

  angles.forEach((angle) => {
    const speed = split.speed;

    targetBullets.push({
      x: parentBullet.x,
      y: parentBullet.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: split.radius,
      hitboxSize: split.hitboxSize,
      color: split.color,
      glowColor: split.glowColor,
      age: 0,

      split: null,
      hasSplit: false,
    });
  });

  createHitEffect(parentBullet.x, parentBullet.y, 6);
}

function getSplitEnemyBulletAngles(parentBullet, split) {
  if (split.pattern === "circle") {
    return getCircleSplitAngles(split.count);
  }

  if (split.pattern === "aimedFan") {
    return getAimedFanSplitAngles(parentBullet, split);
  }

  return getFanDownSplitAngles(split);
}

function getCircleSplitAngles(count) {
  const angles = [];

  for (let i = 0; i < count; i += 1) {
    angles.push((Math.PI * 2 / count) * i);
  }

  return angles;
}

function getFanDownSplitAngles(split) {
  const angles = [];
  const count = Math.max(split.count, 1);
  const startAngle = split.baseAngle - split.spreadRange / 2;

  for (let i = 0; i < count; i += 1) {
    const ratio = count === 1 ? 0.5 : i / (count - 1);
    angles.push(startAngle + split.spreadRange * ratio);
  }

  return angles;
}

function getAimedFanSplitAngles(parentBullet, split) {
  if (!player) {
    return getFanDownSplitAngles(split);
  }

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = playerCenterX - parentBullet.x;
  const dy = playerCenterY - parentBullet.y;
  const baseAngle = Math.atan2(dy, dx);

  return getFanSplitAnglesByBaseAngle(split.count, baseAngle, split.spreadRange);
}

function getFanSplitAnglesByBaseAngle(count, baseAngle, spreadRange) {
  const angles = [];
  const safeCount = Math.max(count, 1);
  const startAngle = baseAngle - spreadRange / 2;

  for (let i = 0; i < safeCount; i += 1) {
    const ratio = safeCount === 1 ? 0.5 : i / (safeCount - 1);
    angles.push(startAngle + spreadRange * ratio);
  }

  return angles;
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

    playSfx("playerHit");

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