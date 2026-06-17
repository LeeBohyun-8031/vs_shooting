function startPlayerDeath() {
  if (gameState === "dying" || gameState === "gameOver") return;

  gameState = "dying";
  life = 0;
  updateGameInfo();

  deathAnimationStartTime = performance.now();

  deathAnimationX = player
    ? player.x + player.width / 2
    : CANVAS_WIDTH / 2;

  deathAnimationY = player
    ? player.y + player.height / 2
    : CANVAS_HEIGHT - 72;

  createPlayerDeathEffect(deathAnimationX, deathAnimationY);

  player = null;
}

function createPlayerDeathEffect(x, y) {
  for (let i = 0; i < PLAYER_DEATH_PARTICLE_COUNT; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 3 + 2,
      vx: Math.random() * 9 - 4.5,
      vy: Math.random() * 9 - 4.5,
      life: 40,
      color: Math.random() > 0.5 ? "#38bdf8" : "#f97316",
    });
  }
}

function updateDeathAnimation() {
  updateParticles();

  const elapsedTime = performance.now() - deathAnimationStartTime;

  if (elapsedTime >= PLAYER_DEATH_ANIMATION_DURATION) {
    endGame();
  }
}

function createHitEffect(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 2 + 1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      life: 18,
      color: "#7dd3fc",
    });
  }
}

function createExplosion(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      radius: Math.random() * 3 + 2,
      vx: Math.random() * 7 - 3.5,
      vy: Math.random() * 7 - 3.5,
      life: 28,
      color: Math.random() > 0.5 ? "#facc15" : "#fb7185",
    });
  }
}

function updateParticles() {
  particles = particles.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 1;

    return particle.life > 0;
  });
}