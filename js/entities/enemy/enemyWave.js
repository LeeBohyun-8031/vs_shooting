const ENEMY_WAVE_BASE_COOLDOWN = 1800;

const SHOT_ORDER_PATTERNS = {
  ODD_FIRST: "oddFirst",
  EVEN_FIRST: "evenFirst",
  LEFT_TO_RIGHT: "leftToRight",
  RIGHT_TO_LEFT: "rightToLeft",
  CENTER_OUT: "centerOut",
  OUTSIDE_IN: "outsideIn",
};

function pickShotOrderPattern(patterns) {
  return patterns[randomInt(0, patterns.length - 1)];
}

function getShotOrderValue(index, count, pattern) {
  if (pattern === SHOT_ORDER_PATTERNS.ODD_FIRST) {
    return index % 2 === 0 ? 1 : 2;
  }

  if (pattern === SHOT_ORDER_PATTERNS.EVEN_FIRST) {
    return index % 2 === 0 ? 2 : 1;
  }

  if (pattern === SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT) {
    return index + 1;
  }

  if (pattern === SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT) {
    return count - index;
  }

  if (pattern === SHOT_ORDER_PATTERNS.CENTER_OUT) {
    const centerIndex = (count - 1) / 2;
    return Math.ceil(Math.abs(index - centerIndex)) + 1;
  }

  if (pattern === SHOT_ORDER_PATTERNS.OUTSIDE_IN) {
    const centerIndex = (count - 1) / 2;
    const maxDistance = Math.max(centerIndex, count - 1 - centerIndex);

    return Math.ceil(maxDistance - Math.abs(index - centerIndex)) + 1;
  }

  return index + 1;
}

function getPatternedShotDelay(index, count, baseDelay, gapDelay, pattern) {
  const orderValue = getShotOrderValue(index, count, pattern);
  const smallJitter = randomInt(0, 4);

  return baseDelay + (orderValue - 1) * gapDelay + smallJitter;
}

