function getBossConfig(bossId) {
  return BOSS_CONFIGS[bossId] || BOSS_CONFIGS.stage1Boss;
}

function createBoss(bossId) {
  const bossConfig = getBossConfig(bossId);
  const difficulty = getSelectedDifficultyConfig();
  const hpMultiplier = difficulty.bossHpMultiplier ?? 1;
  const maxHp = Math.round(bossConfig.maxHp * hpMultiplier);

  return {
    id: bossConfig.id,
    name: bossConfig.name,

    x: CANVAS_WIDTH / 2 - bossConfig.width / 2,
    y: -bossConfig.height - 24,
    width: bossConfig.width,
    height: bossConfig.height,

    targetY: bossConfig.enterTargetY,
    enterSpeed: bossConfig.enterSpeed,

    patrolPaddingX: bossConfig.patrolPaddingX,
    patrolMinY: bossConfig.patrolMinY,
    patrolMaxY: bossConfig.patrolMaxY,
    patrolSpeed: bossConfig.patrolSpeed,
    patrolWaitMin: bossConfig.patrolWaitMin,
    patrolWaitMax: bossConfig.patrolWaitMax,
    targetReachDistance: bossConfig.targetReachDistance,

    activeTargetX: null,
    activeTargetY: null,
    waitUntil: 0,

    maxHp,
    hp: maxHp,
    score: bossConfig.score,

    state: "enter",
    age: 0,
    patternSet: bossConfig.patternSet,

    hitFlashTime: 0,
    defeated: false,
  };
}

function updateBoss(bossObject, timestamp) {
  if (!bossObject) return;

  bossObject.age += 1;

  if (bossObject.hitFlashTime > 0) {
    bossObject.hitFlashTime -= 1;
  }

  if (bossObject.state === "enter") {
    updateBossEnterMovement(bossObject, timestamp);
    return;
  }

  if (bossObject.state === "active") {
    updateBossActiveMovement(bossObject, timestamp);
  }
}

function updateBossEnterMovement(bossObject, timestamp) {
  bossObject.y += bossObject.enterSpeed;

  if (bossObject.y < bossObject.targetY) return;

  bossObject.y = bossObject.targetY;
  bossObject.state = "active";

  bossObject.activeTargetX = null;
  bossObject.activeTargetY = null;
  bossObject.waitUntil = timestamp + 600;
}

function updateBossActiveMovement(bossObject, timestamp) {
  if (timestamp < bossObject.waitUntil) {
    return;
  }

  if (
    !Number.isFinite(bossObject.activeTargetX) ||
    !Number.isFinite(bossObject.activeTargetY)
  ) {
    setBossPatrolTarget(bossObject);
  }

  const dx = bossObject.activeTargetX - bossObject.x;
  const dy = bossObject.activeTargetY - bossObject.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= bossObject.targetReachDistance) {
    bossObject.x = bossObject.activeTargetX;
    bossObject.y = bossObject.activeTargetY;

    bossObject.waitUntil =
      timestamp + randomBossRange(bossObject.patrolWaitMin, bossObject.patrolWaitMax);

    setBossPatrolTarget(bossObject);
    return;
  }

  const moveDistance = Math.min(bossObject.patrolSpeed, distance);

  bossObject.x += (dx / distance) * moveDistance;
  bossObject.y += (dy / distance) * moveDistance;
}

function setBossPatrolTarget(bossObject) {
  const bounds = getBossPatrolBounds(bossObject);
  let targetX = bossObject.x;
  let targetY = bossObject.y;

  for (let i = 0; i < 8; i += 1) {
    targetX = randomBossRange(bounds.minX, bounds.maxX);
    targetY = randomBossRange(bounds.minY, bounds.maxY);

    const distance = Math.hypot(targetX - bossObject.x, targetY - bossObject.y);

    if (distance >= 70) {
      break;
    }
  }

  bossObject.activeTargetX = targetX;
  bossObject.activeTargetY = targetY;
}

function getBossPatrolBounds(bossObject) {
  const paddingX = bossObject.patrolPaddingX ?? 30;

  return {
    minX: paddingX,
    maxX: CANVAS_WIDTH - bossObject.width - paddingX,
    minY: bossObject.patrolMinY ?? 72,
    maxY: bossObject.patrolMaxY ?? 150,
  };
}

function randomBossRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getBossHitbox(bossObject) {
  if (!bossObject) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  return {
    x: bossObject.x + 8,
    y: bossObject.y + 8,
    width: bossObject.width - 16,
    height: bossObject.height - 12,
  };
}

function isBossAttackable(bossObject) {
  if (!bossObject) return false;
  if (bossObject.defeated) return false;
  if (stagePhase !== "boss") return false;

  return bossObject.y + bossObject.height > 0;
}

function damageBoss(bossObject, damage) {
  if (!isBossAttackable(bossObject)) return false;

  const validDamage = Math.max(Number(damage) || 0, 0);

  if (validDamage <= 0) return false;

  bossObject.hp = Math.max(bossObject.hp - validDamage, 0);
  bossObject.hitFlashTime = 5;

  createHitEffect(
    bossObject.x + bossObject.width / 2,
    bossObject.y + bossObject.height / 2,
    5
  );

  return bossObject.hp <= 0;
}