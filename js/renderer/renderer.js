function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawItems();
  drawAssistUnits();
  drawPlayer();
  drawPlayerHitbox();
  drawParticles();
  drawPlayerDeathAnimation();
}

function drawBackground() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  stars.forEach((star) => {
    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer() {
  if (!player) return;

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

function drawEnemies() {
  enemies.forEach((enemy) => {
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
  });
}

function drawItems() {
  if (typeof items === "undefined") return;

  items.forEach((item) => {
    drawItem(item);
  });
}

function drawItem(item) {
  ctx.save();

  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);

  ctx.shadowColor = item.glowColor || "#ffffff";
  ctx.shadowBlur = 12;

  ctx.fillStyle = item.color || "#ffffff";
  ctx.beginPath();
  ctx.rect(-item.width / 2, -item.height / 2, item.width, item.height);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.label, 0, 1);

  ctx.restore();
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(particle.life / 40, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawPlayerDeathAnimation() {
  if (gameState !== "dying") return;

  const elapsedTime = performance.now() - deathAnimationStartTime;
  const progress = Math.min(
    elapsedTime / PLAYER_DEATH_ANIMATION_DURATION,
    1
  );

  const outerRadius = 12 + progress * 90;
  const innerRadius = 4 + progress * 42;
  const alpha = 1 - progress;

  ctx.save();

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(deathAnimationX, deathAnimationY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.8;
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(deathAnimationX, deathAnimationY, innerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.7;
  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.arc(
    deathAnimationX,
    deathAnimationY,
    10 + progress * 24,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}