function getEnemyWaveTypesByDifficulty() {
  if (selectedDifficultyType === "easy") {
    return [
      { type: "centerLine", weight: 20 },
      { type: "leftSweep", weight: 12 },
      { type: "rightSweep", weight: 12 },
      { type: "sineColumn", weight: 12 },
      { type: "centerStop", weight: 11 },
      { type: "leftHorizontal", weight: 9 },
      { type: "rightHorizontal", weight: 9 },
      { type: "topStopSideExit", weight: 8 },
      { type: "sideCross", weight: 7 },
    ];
  }

  if (selectedDifficultyType === "hard") {
    return [
      { type: "centerLine", weight: 10 },
      { type: "leftSweep", weight: 10 },
      { type: "rightSweep", weight: 10 },
      { type: "sineColumn", weight: 11 },
      { type: "centerStop", weight: 10 },
      { type: "vFormation", weight: 7 },
      { type: "sidePairs", weight: 8 },
      { type: "leftHorizontal", weight: 10 },
      { type: "rightHorizontal", weight: 10 },
      { type: "sideCross", weight: 8 },
      { type: "topStopSideExit", weight: 8 },
      { type: "circleBurst", weight: 6 },
    ];
  }

  return [
    { type: "centerLine", weight: 15 },
    { type: "leftSweep", weight: 12 },
    { type: "rightSweep", weight: 12 },
    { type: "sineColumn", weight: 12 },
    { type: "centerStop", weight: 10 },
    { type: "vFormation", weight: 8 },
    { type: "leftHorizontal", weight: 9 },
    { type: "rightHorizontal", weight: 9 },
    { type: "sideCross", weight: 7 },
    { type: "topStopSideExit", weight: 6 },
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

function getWaveEnemyCount(waveType) {
  if (waveType === "centerLine") {
    if (selectedDifficultyType === "easy") return randomInt(3, 4);
    if (selectedDifficultyType === "hard") return randomInt(5, 7);

    return randomInt(4, 5);
  }

  if (waveType === "sweep") {
    if (selectedDifficultyType === "easy") return randomInt(3, 4);
    if (selectedDifficultyType === "hard") return randomInt(4, 6);

    return randomInt(4, 5);
  }

  if (waveType === "sineColumn") {
    if (selectedDifficultyType === "easy") return randomInt(3, 4);
    if (selectedDifficultyType === "hard") return randomInt(4, 5);

    return randomInt(3, 5);
  }

  if (waveType === "centerStop") {
    if (selectedDifficultyType === "easy") return randomInt(2, 3);
    if (selectedDifficultyType === "hard") return randomInt(3, 4);

    return 3;
  }

  if (waveType === "horizontal") {
    if (selectedDifficultyType === "easy") return randomInt(3, 4);
    if (selectedDifficultyType === "hard") return randomInt(5, 6);

    return randomInt(4, 5);
  }

  if (waveType === "sideCross") {
    if (selectedDifficultyType === "easy") return 2;
    if (selectedDifficultyType === "hard") return 3;

    return 2;
  }

  if (waveType === "topStopSideExit") {
    if (selectedDifficultyType === "easy") return randomInt(2, 3);
    if (selectedDifficultyType === "hard") return randomInt(4, 5);

    return randomInt(3, 4);
  }

  return 3;
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

  if (waveType === "leftHorizontal") {
    spawnHorizontalWave("left");
    return;
  }

  if (waveType === "rightHorizontal") {
    spawnHorizontalWave("right");
    return;
  }

  if (waveType === "sideCross") {
    spawnSideCrossWave();
    return;
  }

  if (waveType === "topStopSideExit") {
    spawnTopStopSideExitWave();
    return;
  }

  if (waveType === "circleBurst") {
    spawnCircleBurstWave();
    return;
  }

  spawnCenterLineWave();
}

function spawnCenterLineWave() {
  const count = getWaveEnemyCount("centerLine");
  const spacing = CANVAS_WIDTH / (count + 1);
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
    SHOT_ORDER_PATTERNS.CENTER_OUT,
  ]);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(22, 32);

    enemies.push(createEnemy({
      x: spacing * (i + 1) - size / 2,
      y: -size - i * 18,
      size,
      moveType: "straight",
      vx: 0,
      vy: selectedDifficultyType === "hard" ? 2.6 : 2.15,
      shotPattern: i % 2 === 0 ? "down" : "aimed",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 42, 16, shotOrderPattern),
      shotLimit: 1,
    }));
  }
}

function spawnSweepWave(direction) {
  const count = getWaveEnemyCount("sweep");
  const fromLeft = direction === "left";
  const startX = fromLeft ? -44 : CANVAS_WIDTH + 12;
  const vx = fromLeft ? 1.35 : -1.35;
  const shotOrderPattern = fromLeft
    ? pickShotOrderPattern([
      SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
      SHOT_ORDER_PATTERNS.ODD_FIRST,
      SHOT_ORDER_PATTERNS.CENTER_OUT,
    ])
    : pickShotOrderPattern([
      SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
      SHOT_ORDER_PATTERNS.EVEN_FIRST,
      SHOT_ORDER_PATTERNS.CENTER_OUT,
    ]);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(22, 34);

    enemies.push(createEnemy({
      x: startX - i * vx * 18,
      y: -size - i * 46,
      size,
      moveType: "sweep",
      vx,
      vy: 1.95,
      shotPattern: "aimed",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 44, 16, shotOrderPattern),
      shotLimit: 1,
    }));
  }
}

