const BOSS_CONFIGS = {
  stage1Boss: {
    id: "stage1Boss",
    name: "Stage 1 Boss",
    maxHp: 300,
    width: 92,
    height: 72,
    score: 5000,
    patternSet: "basic",

    enterTargetY: 86,
    enterSpeed: 1.6,

    patrolPaddingX: 34,
    patrolMinY: 76,
    patrolMaxY: 150,
    patrolSpeed: 1.15,
    patrolWaitMin: 450,
    patrolWaitMax: 900,
    targetReachDistance: 4,
  },

  stage2Boss: {
    id: "stage2Boss",
    name: "Stage 2 Boss",
    maxHp: 520,
    width: 104,
    height: 78,
    score: 9000,
    patternSet: "stage2",

    enterTargetY: 92,
    enterSpeed: 1.45,

    patrolPaddingX: 28,
    patrolMinY: 72,
    patrolMaxY: 165,
    patrolSpeed: 1.28,
    patrolWaitMin: 360,
    patrolWaitMax: 760,
    targetReachDistance: 4,
  },
};