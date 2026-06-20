const BOSS_ASSET_PATHS = {
  1: "assets/images/boss/stage1_boss.png",
  2: "assets/images/boss/stage2_boss.png",
};

const BOSS_ASSET_IMAGES = createBossAssetImages();

function createBossAssetImages() {
  const images = {};

  Object.keys(BOSS_ASSET_PATHS).forEach((stageNumber) => {
    const image = new Image();

    image.src = BOSS_ASSET_PATHS[stageNumber];
    image.loaded = false;
    image.failed = false;

    image.onload = () => {
      image.loaded = true;
    };

    image.onerror = () => {
      image.failed = true;
    };

    images[stageNumber] = image;
  });

  return images;
}

function drawBoss() {
  if (!boss) return;
  if (stagePhase !== "boss") return;

  if (!drawBossAssetImage()) {
    drawFallbackBoss();
  }

  drawBossHpBar();
}

function drawBossAssetImage() {
  const image = getCurrentBossAssetImage();

  if (!image) {
    return false;
  }

  const centerX = boss.x + boss.width / 2;
  const centerY = boss.y + boss.height / 2;
  const stageNumber = getBossRendererStageNumber();
  const isHit = boss.hitFlashTime > 0;

  const renderScale = stageNumber >= 2 ? 1.65 : 1.85;
  const drawWidth = boss.width * renderScale;
  const drawHeight = boss.height * renderScale;

  const drawX = centerX - drawWidth / 2;
  const drawY = centerY - drawHeight / 2 - 4;

  ctx.save();

  ctx.imageSmoothingEnabled = true;
  ctx.shadowColor = isHit ? "#fecaca" : getBossAssetGlowColor(stageNumber);
  ctx.shadowBlur = isHit ? 26 : 16;

  if (isHit) {
    ctx.filter = "brightness(1.45) saturate(1.25)";
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  ctx.restore();

  return true;
}

function getCurrentBossAssetImage() {
  const stageNumber = getBossRendererStageNumber();
  const image = BOSS_ASSET_IMAGES[stageNumber];

  if (!image || image.failed || !image.loaded) {
    return null;
  }

  return image;
}

function getBossAssetGlowColor(stageNumber) {
  if (stageNumber >= 2) {
    return "#7f1d1d";
  }

  return "#67e8f9";
}

function drawFallbackBoss() {
  const centerX = boss.x + boss.width / 2;
  const centerY = boss.y + boss.height / 2;
  const isHit = boss.hitFlashTime > 0;

  ctx.save();

  ctx.shadowColor = isHit ? "#fecaca" : "#c4b5fd";
  ctx.shadowBlur = isHit ? 22 : 14;

  ctx.fillStyle = isHit ? "#fca5a5" : "#7c3aed";
  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    boss.width / 2,
    boss.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#312e81";
  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY + 4,
    boss.width * 0.32,
    boss.height * 0.28,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.fillStyle = "#fef2f2";
  ctx.beginPath();
  ctx.arc(centerX - boss.width * 0.18, centerY - 8, 5, 0, Math.PI * 2);
  ctx.arc(centerX + boss.width * 0.18, centerY - 8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    boss.width / 2 - 5,
    boss.height / 2 - 5,
    0,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.restore();
}

function drawBossHpBar() {
  if (!boss) return;
  if (stagePhase !== "boss") return;

  const barWidth = 340;
  const barHeight = 10;
  const x = CANVAS_WIDTH / 2 - barWidth / 2;
  const y = 58;
  const hpRatio = boss.maxHp > 0 ? boss.hp / boss.maxHp : 0;

  ctx.save();

  ctx.fillStyle = "rgba(15, 23, 42, 0.76)";
  ctx.fillRect(x, y, barWidth, barHeight);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(x, y, barWidth * hpRatio, barHeight);

  ctx.strokeStyle = "rgba(254, 202, 202, 0.7)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, barWidth, barHeight);

  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "bold 13px Arial";
  ctx.fillStyle = "#fecaca";
  ctx.fillText(boss.name, CANVAS_WIDTH / 2, y - 5);

  ctx.restore();
}

function getBossRendererStageNumber() {
  if (typeof getCurrentStageConfig === "function") {
    const stageConfig = getCurrentStageConfig();

    if (stageConfig && Number.isFinite(stageConfig.stage)) {
      return stageConfig.stage;
    }
  }

  if (typeof currentStageIndex === "number" && Number.isFinite(currentStageIndex)) {
    return currentStageIndex + 1;
  }

  return 1;
}