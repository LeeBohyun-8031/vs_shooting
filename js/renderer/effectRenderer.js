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