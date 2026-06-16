const ENEMY_WAVE_BASE_COOLDOWN = 1800;

function getEnemyWaveTypesByDifficulty() {
  if (selectedDifficultyType === "easy") {
    return [
      { type: "centerLine", weight: 34 },
      { type: "leftSweep", weight: 18 },
      { type: "rightSweep", weight: 18 },
      { type: "sineColumn", weight: 16 },
      { type: "centerStop", weight: 14 },
    ];
  }

  if (selectedDifficultyType === "hard") {
    return [
      { type: "centerLine", weight: 16 },
      { type: "leftSweep", weight: 16 },
      { type: "rightSweep", weight: 16 },
      { type: "sineColumn", weight: 16 },
      { type: "centerStop", weight: 14 },
      { type: "vFormation", weight: 12 },
      { type: "sidePairs", weight: 10 },
    ];
  }

  return [
    { type: "centerLine", weight: 24 },
    { type: "leftSweep", weight: 18 },
    { type: "rightSweep", weight: 18 },
    { type: "sineColumn", weight: 16 },
    { type: "centerStop", weight: 14 },
    { type: "vFormation", weight: 10 },
  ];
}

function getWeightedEnemyWaveType() {
  const waveTypes = getEnemyWaveTypesByDifficulty();
  const totalWeight = waveTypes.reduce((sum, item) => sum + item.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (let i = 0; i < waveTypes.length; i += 1) {
    randomWeight -= waveTypes[i].weight;

    if (randomWeight <= 0) {
      return waveTypes[i].type;
    }
  }

  return "centerLine";
}

function createEnemy(options) {
  const size = options.size || randomInt(ENEMY_CONFIG.minSize, ENEMY_CONFIG.maxSize);
  const hp = size >= 38 ? 2 : 1;

  return {
    x: options.x,
    y: options.y,
    width: size,
    height: size,
    speed: options.vy || 2,
    hp,
    score: hp >= 2 ? 30 : 10,

    moveType: options.moveType || "straight",
    age: 0,

    vx: options.vx || 0,
    vy: options.vy || 2,

    baseX: options.baseX ?? options.x,
    angle: options.angle || 0,
    angleSpeed: options.angleSpeed || 0.04,
    amplitude: options.amplitude || 36,

    state: options.state || "enter",
    targetY: options.targetY || 160,
    waitFrame: options.waitFrame || 0,
    exitVx: options.exitVx || 0,
    exitVy: options.exitVy || 3,
  };
}

function spawnEnemy() {
  spawnEnemyWave();
}

function spawnEnemyWave() {
  const waveType = getWeightedEnemyWaveType();

  if (waveType === "centerLine") {
    spawnCenterLineWave();
    return;
  }

  if (waveType === "leftSweep") {
    spawnSweepWave("left");
    return;
  }

  if (waveType === "rightSweep") {
    spawnSweepWave("right");
    return;
  }

  if (waveType === "sineColumn") {
    spawnSineColumnWave();
    return;
  }

  if (waveType === "centerStop") {
    spawnCenterStopWave();
    return;
  }

  if (waveType === "vFormation") {
    spawnVFormationWave();
    return;
  }

  if (waveType === "sidePairs") {
    spawnSidePairsWave();
    return;
  }

  spawnCenterLineWave();
}

function spawnCenterLineWave() {
  const count = selectedDifficultyType === "easy" ? 3 : 5;
  const spacing = CANVAS_WIDTH / (count + 1);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(28, 36);

    enemies.push(createEnemy({
      x: spacing * (i + 1) - size / 2,
      y: -size - i * 18,
      size,
      moveType: "straight",
      vx: 0,
      vy: selectedDifficultyType === "hard" ? 2.8 : 2.3,
    }));
  }
}

function spawnSweepWave(direction) {
  const count = selectedDifficultyType === "easy" ? 3 : 4;
  const fromLeft = direction === "left";
  const startX = fromLeft ? -44 : CANVAS_WIDTH + 12;
  const vx = fromLeft ? 1.45 : -1.45;

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(28, 38);

    enemies.push(createEnemy({
      x: startX - i * vx * 18,
      y: -size - i * 46,
      size,
      moveType: "sweep",
      vx,
      vy: 2.1,
    }));
  }
}

function spawnSineColumnWave() {
  const count = selectedDifficultyType === "easy" ? 3 : 4;
  const size = randomInt(30, 38);
  const baseX = randomInt(90, CANVAS_WIDTH - 90);

  for (let i = 0; i < count; i += 1) {
    enemies.push(createEnemy({
      x: baseX - size / 2,
      y: -size - i * 54,
      size,
      moveType: "sine",
      baseX: baseX - size / 2,
      vy: 2.05,
      angle: i * 0.85,
      angleSpeed: 0.045,
      amplitude: selectedDifficultyType === "hard" ? 62 : 46,
    }));
  }
}

function spawnCenterStopWave() {
  const count = selectedDifficultyType === "easy" ? 2 : 3;
  const startX = CANVAS_WIDTH / 2 - ((count - 1) * 64) / 2;

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(32, 42);

    enemies.push(createEnemy({
      x: startX + i * 64 - size / 2,
      y: -size - i * 24,
      size,
      moveType: "stopAndGo",
      vx: 0,
      vy: 2.5,
      targetY: randomInt(120, 180),
      waitFrame: selectedDifficultyType === "hard" ? 70 : 55,
      exitVx: (i - 1) * 0.45,
      exitVy: 3.4,
    }));
  }
}

function spawnVFormationWave() {
  const centerX = CANVAS_WIDTH / 2;
  const positions = [
    { offsetX: 0, offsetY: 0, vx: 0 },
    { offsetX: -42, offsetY: -34, vx: -0.25 },
    { offsetX: 42, offsetY: -34, vx: 0.25 },
    { offsetX: -84, offsetY: -68, vx: -0.45 },
    { offsetX: 84, offsetY: -68, vx: 0.45 },
  ];

  positions.forEach((position) => {
    const size = randomInt(28, 36);

    enemies.push(createEnemy({
      x: centerX + position.offsetX - size / 2,
      y: -size + position.offsetY,
      size,
      moveType: "straight",
      vx: position.vx,
      vy: 2.45,
    }));
  });
}

function spawnSidePairsWave() {
  const pairCount = 3;

  for (let i = 0; i < pairCount; i += 1) {
    const size = randomInt(28, 36);
    const y = -size - i * 58;

    enemies.push(createEnemy({
      x: 32,
      y,
      size,
      moveType: "stopAndGo",
      vx: 0.6,
      vy: 2.35,
      targetY: 120 + i * 28,
      waitFrame: 45,
      exitVx: 1.2,
      exitVy: 3.2,
    }));

    enemies.push(createEnemy({
      x: CANVAS_WIDTH - 32 - size,
      y,
      size,
      moveType: "stopAndGo",
      vx: -0.6,
      vy: 2.35,
      targetY: 120 + i * 28,
      waitFrame: 45,
      exitVx: -1.2,
      exitVy: 3.2,
    }));
  }
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

function isEnemyOutOfScreen(enemy) {
  const margin = 120;

  return (
    enemy.y > CANVAS_HEIGHT + margin ||
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