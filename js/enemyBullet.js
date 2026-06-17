function createEnemyBullet(options) {
  enemyBullets.push({
    x: options.x,
    y: options.y,
    vx: options.vx,
    vy: options.vy,
    radius: options.radius || ENEMY_BULLET_CONFIG.radius,
    hitboxSize: options.hitboxSize || ENEMY_BULLET_CONFIG.hitboxSize,
    color: options.color || "#60a5fa",
    glowColor: options.glowColor || options.color || "#60a5fa",
    age: 0,
  });
}

function getEnemyBulletHitbox(enemyBullet) {
  const hitboxSize = enemyBullet.hitboxSize;

  return {
    x: enemyBullet.x - hitboxSize / 2,
    y: enemyBullet.y - hitboxSize / 2,
    width: hitboxSize,
    height: hitboxSize,
  };
}

function getEnemyCenter(enemy) {
  return {
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height / 2,
  };
}

function shootEnemyBulletDown(enemy) {
  const center = getEnemyCenter(enemy);

  createEnemyBullet({
    x: center.x,
    y: center.y,
    vx: 0,
    vy: ENEMY_BULLET_CONFIG.speed,
    color: "#60a5fa",
    glowColor: "#93c5fd",
  });
}

function shootAimedEnemyBullet(enemy) {
  if (!player) return;

  const center = getEnemyCenter(enemy);

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = playerCenterX - center.x;
  const dy = playerCenterY - center.y;
  const distance = Math.hypot(dx, dy) || 1;

  const speed = ENEMY_BULLET_CONFIG.aimedSpeed;

  createEnemyBullet({
    x: center.x,
    y: center.y,
    vx: (dx / distance) * speed,
    vy: (dy / distance) * speed,
    radius: 5,
    color: "#fb7185",
    glowColor: "#fda4af",
  });
}

function shootSpreadEnemyBullets(enemy, count) {
  const center = getEnemyCenter(enemy);
  const bulletCount = count || getSpreadBulletCount();
  const centerAngle = Math.PI / 2;
  const gap = Math.PI / 10;
  const startAngle = centerAngle - gap * ((bulletCount - 1) / 2);
  const speed = ENEMY_BULLET_CONFIG.spreadSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const angle = startAngle + gap * i;

    createEnemyBullet({
      x: center.x,
      y: center.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
      color: "#facc15",
      glowColor: "#fde68a",
    });
  }
}

function shootCircleEnemyBullets(enemy, count) {
  const center = getEnemyCenter(enemy);
  const bulletCount = count || getCircleBulletCount();
  const speed = ENEMY_BULLET_CONFIG.circleSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const angle = (Math.PI * 2 / bulletCount) * i;

    createEnemyBullet({
      x: center.x,
      y: center.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 4,
      color: "#c084fc",
      glowColor: "#ddd6fe",
    });
  }
}

function shootWideRainBullets() {
  const bulletCount = getWideRainBulletCount();
  const spacing = CANVAS_WIDTH / (bulletCount + 1);

  for (let i = 0; i < bulletCount; i += 1) {
    const x = spacing * (i + 1) + randomInt(-20, 20);
    const y = -12 - randomInt(0, 80);
    const vx = randomInt(-3, 3) / 10;
    const vy = ENEMY_BULLET_CONFIG.speed + randomInt(0, 4) / 10;

    createEnemyBullet({
      x,
      y,
      vx,
      vy,
      radius: 4,
      color: "#60a5fa",
      glowColor: "#93c5fd",
    });
  }
}

