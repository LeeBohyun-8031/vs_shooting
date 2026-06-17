function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
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
    ctx.fillStyle = "#facc15";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    ctx.fillRect(
      bullet.x - 3,
      bullet.y + 4,
      bullet.width + 6,
      bullet.height
    );
  });
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