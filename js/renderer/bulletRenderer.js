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
  ctx.save();

  ctx.shadowColor = bullet.glowColor || "#bae6fd";
  ctx.shadowBlur = 10;

  ctx.fillStyle = bullet.color || "#7dd3fc";
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(
    bullet.x + bullet.width * 0.25,
    bullet.y + 2,
    Math.max(bullet.width * 0.45, 1),
    Math.max(bullet.height * 0.45, 3)
  );

  ctx.restore();
}

function drawNeedleBullet(bullet) {
  const centerX = bullet.x + bullet.width / 2;
  const topY = bullet.y;
  const bottomY = bullet.y + bullet.height;
  const halfWidth = Math.max(bullet.width * 0.9, 3);

  ctx.save();

  ctx.shadowColor = bullet.glowColor || "#fde68a";
  ctx.shadowBlur = 12;

  ctx.fillStyle = bullet.color || "#facc15";
  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(centerX - halfWidth, bottomY);
  ctx.lineTo(centerX + halfWidth, bottomY);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, topY + 3);
  ctx.lineTo(centerX, bottomY - 3);
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