function shootCurtainBullets(enemy) {
  const bulletCount = getCurtainBulletCount();
  const center = getEnemyCenter(enemy);
  const startX = 36;
  const endX = CANVAS_WIDTH - 36;
  const gap = (endX - startX) / Math.max(bulletCount - 1, 1);
  const startY = clamp(center.y - 18, 45, 155);

  for (let i = 0; i < bulletCount; i += 1) {
    const x = startX + gap * i;
    const y = startY + randomInt(-10, 10);
    const angleOffset = (i - (bulletCount - 1) / 2) * 0.025;

    createEnemyBullet({
      x,
      y,
      vx: Math.sin(angleOffset) * 0.75,
      vy: ENEMY_BULLET_CONFIG.spreadSpeed,
      radius: 4,
      color: "#facc15",
      glowColor: "#fde68a",
    });
  }
}

function shootSideFanBullets(enemy) {
  const bulletCount = getSideFanBulletCount();
  const fromLeft = enemy.x < CANVAS_WIDTH / 2;
  const x = fromLeft ? -8 : CANVAS_WIDTH + 8;
  const y = clamp(enemy.y + enemy.height / 2, 55, 185);
  const baseAngle = fromLeft ? 0 : Math.PI;
  const spreadRange = Math.PI / 3;
  const speed = ENEMY_BULLET_CONFIG.spreadSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = baseAngle - spreadRange / 2 + spreadRange * ratio;

    createEnemyBullet({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.abs(Math.sin(angle)) * speed + 0.35,
      radius: 5,
      color: "#fb7185",
      glowColor: "#fda4af",
    });
  }
}

function shootRandomAimedRainBullets() {
  if (!player) return;

  const bulletCount = getRandomAimedRainBulletCount();
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  for (let i = 0; i < bulletCount; i += 1) {
    const x = randomInt(32, CANVAS_WIDTH - 32);
    const y = -12 - i * 22;

    const dx = playerCenterX - x;
    const dy = playerCenterY - y;
    const distance = Math.hypot(dx, dy) || 1;
    const speed = ENEMY_BULLET_CONFIG.aimedSpeed;

    createEnemyBullet({
      x,
      y,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      radius: 4,
      color: "#c084fc",
      glowColor: "#ddd6fe",
    });
  }
}

function getSpreadBulletCount() {
  if (selectedDifficultyType === "easy") return 3;
  if (selectedDifficultyType === "hard") return 5;

  return 4;
}

function getCircleBulletCount() {
  if (selectedDifficultyType === "easy") return 8;
  if (selectedDifficultyType === "hard") return 14;

  return 10;
}

function getWideRainBulletCount() {
  if (selectedDifficultyType === "easy") return 5;
  if (selectedDifficultyType === "hard") return 9;

  return 7;
}

function getCurtainBulletCount() {
  if (selectedDifficultyType === "easy") return 6;
  if (selectedDifficultyType === "hard") return 11;

  return 8;
}

function getSideFanBulletCount() {
  if (selectedDifficultyType === "easy") return 4;
  if (selectedDifficultyType === "hard") return 7;

  return 5;
}

function getRandomAimedRainBulletCount() {
  if (selectedDifficultyType === "easy") return 3;
  if (selectedDifficultyType === "hard") return 6;

  return 4;
}

function updateEnemyAttacks() {
  enemies.forEach((enemy) => {
    if (!canEnemyShoot(enemy)) return;

    enemy.shotTimer += 1;

    const difficulty = getSelectedDifficultyConfig();
    const shotCooldown = enemy.shotCooldown / difficulty.enemyBulletRateMultiplier;

    if (enemy.shotTimer < shotCooldown) return;

    enemy.shotTimer = 0;
    enemy.shotCount += 1;

    fireEnemyShotPattern(enemy);
  });
}

function canEnemyShoot(enemy) {
  if (!enemy.shotPattern) return false;
  if (enemy.shotCount >= enemy.shotLimit) return false;
  if (enemy.y < -enemy.height) return false;
  if (enemy.y > CANVAS_HEIGHT) return false;

  if (enemy.onlyShootOnWait && enemy.state !== "wait") {
    return false;
  }

  if (enemy.age < enemy.shotDelay) {
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
    shootWideRainBullets();
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
    shootRandomAimedRainBullets();
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