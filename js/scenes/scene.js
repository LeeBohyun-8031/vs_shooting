function getSelectedDifficultyConfig() {
  return DIFFICULTY_CONFIGS[selectedDifficultyIndex];
}

function safePlaySfx(type) {
  if (typeof playSfx === "function") {
    playSfx(type);
  }
}

function openCharacterSelect() {
  gameState = "characterSelect";
  characterSelectMode = "select";

  cancelAnimationFrame(animationId);
  resetInputState();

  startScreen.classList.remove("active");
  characterScreen.classList.add("active");
  difficultyScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.remove("hidden");

  updateCharacterSelectUI();
}

function updateCharacterSelectUI() {
  const character = CHARACTER_CONFIGS[selectedCharacterIndex];

  selectedCharacterType = character.type;
  characterImageText.textContent = character.imageText;
  characterNameText.textContent = character.name;
  characterDescriptionText.textContent = character.description;

  if (characterSelectMode === "select") {
    characterDescriptionBox.classList.remove("active");
    characterGuideText.textContent = "Z : 선택";
  }

  if (characterSelectMode === "detail") {
    characterDescriptionBox.classList.add("active");
    characterGuideText.textContent = "Z : 결정 / X : 돌아가기";
  }
}

function moveCharacterSelect(direction) {
  if (characterSelectMode !== "select") return;

  selectedCharacterIndex += direction;

  if (selectedCharacterIndex < 0) {
    selectedCharacterIndex = CHARACTER_CONFIGS.length - 1;
  }

  if (selectedCharacterIndex >= CHARACTER_CONFIGS.length) {
    selectedCharacterIndex = 0;
  }

  safePlaySfx("select");

  updateCharacterSelectUI();
}

function showCharacterDetail() {
  characterSelectMode = "detail";

  safePlaySfx("confirm");

  updateCharacterSelectUI();
}

function backToCharacterSelect() {
  characterSelectMode = "select";

  safePlaySfx("select");

  updateCharacterSelectUI();
}

function confirmCharacterSelect() {
  if (characterSelectMode === "select") {
    showCharacterDetail();
    return;
  }

  if (characterSelectMode === "detail") {
    safePlaySfx("confirm");
    openDifficultySelect();
  }
}

function openDifficultySelect() {
  gameState = "difficultySelect";

  cancelAnimationFrame(animationId);
  resetInputState();

  startScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  difficultyScreen.classList.add("active");
  gameOverScreen.classList.remove("active");
  nicknameScreen.classList.remove("active");

  rankingButton.classList.remove("hidden");

  updateDifficultySelectUI();
}

function createDifficultyStars(starCount) {
  const maxStars = 5;
  const filledStar = "★";
  const emptyStar = "☆";

  return filledStar.repeat(starCount) + emptyStar.repeat(maxStars - starCount);
}

function updateDifficultySelectUI() {
  const difficulty = getSelectedDifficultyConfig();

  selectedDifficultyType = difficulty.type;
  difficultyImageText.textContent = difficulty.imageText;
  difficultyNameText.textContent = difficulty.name;
  difficultyStarsText.textContent = createDifficultyStars(difficulty.starCount);
  difficultyGuideText.textContent = "Z : 선택 / X : 돌아가기";
}

function moveDifficultySelect(direction) {
  selectedDifficultyIndex += direction;

  if (selectedDifficultyIndex < 0) {
    selectedDifficultyIndex = DIFFICULTY_CONFIGS.length - 1;
  }

  if (selectedDifficultyIndex >= DIFFICULTY_CONFIGS.length) {
    selectedDifficultyIndex = 0;
  }

  safePlaySfx("select");

  updateDifficultySelectUI();
}

function confirmDifficultySelect() {
  safePlaySfx("gameStart");

  updateDifficultySelectUI();
  startGame();
}