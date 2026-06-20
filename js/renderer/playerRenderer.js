const PLAYER_ASSET_PATHS = {
  homing: "assets/images/player/player_homing.png",
  power: "assets/images/player/player_power.png",
};

const PLAYER_ASSET_IMAGES = createPlayerAssetImages();

function createPlayerAssetImages() {
  const images = {};

  Object.keys(PLAYER_ASSET_PATHS).forEach((type) => {
    const image = new Image();

    image.src = PLAYER_ASSET_PATHS[type];
    image.loaded = false;
    image.failed = false;

    image.onload = () => {
      image.loaded = true;
    };

    image.onerror = () => {
      image.failed = true;
    };

    images[type] = image;
  });

  return images;
}

function drawPlayer() {
  if (!player) return;

  if (drawPlayerAssetImage()) {
    return;
  }

  if (
    player.invincibleTime > 0 &&
    Math.floor(player.invincibleTime / 6) % 2 === 0
  ) {
    return;
  }

  const centerX = player.x + player.width / 2;

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(centerX, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.moveTo(centerX, player.y + 8);
  ctx.lineTo(centerX - 8, player.y + player.height - 6);
  ctx.lineTo(centerX + 8, player.y + player.height - 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(centerX - 8, player.y + player.height);
  ctx.lineTo(centerX, player.y + player.height + 12);
  ctx.lineTo(centerX + 8, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function drawAssistUnits() {
  if (!player || gameState !== "playing") return;

  if (getCurrentPlayerAssetType() === "power") {
    drawPowerMissilePorts();
    return;
  }

  if (typeof getAssistShotPositions !== "function") return;

  const assistPositions = getAssistShotPositions();

  assistPositions.forEach((position) => {
    drawAssistUnit(position);
  });
}

function drawAssistUnit(position) {
  const isPowerType = player.type === "power";

  const mainColor = isPowerType ? "#facc15" : "#22c55e";
  const subColor = isPowerType ? "#fef3c7" : "#dcfce7";
  const glowColor = isPowerType ? "#fde68a" : "#86efac";

  ctx.save();

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 14;

  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.fillStyle = subColor;
  ctx.beginPath();
  ctx.arc(position.x - 2.5, position.y - 2.5, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawPowerMissilePorts() {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  drawPowerMissilePort(centerX - 30, centerY + 10, -0.18);
  drawPowerMissilePort(centerX + 30, centerY + 10, 0.18);
}

function drawPowerMissilePort(x, y, rotation) {
  const width = 11;
  const height = 28;

  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = "#111827";
  ctx.fillRect(-width / 2, -height / 2, width, height);

  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 2;
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  ctx.fillStyle = "#f97316";
  ctx.fillRect(-width / 2 + 2, height / 2 - 6, width - 4, 4);

  ctx.restore();
}

function drawPlayerHitbox() {
  if (!player) return;
  if (!keys.ShiftLeft && !keys.ShiftRight) return;
  if (typeof getPlayerHitbox !== "function") return;

  const hitbox = getPlayerHitbox(player);
  const centerX = hitbox.x + hitbox.width / 2;
  const centerY = hitbox.y + hitbox.height / 2;

  ctx.save();

  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 10;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 12;

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

  ctx.restore();
}

function getCurrentPlayerAssetType() {
  if (typeof selectedCharacterType === "string") {
    return selectedCharacterType;
  }

  if (
    typeof selectedCharacterConfig === "object" &&
    selectedCharacterConfig &&
    typeof selectedCharacterConfig.type === "string"
  ) {
    return selectedCharacterConfig.type;
  }

  if (
    typeof selectedCharacterIndex === "number" &&
    Array.isArray(CHARACTER_CONFIGS) &&
    CHARACTER_CONFIGS[selectedCharacterIndex] &&
    typeof CHARACTER_CONFIGS[selectedCharacterIndex].type === "string"
  ) {
    return CHARACTER_CONFIGS[selectedCharacterIndex].type;
  }

  if (player && typeof player.characterType === "string") {
    return player.characterType;
  }

  if (player && typeof player.type === "string") {
    return player.type;
  }

  return "homing";
}

function getCurrentPlayerAssetImage() {
  const type = getCurrentPlayerAssetType();
  const image = PLAYER_ASSET_IMAGES[type];

  if (!image || image.failed || !image.loaded) {
    return null;
  }

  return image;
}

function drawPlayerAssetImage() {
  const image = getCurrentPlayerAssetImage();

  if (!image) {
    return false;
  }

  const assetType = getCurrentPlayerAssetType();

  const renderWidth = assetType === "power" ? 78 : 72;
  const renderHeight = assetType === "power" ? 78 : 72;

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  const drawX = centerX - renderWidth / 2;
  const drawY = centerY - renderHeight / 2 - 6;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, drawX, drawY, renderWidth, renderHeight);
  ctx.restore();

  return true;
}