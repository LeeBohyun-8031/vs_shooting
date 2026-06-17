const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  KeyZ: false,
  ShiftLeft: false,
  ShiftRight: false,
};

let gameState = "ready";
let animationId = null;

let selectedCharacterIndex = 0;
let selectedCharacterType = "homing";
let characterSelectMode = "select";

let selectedDifficultyIndex = 0;
let selectedDifficultyType = "easy";

let score = 0;
let life = INITIAL_LIFE;
let bomb = INITIAL_BOMB;

let player = null;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let particles = [];
let stars = [];

let lastShotTime = 0;
let lastEnemySpawnTime = 0;
let bombPressed = false;

let deathAnimationStartTime = 0;
let deathAnimationX = 0;
let deathAnimationY = 0;