function resetStageState() {
  currentStageIndex = 0;
  stagePhase = "normal";
  stageStartTime = 0;
  bossIntroStartTime = 0;
  stageClearStartTime = 0;
  boss = null;
}

function getCurrentStageConfig() {
  return STAGE_CONFIGS[currentStageIndex] || STAGE_CONFIGS[0];
}

function startStage(stageIndex) {
  currentStageIndex = clamp(stageIndex ?? 0, 0, STAGE_CONFIGS.length - 1);
  boss = null;

  startNormalPhase();
}

function startNormalPhase() {
  stagePhase = "normal";
  stageStartTime = performance.now();
  bossIntroStartTime = 0;
  stageClearStartTime = 0;
  boss = null;

  clearStageTransitionActors();

  lastEnemySpawnTime = performance.now();
}

function updateStage(timestamp) {
  if (gameState !== "playing") return;

  if (stagePhase === "normal") {
    updateNormalPhase(timestamp);
    return;
  }

  if (stagePhase === "bossIntro") {
    updateBossIntroPhase(timestamp);
    return;
  }

  if (stagePhase === "clear") {
    updateStageClearPhase(timestamp);
  }
}

function updateNormalPhase(timestamp) {
  if (!isNormalPhaseTimeOver(timestamp)) return;

  startBossIntro(timestamp);
}

function isNormalPhaseTimeOver(timestamp) {
  const stageConfig = getCurrentStageConfig();

  return timestamp - stageStartTime >= stageConfig.normalDuration;
}

function startBossIntro(timestamp) {
  stagePhase = "bossIntro";
  bossIntroStartTime = timestamp;
  stageClearStartTime = 0;

  clearNormalStageActors();
}

function updateBossIntroPhase(timestamp) {
  const stageConfig = getCurrentStageConfig();

  if (timestamp - bossIntroStartTime < stageConfig.bossIntroDuration) {
    return;
  }

  startBossPhase();
}

function startBossPhase() {
  stagePhase = "boss";
  bossIntroStartTime = 0;
  stageClearStartTime = 0;

  if (typeof spawnCurrentStageBoss === "function") {
    spawnCurrentStageBoss();
  }
}

function startStageClear(timestamp) {
  clearStageTransitionActors();

  if (!hasNextStage()) {
    finishFinalStageWithRanking();
    return;
  }

  stagePhase = "clear";
  stageClearStartTime = timestamp;
  bossIntroStartTime = 0;

  if (typeof resetInputState === "function") {
    resetInputState();
  }
}

function updateStageClearPhase(timestamp) {
  // 자동 진행하지 않는다.
  // 다음 스테이지가 있는 경우에만 Z / X 입력으로 선택한다.
}

function hasNextStage() {
  return currentStageIndex + 1 < STAGE_CONFIGS.length;
}

function getNextStageConfig() {
  if (!hasNextStage()) return null;

  return STAGE_CONFIGS[currentStageIndex + 1];
}

function isStageClearInputReady() {
  if (stagePhase !== "clear") return false;
  if (stageClearStartTime <= 0) return false;

  return performance.now() - stageClearStartTime >= 500;
}

function goToNextStageFromClear() {
  if (gameState !== "playing") return;
  if (stagePhase !== "clear") return;
  if (!isStageClearInputReady()) return;

  if (!hasNextStage()) {
    finishFinalStageWithRanking();
    return;
  }

  if (typeof resetInputState === "function") {
    resetInputState();
  }

  clearStageTransitionActors();
  startStage(currentStageIndex + 1);
}

function finishGameFromStageClear() {
  if (gameState !== "playing") return;
  if (stagePhase !== "clear") return;
  if (!isStageClearInputReady()) return;

  clearStageTransitionActors();

  if (typeof resetInputState === "function") {
    resetInputState();
  }

  endGame();
}

function finishFinalStageWithRanking() {
  clearStageTransitionActors();

  if (typeof resetInputState === "function") {
    resetInputState();
  }

  endGame(true);
}

function clearNormalStageActors() {
  enemies.forEach((enemy) => {
    createExplosion(
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height / 2,
      8
    );
  });

  enemyBullets.forEach((enemyBullet) => {
    createHitEffect(enemyBullet.x, enemyBullet.y, 3);
  });

  enemies = [];
  enemyBullets = [];
}

function clearStageTransitionActors() {
  enemies = [];
  enemyBullets = [];
  bullets = [];
  items = [];
  boss = null;
}

function isEnemySpawnAllowed() {
  return gameState === "playing" && stagePhase === "normal";
}

function getStageElapsedTime() {
  if (stageStartTime <= 0) return 0;

  return performance.now() - stageStartTime;
}

function getStageRemainingTime() {
  const stageConfig = getCurrentStageConfig();

  return Math.max(stageConfig.normalDuration - getStageElapsedTime(), 0);
}

function applyStagePauseDuration(pauseDuration) {
  if (!Number.isFinite(pauseDuration) || pauseDuration <= 0) return;

  if (stageStartTime > 0) {
    stageStartTime += pauseDuration;
  }

  if (bossIntroStartTime > 0) {
    bossIntroStartTime += pauseDuration;
  }

  if (stageClearStartTime > 0) {
    stageClearStartTime += pauseDuration;
  }
}