function spawnSineColumnWave() {
  const count = getWaveEnemyCount("sineColumn");
  const size = randomInt(24, 34);
  const baseX = randomInt(90, CANVAS_WIDTH - 90);
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
  ]);

  for (let i = 0; i < count; i += 1) {
    enemies.push(createEnemy({
      x: baseX - size / 2,
      y: -size - i * 54,
      size,
      moveType: "sine",
      baseX: baseX - size / 2,
      vy: 1.9,
      angle: i * 0.85,
      angleSpeed: 0.045,
      amplitude: selectedDifficultyType === "hard" ? 62 : 46,
      shotPattern: i % 2 === 0 ? "spread" : "down",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 46, 16, shotOrderPattern),
      shotLimit: 1,
    }));
  }
}

function spawnCenterStopWave() {
  const count = getWaveEnemyCount("centerStop");
  const startX = CANVAS_WIDTH / 2 - ((count - 1) * 58) / 2;
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.CENTER_OUT,
    SHOT_ORDER_PATTERNS.OUTSIDE_IN,
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
  ]);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(26, 34);

    enemies.push(createEnemy({
      x: startX + i * 58 - size / 2,
      y: -size - i * 24,
      size,
      moveType: "stopAndGo",
      vx: 0,
      vy: 2.15,
      targetY: randomInt(72, 118),
      waitFrame: selectedDifficultyType === "hard" ? 125 : 110,
      exitVx: (i - 1) * 0.45,
      exitVy: 3.1,
      shotPattern: i % 2 === 0 ? "aimed" : "spread",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 50, 16, shotOrderPattern),
      shotLimit: 1,
      onlyShootOnWait: true,
    }));
  }
}

function spawnVFormationWave() {
  const centerX = CANVAS_WIDTH / 2;
  const positions = [
    { offsetX: 0, offsetY: 0, vx: 0 },
    { offsetX: -40, offsetY: -34, vx: -0.25 },
    { offsetX: 40, offsetY: -34, vx: 0.25 },
    { offsetX: -80, offsetY: -68, vx: -0.45 },
    { offsetX: 80, offsetY: -68, vx: 0.45 },
  ];
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.CENTER_OUT,
    SHOT_ORDER_PATTERNS.OUTSIDE_IN,
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
  ]);

  positions.forEach((position, index) => {
    const size = randomInt(22, 32);

    enemies.push(createEnemy({
      x: centerX + position.offsetX - size / 2,
      y: -size + position.offsetY,
      size,
      moveType: "straight",
      vx: position.vx,
      vy: 2.2,
      shotPattern: index === 0 ? "spread" : "down",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(index, positions.length, 44, 16, shotOrderPattern),
      shotLimit: 1,
    }));
  });
}

function spawnSidePairsWave() {
  const pairCount = selectedDifficultyType === "hard" ? 3 : 2;
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
  ]);

  for (let i = 0; i < pairCount; i += 1) {
    const size = randomInt(22, 32);
    const y = -size - i * 54;
    const targetY = 76 + i * 24;
    const leftDelay = getPatternedShotDelay(i, pairCount, 50, 16, shotOrderPattern);
    const rightDelay = leftDelay + randomInt(8, 14);

    enemies.push(createEnemy({
      x: 32,
      y,
      size,
      moveType: "stopAndGo",
      vx: 0.55,
      vy: 2.1,
      targetY,
      waitFrame: selectedDifficultyType === "hard" ? 120 : 105,
      exitVx: 1.2,
      exitVy: 3.0,
      shotPattern: "sideFan",
      shotCooldown: 1,
      shotDelay: leftDelay,
      shotLimit: 1,
      onlyShootOnWait: true,
    }));

    enemies.push(createEnemy({
      x: CANVAS_WIDTH - 32 - size,
      y,
      size,
      moveType: "stopAndGo",
      vx: -0.55,
      vy: 2.1,
      targetY,
      waitFrame: selectedDifficultyType === "hard" ? 120 : 105,
      exitVx: -1.2,
      exitVy: 3.0,
      shotPattern: "sideFan",
      shotCooldown: 1,
      shotDelay: rightDelay,
      shotLimit: 1,
      onlyShootOnWait: true,
    }));
  }
}

