const ENEMY_ASSET_PATHS_BY_STAGE = {
  1: [
    "assets/images/enemy/stage1/stage1_enemy_1.png",
    "assets/images/enemy/stage1/stage1_enemy_2.png",
    "assets/images/enemy/stage1/stage1_enemy_3.png",
    "assets/images/enemy/stage1/stage1_enemy_4.png",
  ],
  2: [
    "assets/images/enemy/stage2/stage2_enemy_1.png",
    "assets/images/enemy/stage2/stage2_enemy_2.png",
    "assets/images/enemy/stage2/stage2_enemy_3.png",
    "assets/images/enemy/stage2/stage2_enemy_4.png",
  ],
};

const ENEMY_ASSET_IMAGES_BY_STAGE = createEnemyAssetImagesByStage();

function createEnemyAssetImagesByStage() {
  const imagesByStage = {};

  Object.keys(ENEMY_ASSET_PATHS_BY_STAGE).forEach((stageNumber) => {
    imagesByStage[stageNumber] = ENEMY_ASSET_PATHS_BY_STAGE[stageNumber].map((path) => {
      const image = new Image();

      image.src = path;
      image.loaded = false;
      image.failed = false;

      image.onload = () => {
        image.loaded = true;
      };

      image.onerror = () => {
        image.failed = true;
      };

      return image;
    });
  });

  return imagesByStage;
}

function drawEnemies() {
  const stageNumber = getEnemyRendererStageNumber();

  enemies.forEach((enemy) => {
    if (drawEnemyAsset(enemy, stageNumber)) {
      return;
    }

    drawFallbackEnemy(enemy);
  });
}

function drawEnemyAsset(enemy, stageNumber) {
  const image = getEnemyAssetImage(enemy, stageNumber);

  if (!image) {
    return false;
  }

  const centerX = enemy.x + enemy.width / 2;
  const centerY = enemy.y + enemy.height / 2;

  const renderScale = getEnemyAssetRenderScale(enemy, stageNumber);
  const drawWidth = enemy.width * renderScale;
  const drawHeight = enemy.height * renderScale;

  const drawX = centerX - drawWidth / 2;
  const drawY = centerY - drawHeight / 2 - 2;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  return true;
}

function getEnemyAssetImage(enemy, stageNumber) {
  const images = ENEMY_ASSET_IMAGES_BY_STAGE[stageNumber];

  if (!images || images.length === 0) {
    return null;
  }

  const variantIndex = getEnemyAssetVariantIndex(enemy, stageNumber, images.length);
  const image = images[variantIndex];

  if (!image || image.failed || !image.loaded) {
    return null;
  }

  return image;
}

function getEnemyAssetVariantIndex(enemy, stageNumber, imageCount) {
  if (
    enemy.renderStageNumber === stageNumber &&
    typeof enemy.renderVariantIndex === "number"
  ) {
    return enemy.renderVariantIndex;
  }

  enemy.renderStageNumber = stageNumber;
  enemy.renderVariantIndex = Math.floor(Math.random() * imageCount);

  return enemy.renderVariantIndex;
}

function getEnemyAssetRenderScale(enemy, stageNumber) {
  if (stageNumber >= 2) {
    return enemy.hp >= 2 ? 2.15 : 2;
  }

  return enemy.hp >= 2 ? 2.05 : 1.9;
}

function drawFallbackEnemy(enemy) {
  const centerX = enemy.x + enemy.width / 2;
  const centerY = enemy.y + enemy.height / 2;

  ctx.fillStyle = enemy.hp >= 2 ? "#a855f7" : "#ef4444";
  ctx.beginPath();
  ctx.arc(centerX, centerY, enemy.width / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.arc(centerX - enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
  ctx.arc(centerX + enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, enemy.width / 2 - 3, 0, Math.PI * 2);
  ctx.stroke();
}

function getEnemyRendererStageNumber() {
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