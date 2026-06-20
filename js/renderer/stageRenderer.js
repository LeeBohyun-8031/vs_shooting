function drawStageOverlay() {
  if (gameState !== "playing") return;

  if (stagePhase === "bossIntro") {
    drawBossApproachingOverlay();
    return;
  }

  if (stagePhase === "clear") {
    drawStageClearOverlay();
    return;
  }

  if (stagePhase === "gameClear") {
    drawGameClearOverlay();
  }
}

function drawBossApproachingOverlay() {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 - 30;
  const pulse = 0.65 + Math.sin(performance.now() * 0.008) * 0.35;

  ctx.save();

  ctx.fillStyle = `rgba(2, 6, 23, ${0.32 + pulse * 0.18})`;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 18;

  ctx.fillStyle = "#fecaca";
  ctx.font = "bold 28px Arial";
  ctx.fillText("BOSS APPROACHING", centerX, centerY);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 15px Arial";

  const stageConfig =
    typeof getCurrentStageConfig === "function"
      ? getCurrentStageConfig()
      : null;

  const stageName = stageConfig ? stageConfig.name : "Stage";

  ctx.fillText(stageName, centerX, centerY + 34);

  ctx.restore();
}

function drawStageTimer() {
  if (gameState !== "playing") return;

  let text = "";
  let markerColor = "rgba(250, 204, 21, 0.45)";
  let accentColor = "#2563eb";

  if (stagePhase === "normal") {
    if (typeof getStageRemainingTime !== "function") return;

    const remainingTime = getStageRemainingTime();
    const timeText = formatStageTime(remainingTime);

    text = `TIME ${timeText}`;
  }

  if (stagePhase === "boss") {
    text = "BOSS STAGE";
    markerColor = "rgba(244, 114, 182, 0.38)";
    accentColor = "#dc2626";
  }

  if (!text) return;

  ctx.save();

  ctx.font = "900 13px 'Comic Sans MS', 'Segoe Print', Arial";

  const iconWidth = 18;
  const horizontalPadding = 10;
  const panelWidth = Math.ceil(ctx.measureText(text).width) + iconWidth + horizontalPadding * 2;
  const panelHeight = 31;
  const isMobileLayout =
    typeof isMobileControlMode === "function" && isMobileControlMode();
  const panelX = isMobileLayout
    ? 12
    : CANVAS_WIDTH - panelWidth - 12;
  const panelY = 10;

  ctx.translate(panelX + panelWidth / 2, panelY + panelHeight / 2);
  ctx.rotate(isMobileLayout ? 0.012 : -0.012);

  const left = -panelWidth / 2;
  const top = -panelHeight / 2;

  ctx.fillStyle = "rgba(17, 24, 39, 0.22)";
  drawStageTimerRoundedRect(left + 3, top + 4, panelWidth, panelHeight, 8);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 250, 240, 0.94)";
  drawStageTimerRoundedRect(left, top, panelWidth, panelHeight, 8);
  ctx.fill();

  ctx.save();
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = "rgba(17, 24, 39, 0.78)";
  ctx.lineWidth = 1.7;
  drawStageTimerRoundedRect(left, top, panelWidth, panelHeight, 8);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = markerColor;
  ctx.fillRect(left + horizontalPadding + iconWidth, top + 16, panelWidth - horizontalPadding * 2 - iconWidth, 8);

  ctx.fillStyle = "rgba(250, 204, 21, 0.42)";
  ctx.fillRect(-14, top - 2, 28, 6);

  drawStageTimerIcon(left + horizontalPadding + 6, 0, stagePhase === "boss", accentColor);

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#111827";
  ctx.fillText(text, left + horizontalPadding + iconWidth, 1);

  ctx.restore();
}

function drawStageTimerRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStageTimerIcon(x, y, isBossStage, accentColor) {
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";

  if (isBossStage) {
    ctx.font = "900 17px 'Comic Sans MS', Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", x, y + 1);
    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 3.5);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 3, y + 2);
  ctx.stroke();

  ctx.restore();
}

