function updateBossPattern(bossObject, timestamp) {
  if (!bossObject) return;
  if (bossObject.state !== "active") return;
  if (bossObject.defeated) return;

  initializeBossPatternState(bossObject, timestamp);

  const phase = getBossPatternPhase(bossObject);

  if (bossObject.patternPhase !== phase) {
    changeBossPatternPhase(bossObject, phase, timestamp);
    return;
  }

  if (timestamp < bossObject.nextPatternShotAt) {
    return;
  }

  fireBossPatternByPhase(bossObject, phase, timestamp);
}

function initializeBossPatternState(bossObject, timestamp) {
  if (bossObject.patternInitialized) return;

  bossObject.patternInitialized = true;
  bossObject.patternPhase = getBossPatternPhase(bossObject);
  bossObject.patternStep = 0;
  bossObject.nextPatternShotAt = timestamp + 700;
  bossObject.spiralAngle = Math.PI / 2;
}

function getBossPatternPhase(bossObject) {
  const hpRatio = bossObject.maxHp > 0 ? bossObject.hp / bossObject.maxHp : 0;

  if (hpRatio <= 0.33) return 3;
  if (hpRatio <= 0.66) return 2;

  return 1;
}

function changeBossPatternPhase(bossObject, phase, timestamp) {
  bossObject.patternPhase = phase;
  bossObject.patternStep = 0;
  bossObject.nextPatternShotAt = timestamp + 550;
  bossObject.spiralAngle = Math.PI / 2;

  createBossPhaseChangeEffect(bossObject, phase);
}

function createBossPhaseChangeEffect(bossObject, phase) {
  const centerX = bossObject.x + bossObject.width / 2;
  const centerY = bossObject.y + bossObject.height / 2;
  const particleCount = phase === 3 ? 28 : 18;

  createExplosion(centerX, centerY, particleCount);
}

function fireBossPatternByPhase(bossObject, phase, timestamp) {
  bossObject.patternStep += 1;

  if (phase === 1) {
    fireBossPhaseOnePattern(bossObject);
    bossObject.nextPatternShotAt = timestamp + getBossPatternCooldown(980);
    return;
  }

  if (phase === 2) {
    fireBossPhaseTwoPattern(bossObject);
    bossObject.nextPatternShotAt = timestamp + getBossPatternCooldown(860);
    return;
  }

  fireBossPhaseThreePattern(bossObject);
  bossObject.nextPatternShotAt = timestamp + getBossPatternCooldown(470);
}

function fireBossPhaseOnePattern(bossObject) {
  shootBossWideFan(bossObject, getBossWideFanCount(), {
    startAngle: Math.PI * 0.28,
    endAngle: Math.PI * 0.72,
    speed: 1.35,
    radius: 5,
    color: "#60a5fa",
    glowColor: "#93c5fd",
  });
}

function fireBossPhaseTwoPattern(bossObject) {
  if (bossObject.patternStep % 3 === 0) {
    shootBossCircle(bossObject, getBossCircleCount(), {
      speed: 1.16,
      radius: 4,
      angleOffset: bossObject.patternStep * 0.18,
      color: "#c084fc",
      glowColor: "#ddd6fe",
    });

    return;
  }

  shootBossAimedFan(bossObject, getBossAimedFanCount(), {
    spreadAngle: Math.PI / 5.2,
    speed: 1.55,
    radius: 5,
    color: "#fb7185",
    glowColor: "#fda4af",
  });
}

function fireBossPhaseThreePattern(bossObject) {
  shootBossSpiralPair(bossObject, {
    speed: 1.42,
    radius: 4,
    color: "#facc15",
    glowColor: "#fde68a",
  });

  if (bossObject.patternStep % 4 === 0) {
    shootBossAimedFan(bossObject, getBossFinalAimedFanCount(), {
      spreadAngle: Math.PI / 4.5,
      speed: 1.72,
      radius: 4,
      color: "#fb7185",
      glowColor: "#fda4af",
    });
  }
}

