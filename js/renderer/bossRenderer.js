function drawBoss() {
  if (!boss) return;
  if (stagePhase !== "boss") return;

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

  drawBossHpBar();
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