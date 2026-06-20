function drawBackground() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  stars.forEach((star) => {
    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}