function shootBossWideFan(bossObject, bulletCount, options) {
  const spawnPoint = getBossBulletSpawnPoint(bossObject, options.radius);
  const angleRange = options.endAngle - options.startAngle;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = options.startAngle + angleRange * ratio;

    createEnemyBullet({
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: Math.cos(angle) * options.speed,
      vy: Math.sin(angle) * options.speed,
      radius: options.radius,
      color: options.color,
      glowColor: options.glowColor,
    });
  }
}

function shootBossAimedFan(bossObject, bulletCount, options) {
  if (!player) return;

  const spawnPoint = getBossBulletSpawnPoint(bossObject, options.radius);
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = playerCenterX - spawnPoint.x;
  const dy = playerCenterY - spawnPoint.y;
  const baseAngle = Math.atan2(dy, dx);

  const startAngle = baseAngle - options.spreadAngle / 2;

  for (let i = 0; i < bulletCount; i += 1) {
    const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
    const angle = startAngle + options.spreadAngle * ratio;

    createEnemyBullet({
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: Math.cos(angle) * options.speed,
      vy: Math.sin(angle) * options.speed,
      radius: options.radius,
      color: options.color,
      glowColor: options.glowColor,
    });
  }
}

function shootBossCircle(bossObject, bulletCount, options) {
  const spawnPoint = getBossBulletSpawnPoint(bossObject, options.radius);

  for (let i = 0; i < bulletCount; i += 1) {
    const angle = (Math.PI * 2 / bulletCount) * i + options.angleOffset;

    createEnemyBullet({
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: Math.cos(angle) * options.speed,
      vy: Math.sin(angle) * options.speed,
      radius: options.radius,
      color: options.color,
      glowColor: options.glowColor,
    });
  }
}

function shootBossSpiralPair(bossObject, options) {
  const spawnPoint = getBossBulletSpawnPoint(bossObject, options.radius);
  const angleStep = getBossSpiralAngleStep();

  bossObject.spiralAngle += angleStep;

  const angles = [
    bossObject.spiralAngle,
    bossObject.spiralAngle + Math.PI,
  ];

  angles.forEach((angle) => {
    createEnemyBullet({
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: Math.cos(angle) * options.speed,
      vy: Math.sin(angle) * options.speed,
      radius: options.radius,
      color: options.color,
      glowColor: options.glowColor,
    });
  });
}

function getBossBulletSpawnPoint(bossObject, radius) {
  const centerX = bossObject.x + bossObject.width / 2;
  const centerY = bossObject.y + bossObject.height / 2;

  return {
    x: getSafeBulletSpawnX(centerX, radius),
    y: getSafeBulletSpawnY(centerY + bossObject.height * 0.28, radius),
  };
}

function getBossPatternCooldown(baseCooldown) {
  const difficulty = getSelectedDifficultyConfig();
  const multiplier = difficulty.bossBulletDensityMultiplier ?? 1;

  return Math.max(baseCooldown / multiplier, 120);
}

function getBossWideFanCount() {
  if (selectedDifficultyType === "easy") return 5;
  if (selectedDifficultyType === "hard") return 9;

  return 7;
}

function getBossAimedFanCount() {
  if (selectedDifficultyType === "easy") return 3;
  if (selectedDifficultyType === "hard") return 5;

  return 4;
}

function getBossFinalAimedFanCount() {
  if (selectedDifficultyType === "easy") return 3;
  if (selectedDifficultyType === "hard") return 7;

  return 5;
}

function getBossCircleCount() {
  if (selectedDifficultyType === "easy") return 10;
  if (selectedDifficultyType === "hard") return 18;

  return 14;
}

function getBossSpiralAngleStep() {
  if (selectedDifficultyType === "easy") return 0.28;
  if (selectedDifficultyType === "hard") return 0.42;

  return 0.34;
}