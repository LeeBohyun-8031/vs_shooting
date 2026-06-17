function createEnemyBullet(options) {
  enemyBullets.push({
    x: options.x,
    y: options.y,
    vx: options.vx,
    vy: options.vy,
    radius: options.radius || ENEMY_BULLET_CONFIG.radius,
    hitboxSize: options.hitboxSize || ENEMY_BULLET_CONFIG.hitboxSize,
    color: options.color || "#60a5fa",
    glowColor: options.glowColor || options.color || "#60a5fa",
    age: 0,
  });
}

function getEnemyBulletHitbox(enemyBullet) {
  const hitboxSize = enemyBullet.hitboxSize;

  return {
    x: enemyBullet.x - hitboxSize / 2,
    y: enemyBullet.y - hitboxSize / 2,
    width: hitboxSize,
    height: hitboxSize,
  };
}

function getEnemyCenter(enemy) {
  return {
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height / 2,
  };
}

function isEnemyVisibleForShooting(enemy) {
  return (
    enemy.x >= 0 &&
    enemy.x + enemy.width <= CANVAS_WIDTH &&
    enemy.y >= 0 &&
    enemy.y + enemy.height <= CANVAS_HEIGHT
  );
}

function getSafeBulletSpawnX(x, radius) {
  return clamp(x, radius + 2, CANVAS_WIDTH - radius - 2);
}

function getSafeBulletSpawnY(y, radius) {
  return clamp(y, radius + 2, CANVAS_HEIGHT - radius - 2);
}

function getEnemyBulletSpawnPoint(enemy, radius) {
  const center = getEnemyCenter(enemy);

  return {
    x: getSafeBulletSpawnX(center.x, radius),
    y: getSafeBulletSpawnY(center.y, radius),
  };
}

function createBulletFromEnemy(enemy, options) {
  const radius = options.radius || ENEMY_BULLET_CONFIG.radius;
  const spawnPoint = getEnemyBulletSpawnPoint(enemy, radius);

  createEnemyBullet({
    x: spawnPoint.x,
    y: spawnPoint.y,
    vx: options.vx,
    vy: options.vy,
    radius,
    hitboxSize: options.hitboxSize,
    color: options.color,
    glowColor: options.glowColor,
  });
}