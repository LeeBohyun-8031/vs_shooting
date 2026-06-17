function shootEnemyBulletDown(enemy) {
  createBulletFromEnemy(enemy, {
    vx: 0,
    vy: ENEMY_BULLET_CONFIG.speed,
    radius: 5,
    color: "#60a5fa",
    glowColor: "#93c5fd",
  });
}

function shootAimedEnemyBullet(enemy) {
  if (!player) return;

  const radius = 5;
  const spawnPoint = getEnemyBulletSpawnPoint(enemy, radius);

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = playerCenterX - spawnPoint.x;
  const dy = playerCenterY - spawnPoint.y;
  const distance = Math.hypot(dx, dy) || 1;

  const speed = ENEMY_BULLET_CONFIG.aimedSpeed;

  createEnemyBullet({
    x: spawnPoint.x,
    y: spawnPoint.y,
    vx: (dx / distance) * speed,
    vy: (dy / distance) * speed,
    radius,
    color: "#fb7185",
    glowColor: "#fda4af",
  });
}

function shootSpreadEnemyBullets(enemy, count) {
  const bulletCount = count || getSpreadBulletCount();
  const centerAngle = Math.PI / 2;
  const gap = Math.PI / 10;
  const startAngle = centerAngle - gap * ((bulletCount - 1) / 2);
  const speed = ENEMY_BULLET_CONFIG.spreadSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const angle = startAngle + gap * i;

    createBulletFromEnemy(enemy, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
      color: "#facc15",
      glowColor: "#fde68a",
    });
  }
}

function shootCircleEnemyBullets(enemy, count) {
  const bulletCount = count || getCircleBulletCount();
  const speed = ENEMY_BULLET_CONFIG.circleSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const angle = (Math.PI * 2 / bulletCount) * i;

    createBulletFromEnemy(enemy, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 4,
      color: "#c084fc",
      glowColor: "#ddd6fe",
    });
  }
}

function shootWideRainBullets(enemy) {
  const bulletCount = getWideRainBulletCount();
  const baseSpeed = ENEMY_BULLET_CONFIG.speed;
  const startAngle = Math.PI * 0.28;
  const endAngle = Math.PI * 0.72;
  const angleRange = endAngle - startAngle;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = startAngle + angleRange * ratio;
    const speed = baseSpeed + randomInt(-2, 3) / 10;

    createBulletFromEnemy(enemy, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 4,
      color: "#60a5fa",
      glowColor: "#93c5fd",
    });
  }
}

function shootCurtainBullets(enemy) {
  const bulletCount = getCurtainBulletCount();
  const speed = ENEMY_BULLET_CONFIG.spreadSpeed;
  const startAngle = Math.PI * 0.22;
  const endAngle = Math.PI * 0.78;
  const angleRange = endAngle - startAngle;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = startAngle + angleRange * ratio;

    createBulletFromEnemy(enemy, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 4,
      color: "#facc15",
      glowColor: "#fde68a",
    });
  }
}

function shootSideFanBullets(enemy) {
  const bulletCount = getSideFanBulletCount();
  const center = getEnemyCenter(enemy);
  const fromLeftSide = center.x < CANVAS_WIDTH / 2;

  const baseAngle = fromLeftSide
    ? Math.PI * 0.35
    : Math.PI * 0.65;

  const spreadRange = Math.PI / 5;
  const startAngle = baseAngle - spreadRange / 2;
  const speed = ENEMY_BULLET_CONFIG.spreadSpeed;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = startAngle + spreadRange * ratio;

    createBulletFromEnemy(enemy, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
      color: "#fb7185",
      glowColor: "#fda4af",
    });
  }
}

function shootRandomAimedRainBullets(enemy) {
  if (!player) return;

  const bulletCount = getRandomAimedRainBulletCount();
  const radius = 4;
  const spawnPoint = getEnemyBulletSpawnPoint(enemy, radius);

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = playerCenterX - spawnPoint.x;
  const dy = playerCenterY - spawnPoint.y;
  const baseAngle = Math.atan2(dy, dx);

  const speed = ENEMY_BULLET_CONFIG.aimedSpeed;
  const spreadRange = Math.PI / 6;
  const startAngle = baseAngle - spreadRange / 2;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = startAngle + spreadRange * ratio;

    createEnemyBullet({
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
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