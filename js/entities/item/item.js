function resetItems() {
  items = [];
}

function createItem(options) {
  const config = ITEM_CONFIGS[options.type];

  if (!config) return null;

  const item = {
    type: config.type,
    label: config.label,

    x: options.x,
    y: options.y,
    baseX: options.x,

    width: config.size,
    height: config.size,

    vy: options.vy ?? config.fallSpeed,
    age: 0,

    angle: 0,
    rotationSpeed: options.rotationSpeed ?? 0.06,
    swingAmplitude: options.swingAmplitude ?? 4,
    swingSpeed: options.swingSpeed ?? 0.045,

    color: config.color,
    glowColor: config.glowColor,
  };

  items.push(item);

  return item;
}

function dropItemFromEnemy(enemy) {
  if (!enemy) return;

  const itemType = getRandomDropItemType();

  if (!itemType) return;

  createItem({
    type: itemType,
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height / 2,
  });
}

function getRandomDropItemType() {
  const random = Math.random();

  const lifeChance = ITEM_DROP_CONFIG.lifeChance;
  const bombChance = ITEM_DROP_CONFIG.bombChance;
  const powerChance = ITEM_DROP_CONFIG.powerChance;

  if (random < lifeChance) {
    return ITEM_TYPES.LIFE;
  }

  if (random < lifeChance + bombChance) {
    return ITEM_TYPES.BOMB;
  }

  if (random < lifeChance + bombChance + powerChance) {
    return ITEM_TYPES.POWER;
  }

  return null;
}

function updateItems() {
  items = items.filter((item) => {
    updateItemMovement(item);

    if (checkPlayerItemCollision(item)) {
      applyItemEffect(item);
      createItemCollectEffect(item);
      return false;
    }

    return !isItemOutOfScreen(item);
  });
}

function updateItemMovement(item) {
  item.age += 1;
  item.y += item.vy;
  item.x = item.baseX + Math.sin(item.age * item.swingSpeed) * item.swingAmplitude;
  item.angle += item.rotationSpeed;
}

function checkPlayerItemCollision(item) {
  if (!player || !item) return false;

  const pickupBox = getPlayerItemPickupBox();
  const itemHitbox = getItemHitbox(item);

  return isColliding(pickupBox, itemHitbox);
}

function getPlayerItemPickupBox() {
  const pickupWidth = ITEM_PICKUP_CONFIG.width;
  const pickupHeight = ITEM_PICKUP_CONFIG.height;

  return {
    x: player.x + player.width / 2 - pickupWidth / 2,
    y: player.y + player.height / 2 - pickupHeight / 2,
    width: pickupWidth,
    height: pickupHeight,
  };
}

function getItemHitbox(item) {
  return {
    x: item.x - item.width / 2,
    y: item.y - item.height / 2,
    width: item.width,
    height: item.height,
  };
}

function applyItemEffect(item) {
  if (!item) return;

  if (item.type === ITEM_TYPES.LIFE) {
    applyLifeItem();
    playItemCollectSfx();
    return;
  }

  if (item.type === ITEM_TYPES.POWER) {
    applyPowerItem();
    playItemCollectSfx();
    return;
  }

  if (item.type === ITEM_TYPES.BOMB) {
    applyBombItem();
    playItemCollectSfx();
  }
}

function applyLifeItem() {
  life = Math.min(life + 1, ITEM_LIMITS.lifeMax);
}

function applyPowerItem() {
  if (typeof applyPowerItemToPlayer === "function") {
    applyPowerItemToPlayer();
  }
}

function applyBombItem() {
  bomb = Math.min(bomb + 1, ITEM_LIMITS.bombMax);
}

function playItemCollectSfx() {
  if (typeof playSfx === "function") {
    playSfx("confirm");
  }
}

function createItemCollectEffect(item) {
  if (typeof createHitEffect !== "function") return;

  createHitEffect(item.x, item.y, 8);
}

function isItemOutOfScreen(item) {
  return item.y - item.height / 2 > CANVAS_HEIGHT + 24;
}