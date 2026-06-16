const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const RANKING_KEY = "web_shooting_game_ranking";

const SHOT_COOLDOWN = 120;
const ENEMY_SPAWN_COOLDOWN = 650;

const INITIAL_LIFE = 3;
const INITIAL_BOMB = 3;

const PLAYER_CONFIG = {
  width: 36,
  height: 42,
  speed: 5,
  invincibleFrame: 90,
};

const BULLET_CONFIG = {
  width: 6,
  height: 14,
  speed: 9,
};

const ENEMY_CONFIG = {
  minSize: 28,
  maxSize: 44,
  minSpeed: 1.8,
  maxAdditionalSpeed: 2,
};

const PLAYER_DEATH_ANIMATION_DURATION = 1400;
const PLAYER_DEATH_PARTICLE_COUNT = 36;

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
  {
    type: "speed",
    name: "기동 타입",
    imageText: "◇",
    description: "보조 유닛이 이동 방향과 반대로 움직이고, 고속 이동 시 피격 범위가 줄어듭니다.",
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