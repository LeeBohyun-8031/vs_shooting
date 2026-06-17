function createEnemy(options) {
  const size = options.size || randomInt(ENEMY_CONFIG.minSize, ENEMY_CONFIG.maxSize);
  const hp = options.hp ?? (size >= 32 ? 2 : 1);

  return {
    x: options.x,
    y: options.y,
    width: size,
    height: size,
    speed: options.vy ?? 2,
    hp,
    score: hp >= 2 ? 30 : 10,

    moveType: options.moveType || "straight",
    age: 0,

    vx: options.vx ?? 0,
    vy: options.vy ?? 2,

    baseX: options.baseX ?? options.x,
    angle: options.angle ?? 0,
    angleSpeed: options.angleSpeed ?? 0.04,
    amplitude: options.amplitude ?? 36,

    state: options.state || "enter",
    targetX: options.targetX ?? CANVAS_WIDTH / 2,
    targetY: options.targetY ?? 160,
    waitFrame: options.waitFrame ?? 0,
    exitVx: options.exitVx ?? 0,
    exitVy: options.exitVy ?? 3,

    shotPattern: options.shotPattern || null,
    shotTimer: options.shotTimer ?? 0,
    shotCooldown: options.shotCooldown ?? ENEMY_BULLET_CONFIG.defaultCooldown,
    shotDelay: options.shotDelay ?? 20,
    shotCount: 0,
    shotLimit: options.shotLimit ?? 1,
    onlyShootOnWait: options.onlyShootOnWait ?? false,
  };
}

function spawnEnemy() {
  spawnEnemyWave();
}

function getEnemySpawnCooldown() {
  const difficulty = getSelectedDifficultyConfig();

  return ENEMY_WAVE_BASE_COOLDOWN / difficulty.enemySpawnRateMultiplier;
}

function updateEnemies(timestamp) {
  if (timestamp - lastEnemySpawnTime > getEnemySpawnCooldown()) {
    spawnEnemy();
    lastEnemySpawnTime = timestamp;
  }

  enemies = enemies.filter((enemy) => {
    if (gameState !== "playing") return true;

    updateEnemyMovement(enemy);

    return !isEnemyOutOfScreen(enemy);
  });
}

function updateEnemyMovement(enemy) {
  enemy.age += 1;

  if (enemy.moveType === "straight") {
    updateStraightEnemy(enemy);
    return;
  }

  if (enemy.moveType === "sweep") {
    updateSweepEnemy(enemy);
    return;
  }

  if (enemy.moveType === "sine") {
    updateSineEnemy(enemy);
    return;
  }

  if (enemy.moveType === "stopAndGo") {
    updateStopAndGoEnemy(enemy);
    return;
  }

  if (enemy.moveType === "horizontal") {
    updateHorizontalEnemy(enemy);
    return;
  }

  if (enemy.moveType === "sideToCenter") {
    updateSideToCenterEnemy(enemy);
    return;
  }

  if (enemy.moveType === "stopAndSideExit") {
    updateStopAndSideExitEnemy(enemy);
    return;
  }

  updateStraightEnemy(enemy);
}

function updateStraightEnemy(enemy) {
  enemy.x += enemy.vx;
  enemy.y += enemy.vy;
}

function updateSweepEnemy(enemy) {
  enemy.x += enemy.vx;
  enemy.y += enemy.vy;

  if (enemy.age > 80) {
    enemy.vy += 0.006;
  }
}

function updateSineEnemy(enemy) {
  enemy.y += enemy.vy;
  enemy.angle += enemy.angleSpeed;
  enemy.x = enemy.baseX + Math.sin(enemy.angle) * enemy.amplitude;

  enemy.x = clamp(enemy.x, 0, CANVAS_WIDTH - enemy.width);
}

function updateStopAndGoEnemy(enemy) {
  if (enemy.state === "enter") {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;

    if (enemy.y >= enemy.targetY) {
      enemy.state = "wait";
    }

    return;
  }

  if (enemy.state === "wait") {
    enemy.waitFrame -= 1;
    enemy.x += Math.sin(enemy.age * 0.08) * 0.45;

    if (enemy.waitFrame <= 0) {
      enemy.state = "exit";
    }

    return;
  }

  enemy.x += enemy.exitVx;
  enemy.y += enemy.exitVy;
}

function updateHorizontalEnemy(enemy) {
  enemy.x += enemy.vx;
  enemy.y += enemy.vy;

  enemy.y += Math.sin(enemy.age * 0.035) * 0.25;
}

function updateSideToCenterEnemy(enemy) {
  if (enemy.state === "enter") {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;

    const reachedFromLeft = enemy.vx > 0 && enemy.x >= enemy.targetX;
    const reachedFromRight = enemy.vx < 0 && enemy.x <= enemy.targetX;

    if (reachedFromLeft || reachedFromRight) {
      enemy.state = "wait";
    }

    return;
  }

  if (enemy.state === "wait") {
    enemy.waitFrame -= 1;
    enemy.y += Math.sin(enemy.age * 0.08) * 0.25;

    if (enemy.waitFrame <= 0) {
      enemy.state = "exit";
    }

    return;
  }

  enemy.x += enemy.exitVx;
  enemy.y += enemy.exitVy;
}

function updateStopAndSideExitEnemy(enemy) {
  if (enemy.state === "enter") {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;

    if (enemy.y >= enemy.targetY) {
      enemy.state = "wait";
    }

    return;
  }

  if (enemy.state === "wait") {
    enemy.waitFrame -= 1;
    enemy.x += Math.sin(enemy.age * 0.07) * 0.35;

    if (enemy.waitFrame <= 0) {
      enemy.state = "exit";
    }

    return;
  }

  enemy.x += enemy.exitVx;
  enemy.y += enemy.exitVy;
}

function isEnemyOutOfScreen(enemy) {
  const margin = 140;

  return (
    enemy.y > CANVAS_HEIGHT + margin ||
    enemy.y + enemy.height < -margin ||
    enemy.x + enemy.width < -margin ||
    enemy.x > CANVAS_WIDTH + margin
  );
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

  const playerHitbox = getPlayerHitbox(player);

  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];

    if (!isColliding(playerHitbox, enemy)) continue;

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