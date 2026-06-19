function shootBullet() {
  if (!player) return;

  const now = Date.now();

  if (now - lastShotTime < SHOT_COOLDOWN) return;

  shootCenterTriangleBullets();

  if (player.type === "homing") {
    shootHomingAssistFanBullets();
  }

  if (player.type === "power") {
    shootPowerAssistTriangleBullets();
  }

  playSfx("shoot");

  lastShotTime = now;
}

function shootCenterTriangleBullets() {
  const center = getPlayerCenter();
  const formations = getCenterTriangleFormation();

  formations.forEach((formation) => {
    createPlayerBullet({
      type: "normal",
      x: center.x + formation.x,
      y: player.y - 12 + formation.y,
      width: BULLET_CONFIG.width,
      height: BULLET_CONFIG.height,
      vx: 0,
      vy: -BULLET_CONFIG.speed,
      speed: BULLET_CONFIG.speed,
      damage: player.attackPower,
      color: "#7dd3fc",
      glowColor: "#bae6fd",
    });
  });
}

function shootHomingAssistFanBullets() {
  const assistPositions = getAssistShotPositions();
  const angles = getHomingAssistFanAngles();
  const speed = 7.2;

  assistPositions.forEach((position) => {
    angles.forEach((angle) => {
      createPlayerBullet({
        type: "homing",
        x: position.x,
        y: position.y,
        width: 5,
        height: 10,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        speed,
        turnPower: 0.085,
        damage: player.attackPower * 0.5,
        lifeTime: 120,
        color: "#22c55e",
        glowColor: "#86efac",
      });
    });
  });
}

function shootPowerAssistTriangleBullets() {
  const assistPositions = getAssistShotPositions();
  const formations = getPowerAssistTriangleFormation();
  const speed = 9.8;

  assistPositions.forEach((position) => {
    formations.forEach((formation) => {
      createPlayerBullet({
        type: "needle",
        x: position.x + formation.x,
        y: position.y + formation.y,
        width: 4,
        height: 18,
        vx: 0,
        vy: -speed,
        speed,
        damage: player.attackPower,
        color: "#facc15",
        glowColor: "#fde68a",
      });
    });
  });
}

function getPlayerCenter() {
  return {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
  };
}

function getCenterTriangleFormation() {
  const shotLevel = clamp(player.shotLevel || 1, 1, 3);

  if (shotLevel === 1) {
    return [
      { x: 0, y: 0 },
    ];
  }

  if (shotLevel === 2) {
    return [
      { x: 0, y: -6 },
      { x: -8, y: 6 },
      { x: 8, y: 6 },
    ];
  }

  return [
    { x: 0, y: -10 },
    { x: -8, y: 2 },
    { x: 8, y: 2 },
    { x: -16, y: 14 },
    { x: 16, y: 14 },
  ];
}

function getAssistShotPositions() {
  const center = getPlayerCenter();

  return [
    {
      x: center.x - 28,
      y: player.y + player.height - 8,
    },
    {
      x: center.x + 28,
      y: player.y + player.height - 8,
    },
  ];
}

function getHomingAssistFanAngles() {
  const shotLevel = clamp(player.shotLevel || 1, 1, 3);

  if (shotLevel === 1) {
    return [0];
  }

  if (shotLevel === 2) {
    return [-0.18, 0.18];
  }

  return [-0.24, 0, 0.24];
}

function getPowerAssistTriangleFormation() {
  const shotLevel = clamp(player.shotLevel || 1, 1, 3);

  if (shotLevel === 1) {
    return [
      { x: 0, y: 0 },
    ];
  }

  if (shotLevel === 2) {
    return [
      { x: -5, y: 4 },
      { x: 5, y: 4 },
    ];
  }

  return [
    { x: 0, y: -6 },
    { x: -7, y: 6 },
    { x: 7, y: 6 },
  ];
}

function getPowerUpRequirementForCurrentLevel() {
  if (!player) return Infinity;

  const shotLevel = clamp(player.shotLevel || 1, 1, 3);

  if (shotLevel >= 3) {
    return Infinity;
  }

  const difficultyRequirements =
    POWER_UP_REQUIREMENTS[selectedDifficultyType] ||
    POWER_UP_REQUIREMENTS.normal;

  return difficultyRequirements[shotLevel] || Infinity;
}

function getPowerItemCountToNextLevel() {
  if (!player) return 0;

  const requiredCount = getPowerUpRequirementForCurrentLevel();

  if (!Number.isFinite(requiredCount)) {
    return 0;
  }

  return Math.max(requiredCount - player.powerItemCount, 0);
}

function applyPowerItemToPlayer() {
  if (!player) return;

  const currentShotLevel = clamp(player.shotLevel || 1, 1, 3);

  if (currentShotLevel >= 3) {
    player.shotLevel = 3;
    player.powerItemCount = 0;
    return;
  }

  player.powerItemCount += 1;

  const requiredCount = getPowerUpRequirementForCurrentLevel();

  if (player.powerItemCount < requiredCount) {
    return;
  }

  player.shotLevel = clamp(currentShotLevel + 1, 1, 3);
  player.powerItemCount = 0;

  playPowerLevelUpEffect(player.shotLevel);
}

function playPowerLevelUpEffect(newShotLevel) {
  if (!player) return;

  const center = getPlayerCenter();

  if (typeof createPowerUpEffect === "function") {
    createPowerUpEffect(center.x, center.y, newShotLevel);
  }
}