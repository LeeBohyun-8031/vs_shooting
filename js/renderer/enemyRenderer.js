function drawEnemies() {
  enemies.forEach((enemy) => {
    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;

    ctx.fillStyle = enemy.hp >= 2 ? "#a855f7" : "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, enemy.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(centerX - enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
    ctx.arc(centerX + enemy.width * 0.17, centerY - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, enemy.width / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
  });
}