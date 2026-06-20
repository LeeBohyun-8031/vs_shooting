function spawnCurrentStageBoss() {
  const stageConfig = getCurrentStageConfig();

  boss = createBoss(stageConfig.bossId);
}

function updateBossSystem(timestamp) {
  if (gameState !== "playing") return;
  if (stagePhase !== "boss") return;

  if (!boss) {
    spawnCurrentStageBoss();
  }

  updateBoss(boss, timestamp);

  if (typeof updateBossPattern === "function") {
    updateBossPattern(boss, timestamp);
  }
}

function checkBulletBossCollision() {
  if (!isBossAttackable(boss)) return;

  const bossHitbox = getBossHitbox(boss);

  for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = bullets[bulletIndex];

    if (!isColliding(bullet, bossHitbox)) continue;

    bullets.splice(bulletIndex, 1);

    const bulletDamage = getPlayerBulletDamage(bullet);
    const defeated = damageBoss(boss, bulletDamage);

    playSfx("enemyHit");

    if (defeated) {
      defeatBoss();
      break;
    }
  }
}

function checkPlayerBossCollision() {
  if (!player) return;
  if (!isBossAttackable(boss)) return;
  if (player.invincibleTime > 0) return;

  const playerHitbox = getPlayerHitbox(player);
  const bossHitbox = getBossHitbox(boss);

  if (!isColliding(playerHitbox, bossHitbox)) return;

  life -= 1;

  playSfx("playerHit");

  createExplosion(
    player.x + player.width / 2,
    player.y + player.height / 2,
    16
  );

  if (life <= 0) {
    life = 0;
    startPlayerDeath();
    return;
  }

  player.invincibleTime = PLAYER_CONFIG.invincibleFrame;
}

function defeatBoss() {
  if (!boss || boss.defeated) return;

  boss.defeated = true;

  score += boss.score;

  playSfx("enemyDestroy");

  createExplosion(
    boss.x + boss.width / 2,
    boss.y + boss.height / 2,
    34
  );

  enemyBullets = [];
  bullets = [];

  boss = null;

  if (typeof startStageClear === "function") {
    startStageClear(performance.now());
  }
}