function formatStageTime(milliseconds) {
  const totalSeconds = Math.ceil(Math.max(milliseconds, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function drawStageClearOverlay() {
  if (typeof hasNextStage === "function" && !hasNextStage()) {
    return;
  }

  const nextStageConfig =
    typeof getNextStageConfig === "function"
      ? getNextStageConfig()
      : null;

  if (!nextStageConfig) return;

  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 - 20;
  const pulse = 0.72 + Math.sin(performance.now() * 0.006) * 0.28;

  const stageConfig =
    typeof getCurrentStageConfig === "function"
      ? getCurrentStageConfig()
      : null;

  const stageName = stageConfig ? stageConfig.name : "Stage";
  const bonus = getRenderableStageClearBonus();

  ctx.save();

  ctx.fillStyle = "rgba(17, 24, 39, 0.28)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawStageClearPanel(centerX, centerY, pulse, stageName, nextStageConfig, bonus);

  ctx.restore();
}

function drawStageClearPanel(
  centerX,
  centerY,
  pulse,
  stageName,
  nextStageConfig,
  bonus
) {
  const panelWidth = 350;
  const panelHeight = 210;
  const panelX = centerX - panelWidth / 2;
  const panelY = centerY - 96;

  ctx.save();

  drawNotebookOverlayPanel(panelX, panelY, panelWidth, panelHeight, {
    tapeColor: "rgba(250, 204, 21, 0.46)",
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawMarkerText("STAGE CLEAR", centerX, panelY + 42, {
    font: "bold 31px Arial",
    textColor: "#111827",
    markerColor: "rgba(250, 204, 21, 0.48)",
    markerWidth: 250,
    markerHeight: 18,
  });

  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`${stageName} 클리어`, centerX, panelY + 78);

  drawMarkerText(`CLEAR BONUS  +${formatScoreNumber(bonus.total)}`, centerX, panelY + 108, {
    font: "bold 16px Arial",
    textColor: "#dc2626",
    markerColor: "rgba(250, 204, 21, 0.36)",
    markerWidth: 230,
    markerHeight: 12,
  });

  ctx.font = "bold 16px Arial";

  ctx.fillStyle = "#2563eb";
  ctx.fillText(`Z : ${nextStageConfig.name} 이동`, centerX, panelY + 150);

  ctx.fillStyle = "#dc2626";
  ctx.fillText("X : 게임 종료", centerX, panelY + 178);

  ctx.restore();
}

function drawGameClearOverlay() {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 - 20;
  const pulse = 0.72 + Math.sin(performance.now() * 0.006) * 0.28;
  const progress = getGameClearOverlayProgress();
  const bonus = getRenderableStageClearBonus();

  ctx.save();

  ctx.fillStyle = "rgba(17, 24, 39, 0.32)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawGameClearPanel(centerX, centerY, pulse, progress, bonus);

  ctx.restore();
}

function getGameClearOverlayProgress() {
  if (stageClearStartTime <= 0) return 0;
  if (typeof GAME_CLEAR_OVERLAY_DURATION !== "number") return 0;

  const elapsed = performance.now() - stageClearStartTime;

  return clamp(elapsed / GAME_CLEAR_OVERLAY_DURATION, 0, 1);
}

function drawGameClearPanel(centerX, centerY, pulse, progress, bonus) {
  const panelWidth = 370;
  const panelHeight = 224;
  const panelX = centerX - panelWidth / 2;
  const panelY = centerY - 104;

  ctx.save();

  ctx.globalAlpha = Math.min(1, 0.35 + progress * 1.4);

  drawNotebookOverlayPanel(panelX, panelY, panelWidth, panelHeight, {
    tapeColor: "rgba(244, 114, 182, 0.36)",
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawMarkerText("GAME CLEAR!", centerX, panelY + 44, {
    font: "bold 34px Arial",
    textColor: "#111827",
    markerColor: "rgba(250, 204, 21, 0.5)",
    markerWidth: 260,
    markerHeight: 19,
  });

  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 15px Arial";
  ctx.fillText("모든 스테이지를 클리어했습니다", centerX, panelY + 84);

  drawMarkerText(`CLEAR BONUS  +${formatScoreNumber(bonus.total)}`, centerX, panelY + 116, {
    font: "bold 16px Arial",
    textColor: "#dc2626",
    markerColor: "rgba(250, 204, 21, 0.34)",
    markerWidth: 235,
    markerHeight: 12,
  });

  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 17px Arial";
  ctx.fillText(`FINAL SCORE  ${formatScoreNumber(score)}`, centerX, panelY + 150);

  ctx.fillStyle = "rgba(17, 24, 39, 0.72)";
  ctx.font = "bold 13px Arial";
  ctx.fillText("랭킹 등록 화면으로 이동 중...", centerX, panelY + 184);

  ctx.restore();
}

function getRenderableStageClearBonus() {
  if (typeof getLastStageClearBonus === "function") {
    const bonus = getLastStageClearBonus();

    if (bonus && Number.isFinite(bonus.total)) {
      return bonus;
    }
  }

  return {
    stage: 0,
    baseScore: 0,
    lifeScore: 0,
    bombScore: 0,
    difficultyMultiplier: 1,
    total: 0,
  };
}

function drawNotebookOverlayPanel(x, y, width, height, options = {}) {
  const tapeColor = options.tapeColor || "rgba(250, 204, 21, 0.42)";

  ctx.save();

  ctx.fillStyle = "rgba(17, 24, 39, 0.22)";
  ctx.fillRect(x + 8, y + 9, width, height);

  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = "rgba(96, 165, 250, 0.16)";
  for (let lineY = y + 28; lineY < y + height - 10; lineY += 24) {
    ctx.fillRect(x + 12, lineY, width - 24, 1);
  }

  ctx.fillStyle = "rgba(248, 113, 113, 0.22)";
  ctx.fillRect(x + 32, y + 8, 2, height - 16);

  ctx.strokeStyle = "rgba(17, 24, 39, 0.86)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

  ctx.fillStyle = tapeColor;
  ctx.fillRect(x + width / 2 - 54, y - 12, 108, 24);

  ctx.restore();
}

function drawMarkerText(text, x, y, options) {
  const font = options.font || "bold 24px Arial";
  const textColor = options.textColor || "#111827";
  const markerColor = options.markerColor || "rgba(250, 204, 21, 0.42)";
  const markerWidth = options.markerWidth || 180;
  const markerHeight = options.markerHeight || 14;

  ctx.save();

  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = markerColor;
  ctx.fillRect(
    x - markerWidth / 2,
    y + markerHeight * 0.05,
    markerWidth,
    markerHeight
  );

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);

  ctx.restore();
}

function formatScoreNumber(value) {
  if (!Number.isFinite(value)) return "0";

  return Math.round(value).toLocaleString("ko-KR");
}
