function drawBackground() {
  const stageNumber = getNotebookBackgroundStageNumber();
  const time = performance.now();

  drawNotebookPaperBase(stageNumber);
  drawNotebookLines(stageNumber, time);
  drawNotebookMarginLine(stageNumber);
  drawNotebookDoodleNoise(stageNumber, time);
  drawNotebookStageMood(stageNumber, time);
}

function getNotebookBackgroundStageNumber() {
  if (typeof getCurrentStageConfig === "function") {
    const stageConfig = getCurrentStageConfig();

    if (stageConfig && Number.isFinite(stageConfig.stage)) {
      return stageConfig.stage;
    }
  }

  if (Number.isFinite(currentStageIndex)) {
    return currentStageIndex + 1;
  }

  return 1;
}

function drawNotebookPaperBase(stageNumber) {
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (stageNumber >= 2) {
    gradient.addColorStop(0, "#fff7ed");
    gradient.addColorStop(0.58, "#fff1f2");
    gradient.addColorStop(1, "#fee2e2");
  } else {
    gradient.addColorStop(0, "#fffef7");
    gradient.addColorStop(0.58, "#fefce8");
    gradient.addColorStop(1, "#f8fafc");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#92400e";
  ctx.fillRect(0, 0, CANVAS_WIDTH, 10);
  ctx.fillRect(0, CANVAS_HEIGHT - 12, CANVAS_WIDTH, 12);
  ctx.restore();
}

function drawNotebookLines(stageNumber, time) {
  const lineGap = 24;
  const scrollOffset = (time * 0.018) % lineGap;

  ctx.save();

  ctx.lineWidth = 1;

  if (stageNumber >= 2) {
    ctx.strokeStyle = "rgba(248, 113, 113, 0.32)";
  } else {
    ctx.strokeStyle = "rgba(96, 165, 250, 0.28)";
  }

  for (let y = -lineGap + scrollOffset; y < CANVAS_HEIGHT + lineGap; y += lineGap) {
    drawLooseNotebookLine(y, stageNumber);
  }

  ctx.restore();
}

function drawLooseNotebookLine(y, stageNumber) {
  const waveAmount = stageNumber >= 2 ? 1.4 : 0.7;
  const segmentWidth = 42;

  ctx.beginPath();

  for (let x = 0; x <= CANVAS_WIDTH; x += segmentWidth) {
    const waveY = y + Math.sin((x + y) * 0.025) * waveAmount;

    if (x === 0) {
      ctx.moveTo(x, waveY);
    } else {
      ctx.lineTo(x, waveY);
    }
  }

  ctx.stroke();
}

function drawNotebookMarginLine(stageNumber) {
  const marginX = 46;

  ctx.save();
  ctx.lineWidth = stageNumber >= 2 ? 2 : 1.5;
  ctx.strokeStyle = stageNumber >= 2
    ? "rgba(239, 68, 68, 0.5)"
    : "rgba(248, 113, 113, 0.38)";

  ctx.beginPath();
  ctx.moveTo(marginX, 0);
  ctx.lineTo(marginX + 1.5, CANVAS_HEIGHT);
  ctx.stroke();

  ctx.restore();
}

function drawNotebookDoodleNoise(stageNumber, time) {
  const doodleCount = stageNumber >= 2 ? 34 : 22;

  ctx.save();

  for (let i = 0; i < doodleCount; i += 1) {
    const seed = i * 97.31;
    const x = (Math.sin(seed) * 0.5 + 0.5) * CANVAS_WIDTH;
    const y = ((Math.cos(seed * 1.23) * 0.5 + 0.5) * CANVAS_HEIGHT + time * 0.01) % CANVAS_HEIGHT;
    const size = 2 + ((i * 7) % 5);

    ctx.globalAlpha = stageNumber >= 2 ? 0.12 : 0.075;
    ctx.strokeStyle = stageNumber >= 2 ? "#7f1d1d" : "#334155";
    ctx.lineWidth = 1;

    if (i % 3 === 0) {
      drawTinyDoodleCross(x, y, size);
    } else if (i % 3 === 1) {
      drawTinyDoodleCircle(x, y, size);
    } else {
      drawTinyDoodleScratch(x, y, size);
    }
  }

  ctx.restore();
}

function drawTinyDoodleCross(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
}

function drawTinyDoodleCircle(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTinyDoodleScratch(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x - size * 0.2, y - size * 0.6);
  ctx.lineTo(x + size * 0.45, y + size * 0.35);
  ctx.lineTo(x + size, y - size * 0.25);
  ctx.stroke();
}

function drawNotebookStageMood(stageNumber, time) {
  if (stageNumber >= 2) {
    drawStageTwoNotebookWarningMarks(time);
    return;
  }

  drawStageOneNotebookCornerDoodles(time);
}

function drawStageOneNotebookCornerDoodles(time) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 1.4;

  const bounce = Math.sin(time * 0.002) * 2;

  drawLooseStar(CANVAS_WIDTH - 42, 42 + bounce, 8);
  drawLooseStar(24, CANVAS_HEIGHT - 44 - bounce, 6);

  ctx.restore();
}

function drawStageTwoNotebookWarningMarks(time) {
  ctx.save();

  const pulse = 0.16 + Math.sin(time * 0.004) * 0.04;

  ctx.globalAlpha = pulse;
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "#991b1b";
  ctx.lineWidth = 2;

  drawLooseWarningUnderline(70, 68);
  drawLooseWarningUnderline(CANVAS_WIDTH - 154, CANVAS_HEIGHT - 64);

  ctx.globalAlpha = 0.2;
  drawLooseStar(CANVAS_WIDTH - 36, 38, 10);
  drawLooseStar(30, CANVAS_HEIGHT - 38, 9);

  ctx.restore();
}

function drawLooseWarningUnderline(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 28, y + 3);
  ctx.lineTo(x + 62, y - 2);
  ctx.lineTo(x + 96, y + 2);
  ctx.stroke();
}

function drawLooseStar(x, y, radius) {
  ctx.beginPath();

  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
    const pointRadius = i % 2 === 0 ? radius : radius * 0.42;
    const pointX = x + Math.cos(angle) * pointRadius;
    const pointY = y + Math.sin(angle) * pointRadius;

    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }

  ctx.closePath();
  ctx.stroke();
}