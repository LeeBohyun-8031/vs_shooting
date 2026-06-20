function drawItems() {
  if (typeof items === "undefined") return;

  items.forEach((item) => {
    drawItem(item);
  });
}

function drawItem(item) {
  ctx.save();

  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);

  ctx.shadowColor = item.glowColor || "#ffffff";
  ctx.shadowBlur = 12;

  ctx.fillStyle = item.color || "#ffffff";
  ctx.beginPath();
  ctx.rect(-item.width / 2, -item.height / 2, item.width, item.height);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.label, 0, 1);

  ctx.restore();
}