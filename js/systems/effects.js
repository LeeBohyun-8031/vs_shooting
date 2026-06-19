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

function createPowerUpEffect(x, y, level) {
  createPowerUpBurstEffect(x, y, level);
  createPowerUpAuraEffect(x, y, level);
  createPowerUpSparkEffect(x, y, level);
}

function createPowerUpBurstEffect(x, y, level) {
  const particleCount = level >= 3 ? 44 : 32;
  const mainColor = level >= 3 ? "#facc15" : "#38bdf8";
  const subColor = level >= 3 ? "#fef08a" : "#bae6fd";

  for (let i = 0; i < particleCount; i += 1) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = Math.random() * 3.6 + 2.4;

    particles.push({
      x,
      y,
      radius: Math.random() * 2.4 + 1.8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: level >= 3 ? 42 : 34,
      color: Math.random() > 0.45 ? mainColor : subColor,
    });
  }
}

function createPowerUpAuraEffect(x, y, level) {
  const auraCount = level >= 3 ? 18 : 12;
  const auraColor = level >= 3 ? "#fde68a" : "#93c5fd";

  for (let i = 0; i < auraCount; i += 1) {
    const angle = (Math.PI * 2 * i) / auraCount;
    const speed = Math.random() * 1.2 + 0.45;

    particles.push({
      x: x + Math.cos(angle) * 14,
      y: y + Math.sin(angle) * 14,
      radius: level >= 3 ? 4.2 : 3.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: level >= 3 ? 46 : 38,
      color: auraColor,
    });
  }
}

function createPowerUpSparkEffect(x, y, level) {
  const sparkCount = level >= 3 ? 26 : 18;
  const sparkColor = level >= 3 ? "#ffffff" : "#e0f2fe";

  for (let i = 0; i < sparkCount; i += 1) {
    particles.push({
      x: x + Math.random() * 32 - 16,
      y: y + Math.random() * 28 - 14,
      radius: Math.random() * 1.7 + 1,
      vx: Math.random() * 3 - 1.5,
      vy: -(Math.random() * 4 + 1.6),
      life: Math.random() * 18 + 24,
      color: sparkColor,
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