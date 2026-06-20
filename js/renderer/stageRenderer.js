function drawStageOverlay() {
  if (gameState !== "playing") return;

  if (stagePhase === "bossIntro") {
    drawBossApproachingOverlay();
    return;
  }

  if (stagePhase === "clear") {
    drawStageClearOverlay();
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
  let textColor = "#bae6fd";
  let borderColor = "rgba(125, 211, 252, 0.35)";

  if (stagePhase === "normal") {
    if (typeof getStageRemainingTime !== "function") return;

    const remainingTime = getStageRemainingTime();
    const timeText = formatStageTime(remainingTime);

    text = `TIME ${timeText}`;
    textColor = "#bae6fd";
    borderColor = "rgba(125, 211, 252, 0.35)";
  }

  if (stagePhase === "boss") {
    text = "BOSS STAGE";
    textColor = "#fecaca";
    borderColor = "rgba(248, 113, 113, 0.45)";
  }

  if (!text) return;

  ctx.save();

  ctx.textAlign = "right";
  ctx.textBaseline = "top";

  ctx.font = "bold 13px Arial";

  const x = CANVAS_WIDTH - 12;
  const y = 10;
  const paddingX = 8;
  const paddingY = 5;
  const textWidth = ctx.measureText(text).width;

  ctx.fillStyle = "rgba(2, 6, 23, 0.58)";
  ctx.fillRect(
    x - textWidth - paddingX * 2,
    y - 3,
    textWidth + paddingX * 2,
    23
  );

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    x - textWidth - paddingX * 2,
    y - 3,
    textWidth + paddingX * 2,
    23
  );

  ctx.fillStyle = textColor;
  ctx.fillText(text, x - paddingX, y + paddingY - 1);

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

  ctx.save();

  ctx.fillStyle = "rgba(2, 6, 23, 0.52)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawStageClearPanel(centerX, centerY, pulse, stageName, nextStageConfig);

  ctx.restore();
}

function drawStageClearPanel(centerX, centerY, pulse, stageName, nextStageConfig) {
  const panelWidth = 330;
  const panelHeight = 160;
  const panelX = centerX - panelWidth / 2;
  const panelY = centerY - 64;

  ctx.save();

  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

  ctx.strokeStyle = `rgba(125, 211, 252, ${0.42 + pulse * 0.28})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 16;

  ctx.fillStyle = `rgba(186, 230, 253, ${pulse})`;
  ctx.font = "bold 30px Arial";
  ctx.fillText("STAGE CLEAR", centerX, panelY + 38);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`${stageName} 클리어`, centerX, panelY + 72);

  ctx.font = "bold 15px Arial";

  ctx.fillStyle = "#bae6fd";
  ctx.fillText(`Z : ${nextStageConfig.name} 이동`, centerX, panelY + 108);

  ctx.fillStyle = "#fecaca";
  ctx.fillText("X : 게임 종료", centerX, panelY + 134);

  ctx.restore();
}