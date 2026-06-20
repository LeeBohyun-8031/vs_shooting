function createPlayerBullet(options) {
  bullets.push({
    type: options.type || "normal",

    x: options.x - options.width / 2,
    y: options.y,
    width: options.width,
    height: options.height,

    vx: options.vx ?? 0,
    vy: options.vy ?? -BULLET_CONFIG.speed,
    speed: options.speed ?? BULLET_CONFIG.speed,

    damage: options.damage ?? 1,

    turnPower: options.turnPower ?? 0,
    lifeTime: options.lifeTime ?? 160,
    age: 0,

    color: options.color || "#7dd3fc",
    glowColor: options.glowColor || "#bae6fd",
  });
}

function updateBullets() {
  bullets = bullets.filter((bullet) => {
    normalizeLegacyBulletData(bullet);

    if (bullet.type === "homing") {
      updateHomingBullet(bullet);
    } else {
      updateStraightPlayerBullet(bullet);
    }

    bullet.age += 1;

    return !isPlayerBulletOutOfScreen(bullet);
  });
}

function normalizeLegacyBulletData(bullet) {
  if (!bullet.type) {
    bullet.type = "normal";
  }

  if (bullet.vx === undefined) {
    bullet.vx = 0;
  }

  if (bullet.vy === undefined) {
    bullet.vy = -(bullet.speed || BULLET_CONFIG.speed);
  }

  if (bullet.speed === undefined) {
    bullet.speed = Math.abs(bullet.vy) || BULLET_CONFIG.speed;
  }

  if (bullet.damage === undefined) {
    bullet.damage = 1;
  }

  if (bullet.age === undefined) {
    bullet.age = 0;
  }

  if (bullet.lifeTime === undefined) {
    bullet.lifeTime = 160;
  }

  if (!bullet.color) {
    bullet.color = "#7dd3fc";
  }

  if (!bullet.glowColor) {
    bullet.glowColor = "#bae6fd";
  }
}

function updateStraightPlayerBullet(bullet) {
  bullet.x += bullet.vx;
  bullet.y += bullet.vy;
}

function updateHomingBullet(bullet) {
  const target = findClosestHomingTargetToBullet(bullet);

  if (target) {
    steerBulletToTarget(bullet, target);
  }

  bullet.x += bullet.vx;
  bullet.y += bullet.vy;
}

function findClosestHomingTargetToBullet(bullet) {
  const bulletCenterX = bullet.x + bullet.width / 2;
  const bulletCenterY = bullet.y + bullet.height / 2;

  let closestTarget = null;
  let closestDistance = Infinity;

  enemies.forEach((enemy) => {
    if (!isValidEnemyHomingTarget(enemy)) return;

    const distance = getDistanceFromBulletToTarget(
      bulletCenterX,
      bulletCenterY,
      enemy
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestTarget = enemy;
    }
  });

  if (isValidBossHomingTarget(boss)) {
    const bossDistance = getDistanceFromBulletToTarget(
      bulletCenterX,
      bulletCenterY,
      boss
    );

    if (bossDistance < closestDistance) {
      closestTarget = boss;
    }
  }

  return closestTarget;
}

function isValidEnemyHomingTarget(enemy) {
  if (!enemy) return false;

  if (typeof isEnemyAttackable === "function") {
    return isEnemyAttackable(enemy);
  }

  return true;
}

function isValidBossHomingTarget(bossObject) {
  if (!bossObject) return false;

  if (typeof isBossAttackable === "function") {
    return isBossAttackable(bossObject);
  }

  return stagePhase === "boss";
}

function getDistanceFromBulletToTarget(bulletCenterX, bulletCenterY, target) {
  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;

  return Math.hypot(
    targetCenterX - bulletCenterX,
    targetCenterY - bulletCenterY
  );
}

function steerBulletToTarget(bullet, target) {
  const bulletCenterX = bullet.x + bullet.width / 2;
  const bulletCenterY = bullet.y + bullet.height / 2;

  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;

  const dx = targetCenterX - bulletCenterX;
  const dy = targetCenterY - bulletCenterY;
  const distance = Math.hypot(dx, dy) || 1;

  const desiredVx = (dx / distance) * bullet.speed;
  const desiredVy = (dy / distance) * bullet.speed;

  bullet.vx += (desiredVx - bullet.vx) * bullet.turnPower;
  bullet.vy += (desiredVy - bullet.vy) * bullet.turnPower;

  normalizeBulletVelocity(bullet);
}

function normalizeBulletVelocity(bullet) {
  const velocityLength = Math.hypot(bullet.vx, bullet.vy) || 1;

  bullet.vx = (bullet.vx / velocityLength) * bullet.speed;
  bullet.vy = (bullet.vy / velocityLength) * bullet.speed;
}

function isPlayerBulletOutOfScreen(bullet) {
  const margin = 40;

  if (bullet.age > bullet.lifeTime) {
    return true;
  }

  return (
    bullet.x + bullet.width < -margin ||
    bullet.x > CANVAS_WIDTH + margin ||
    bullet.y + bullet.height < -margin ||
    bullet.y > CANVAS_HEIGHT + margin
  );
}