const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const RANKING_KEY = "web_shooting_game_ranking";

const SHOT_COOLDOWN = 120;
const ENEMY_SPAWN_COOLDOWN = 650;

const INITIAL_LIFE = 3;
const INITIAL_BOMB = 3;

const PLAYER_CONFIG = {
  width: 28,
  height: 34,
  speed: 5,
  invincibleFrame: 90,
  hitboxSize: 8,
};

const BULLET_CONFIG = {
  width: 5,
  height: 12,
  speed: 9,
};

const ENEMY_CONFIG = {
  minSize: 22,
  maxSize: 34,
  minSpeed: 1.8,
  maxAdditionalSpeed: 2,
};

const ENEMY_BULLET_CONFIG = {
  radius: 5,
  hitboxSize: 6,
  speed: 1.35,
  aimedSpeed: 1.55,
  spreadSpeed: 1.45,
  circleSpeed: 1.25,
  defaultCooldown: 105,
};

const PLAYER_DEATH_ANIMATION_DURATION = 1400;
const PLAYER_DEATH_PARTICLE_COUNT = 36;

const ITEM_TYPES = {
  LIFE: "life",
  POWER: "power",
  BOMB: "bomb",
};

const ITEM_CONFIGS = {
  [ITEM_TYPES.LIFE]: {
    type: ITEM_TYPES.LIFE,
    label: "L",
    name: "목숨 +1",
    color: "#ef4444",
    glowColor: "#fecaca",
    size: 18,
    fallSpeed: 2.0,
  },
  [ITEM_TYPES.POWER]: {
    type: ITEM_TYPES.POWER,
    label: "P",
    name: "파워업",
    color: "#facc15",
    glowColor: "#fef08a",
    size: 18,
    fallSpeed: 2.15,
  },
  [ITEM_TYPES.BOMB]: {
    type: ITEM_TYPES.BOMB,
    label: "B",
    name: "폭탄 +1",
    color: "#38bdf8",
    glowColor: "#bae6fd",
    size: 18,
    fallSpeed: 2.05,
  },
};

const ITEM_DROP_CONFIG = {
  lifeChance: 0.01,
  bombChance: 0.03,
  powerChance: 0.14,
};

const ITEM_PICKUP_CONFIG = {
  width: 42,
  height: 46,
};

const ITEM_LIMITS = {
  lifeMax: 9,
  bombMax: 9,
};

const POWER_UP_REQUIREMENTS = {
  easy: {
    1: 8,
    2: 22,
  },
  normal: {
    1: 18,
    2: 45,
  },
  hard: {
    1: 35,
    2: 90,
  },
};

const STAGE_CONFIGS = [
  {
    stage: 1,
    name: "Stage 1",
    normalDuration: 150000,
    bossIntroDuration: 4000,
    bossHp: 300,
    bossPattern: "basic",
  },
];

const CHARACTER_CONFIGS = [
  {
    type: "homing",
    name: "호밍 타입",
    imageText: "◆",
    description: "보조 유닛의 탄이 적을 따라갑니다.",
  },
  {
    type: "power",
    name: "파워 타입",
    imageText: "▲",
    description: "보조 유닛의 탄이 기본탄과 동일한 성능으로 발사됩니다.",
  },
];

const DIFFICULTY_CONFIGS = [
  {
    type: "easy",
    name: "이지",
    imageText: "E",
    starCount: 1,
    initialLife: 5,
    initialBomb: 4,
    enemySpawnRateMultiplier: 0.75,
    enemyBulletRateMultiplier: 0.5,
    bossBulletDensityMultiplier: 0.75,
    bossHpMultiplier: 0.75,
  },
  {
    type: "normal",
    name: "노멀",
    imageText: "N",
    starCount: 3,
    initialLife: 3,
    initialBomb: 3,
    enemySpawnRateMultiplier: 1,
    enemyBulletRateMultiplier: 1,
    bossBulletDensityMultiplier: 1,
    bossHpMultiplier: 1,
  },
  {
    type: "hard",
    name: "하드",
    imageText: "H",
    starCount: 5,
    initialLife: 3,
    initialBomb: 2,
    enemySpawnRateMultiplier: 1.5,
    enemyBulletRateMultiplier: 1.25,
    bossBulletDensityMultiplier: 1.3,
    bossHpMultiplier: 1.5,
  },
];