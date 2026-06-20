function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();
  drawStageTimer();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawBoss();
  drawItems();
  drawAssistUnits();
  drawPlayer();
  drawPlayerHitbox();
  drawParticles();
  drawPlayerDeathAnimation();
  drawStageOverlay();
}