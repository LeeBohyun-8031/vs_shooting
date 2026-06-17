const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const lifeText = document.getElementById("lifeText");
const bombText = document.getElementById("bombText");
const finalScoreText = document.getElementById("finalScoreText");

const startScreen = document.getElementById("startScreen");
const characterScreen = document.getElementById("characterScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const nicknameScreen = document.getElementById("nicknameScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const saveRankButton = document.getElementById("saveRankButton");
const nicknameInput = document.getElementById("nicknameInput");

const rankingButton = document.getElementById("rankingButton");
const rankingModal = document.getElementById("rankingModal");
const closeRankingButton = document.getElementById("closeRankingButton");
const rankingList = document.getElementById("rankingList");

const characterImageText = document.getElementById("characterImageText");
const characterNameText = document.getElementById("characterNameText");
const characterDescriptionBox = document.getElementById("characterDescriptionBox");
const characterDescriptionText = document.getElementById("characterDescriptionText");
const characterGuideText = document.getElementById("characterGuideText");

const difficultyImageText = document.getElementById("difficultyImageText");
const difficultyNameText = document.getElementById("difficultyNameText");
const difficultyStarsText = document.getElementById("difficultyStarsText");
const difficultyGuideText = document.getElementById("difficultyGuideText");