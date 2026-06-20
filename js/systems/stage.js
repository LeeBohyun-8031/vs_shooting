function resetStageState() {
  currentStageIndex = 0;
  stagePhase = "normal";
  stageStartTime = 0;
  bossIntroStartTime = 0;
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

  clearNormalStageActors();
}

function updateBossIntroPhase(timestamp) {
  const stageConfig = getCurrentStageConfig();

  if (timestamp - bossIntroStartTime < stageConfig.bossIntroDuration) {
    return;
  }

  stagePhase = "boss";
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
}