function spawnHorizontalWave(direction) {
  const count = getWaveEnemyCount("horizontal");
  const fromLeft = direction === "left";
  const baseY = randomInt(66, 170);
  const shotOrderPattern = fromLeft
    ? pickShotOrderPattern([
      SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
      SHOT_ORDER_PATTERNS.ODD_FIRST,
      SHOT_ORDER_PATTERNS.EVEN_FIRST,
    ])
    : pickShotOrderPattern([
      SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
      SHOT_ORDER_PATTERNS.ODD_FIRST,
      SHOT_ORDER_PATTERNS.EVEN_FIRST,
    ]);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(22, 32);

    const x = fromLeft
      ? -size - i * 42
      : CANVAS_WIDTH + i * 42;

    const y = baseY + i * 20;

    const vx = fromLeft
      ? selectedDifficultyType === "hard" ? 2.25 : 1.95
      : selectedDifficultyType === "hard" ? -2.25 : -1.95;

    enemies.push(createEnemy({
      x,
      y,
      size,
      moveType: "horizontal",
      vx,
      vy: 0.08,
      shotPattern: "sideFan",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 38, 14, shotOrderPattern),
      shotLimit: 1,
    }));
  }
}

function spawnSideCrossWave() {
  const pairCount = getWaveEnemyCount("sideCross");
  const centerX = CANVAS_WIDTH / 2;
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
  ]);

  for (let i = 0; i < pairCount; i += 1) {
    const size = randomInt(24, 34);
    const y = 76 + i * 46;
    const targetOffset = i * 18;
    const leftDelay = getPatternedShotDelay(i, pairCount, 48, 16, shotOrderPattern);
    const rightDelay = leftDelay + randomInt(8, 14);

    enemies.push(createEnemy({
      x: -size - i * 24,
      y,
      size,
      moveType: "sideToCenter",
      vx: 1.95,
      vy: 0.12,
      targetX: centerX - 72 + targetOffset,
      waitFrame: selectedDifficultyType === "hard" ? 105 : 90,
      exitVx: 1.7,
      exitVy: 1.15,
      shotPattern: "sideFan",
      shotCooldown: 1,
      shotDelay: leftDelay,
      shotLimit: 1,
      onlyShootOnWait: true,
    }));

    enemies.push(createEnemy({
      x: CANVAS_WIDTH + i * 24,
      y,
      size,
      moveType: "sideToCenter",
      vx: -1.95,
      vy: 0.12,
      targetX: centerX + 72 - targetOffset,
      waitFrame: selectedDifficultyType === "hard" ? 105 : 90,
      exitVx: -1.7,
      exitVy: 1.15,
      shotPattern: "sideFan",
      shotCooldown: 1,
      shotDelay: rightDelay,
      shotLimit: 1,
      onlyShootOnWait: true,
    }));
  }
}

function spawnTopStopSideExitWave() {
  const count = getWaveEnemyCount("topStopSideExit");
  const spacing = CANVAS_WIDTH / (count + 1);
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
    SHOT_ORDER_PATTERNS.CENTER_OUT,
  ]);

  for (let i = 0; i < count; i += 1) {
    const size = randomInt(24, 34);
    const exitDirection = i % 2 === 0 ? -1 : 1;

    enemies.push(createEnemy({
      x: spacing * (i + 1) - size / 2,
      y: -size - i * 22,
      size,
      moveType: "stopAndSideExit",
      vx: 0,
      vy: 2.1,
      targetY: randomInt(74, 122),
      waitFrame: selectedDifficultyType === "hard" ? 120 : 105,
      exitVx: exitDirection * randomInt(14, 22) / 10,
      exitVy: 1.15,
      shotPattern: i % 2 === 0 ? "spread" : "aimed",
      shotCooldown: 1,
      shotDelay: getPatternedShotDelay(i, count, 50, 16, shotOrderPattern),
      shotLimit: 1,
      onlyShootOnWait: true,
    }));
  }
}

