function drawBullets() {
  bullets.forEach((bullet) => {
    if (bullet.type === "needle") {
      drawNeedleBullet(bullet);
      return;
    }

    drawPlayerBullet(bullet);
  });
}

function drawPlayerBullet(bullet) {
  const centerX = bullet.x + bullet.width / 2;
  const topY = bullet.y;
  const bottomY = bullet.y + bullet.height;
  const radius = Math.max(bullet.width * 0.8, 3);

  ctx.save();

  ctx.shadowColor = bullet.glowColor || "#93c5fd";
  ctx.shadowBlur = 8;

  ctx.strokeStyle = bullet.color || "#2563eb";
  ctx.lineWidth = Math.max(bullet.width, 3);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(centerX - 0.8, bottomY);
  ctx.lineTo(centerX + 0.6, topY + radius);
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.fillStyle = bullet.color || "#60a5fa";
  ctx.beginPath();
  ctx.arc(centerX, topY + radius * 0.6, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.beginPath();
  ctx.arc(centerX - radius * 0.35, topY + radius * 0.25, Math.max(radius * 0.28, 1.2), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(30, 64, 175, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, topY + radius * 0.6, radius + 1.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawNeedleBullet(bullet) {
  const centerX = bullet.x + bullet.width / 2;
  const topY = bullet.y;
  const bottomY = bullet.y + bullet.height;
  const halfWidth = Math.max(bullet.width * 1.1, 4);

  ctx.save();

  ctx.shadowColor = bullet.glowColor || "#fb923c";
  ctx.shadowBlur = 10;

  ctx.strokeStyle = "#7f1d1d";
  ctx.lineWidth = Math.max(bullet.width + 2, 5);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(centerX, bottomY + 2);
  ctx.lineTo(centerX, topY);
  ctx.stroke();

  ctx.strokeStyle = bullet.color || "#ef4444";
  ctx.lineWidth = Math.max(bullet.width, 3);

  ctx.beginPath();
  ctx.moveTo(centerX, bottomY);
  ctx.lineTo(centerX, topY);
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(centerX, topY - 3);
  ctx.lineTo(centerX - halfWidth, topY + 8);
  ctx.lineTo(centerX + halfWidth, topY + 8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 1, bottomY - 2);
  ctx.lineTo(centerX - 1, topY + 8);
  ctx.stroke();

  ctx.restore();
}

function drawEnemyBullets() {
  enemyBullets.forEach((enemyBullet) => {
    ctx.save();

    ctx.shadowColor = enemyBullet.glowColor;
    ctx.shadowBlur = 12;

    ctx.fillStyle = enemyBullet.color;
    ctx.beginPath();
    ctx.arc(enemyBullet.x, enemyBullet.y, enemyBullet.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(
      enemyBullet.x - enemyBullet.radius * 0.25,
      enemyBullet.y - enemyBullet.radius * 0.25,
      Math.max(enemyBullet.radius * 0.32, 1.5),
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  });
}