function spawnCircleBurstWave() {
  const size = 42;

  enemies.push(createEnemy({
    x: CANVAS_WIDTH / 2 - size / 2,
    y: -size,
    size,
    hp: selectedDifficultyType === "hard" ? 6 : 4,
    moveType: "stopAndGo",
    vx: 0,
    vy: 1.75,
    targetY: 86,
    waitFrame: selectedDifficultyType === "hard" ? 190 : 160,
    exitVx: 0,
    exitVy: 2.5,
    shotPattern: "circle",
    shotCooldown: selectedDifficultyType === "hard" ? 44 : 54,
    shotDelay: 8,
    shotLimit: selectedDifficultyType === "easy" ? 1 : selectedDifficultyType === "hard" ? 3 : 2,
    onlyShootOnWait: true,
  }));
}

function spawnTopCirclePairWave() {
  const size = 36;
  const positions = [
    { x: CANVAS_WIDTH * 0.32 - size / 2, targetY: 72 },
    { x: CANVAS_WIDTH * 0.68 - size / 2, targetY: 92 },
  ];
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
    SHOT_ORDER_PATTERNS.ODD_FIRST,
    SHOT_ORDER_PATTERNS.EVEN_FIRST,
  ]);

  positions.forEach((position, index) => {
    enemies.push(createEnemy({
      x: position.x,
      y: -size - index * 28,
      size,
      hp: selectedDifficultyType === "hard" ? 5 : 3,
      moveType: "stopAndGo",
      vx: 0,
      vy: 1.75,
      targetY: position.targetY,
      waitFrame: selectedDifficultyType === "hard" ? 175 : 150,
      exitVx: index === 0 ? -0.7 : 0.7,
      exitVy: 2.35,
      shotPattern: "circle",
      shotCooldown: selectedDifficultyType === "hard" ? 46 : 58,
      shotDelay: getPatternedShotDelay(index, positions.length, 8, 20, shotOrderPattern),
      shotLimit: selectedDifficultyType === "easy" ? 1 : 2,
      onlyShootOnWait: true,
    }));
  });
}

function spawnTopCircleTrioWave() {
  const size = 34;
  const positions = [
    { x: CANVAS_WIDTH * 0.22 - size / 2, targetY: 90 },
    { x: CANVAS_WIDTH * 0.5 - size / 2, targetY: 62 },
    { x: CANVAS_WIDTH * 0.78 - size / 2, targetY: 90 },
  ];
  const shotOrderPattern = pickShotOrderPattern([
    SHOT_ORDER_PATTERNS.CENTER_OUT,
    SHOT_ORDER_PATTERNS.OUTSIDE_IN,
    SHOT_ORDER_PATTERNS.LEFT_TO_RIGHT,
    SHOT_ORDER_PATTERNS.RIGHT_TO_LEFT,
  ]);

  positions.forEach((position, index) => {
    const exitDirection = index === 1 ? 0 : index === 0 ? -0.65 : 0.65;

    enemies.push(createEnemy({
      x: position.x,
      y: -size - index * 24,
      size,
      hp: selectedDifficultyType === "hard" ? 5 : 3,
      moveType: "stopAndGo",
      vx: 0,
      vy: 1.7,
      targetY: position.targetY,
      waitFrame: selectedDifficultyType === "hard" ? 180 : 155,
      exitVx: exitDirection,
      exitVy: 2.35,
      shotPattern: "circle",
      shotCooldown: selectedDifficultyType === "hard" ? 44 : 56,
      shotDelay: getPatternedShotDelay(index, positions.length, 8, 20, shotOrderPattern),
      shotLimit: selectedDifficultyType === "easy" ? 1 : 2,
      onlyShootOnWait: true,
    }));
  });
}