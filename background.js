const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createPetal() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    r: 6 + Math.random() * 4,
    speed: 0.3 + Math.random() * 0.8, // 更慢的下落速度
    drift: Math.random() * 1.5 - 0.75,
    opacity: 0.2 + Math.random() * 0.3 // 更低的透明度
  };
}

function drawPetal(p) {
  ctx.beginPath();
  ctx.fillStyle = `rgba(255,182,193,${p.opacity})`;
  ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, Math.PI / 4, 0, 2 * Math.PI);
  ctx.fill();
}

function animateSakura() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (petals.length < 100) {
    petals.push(createPetal());
  }
  for (let i = 0; i < petals.length; i++) {
    let p = petals[i];
    p.y += p.speed;
    p.x += p.drift;
    if (p.y > canvas.height || p.x < 0 || p.x > canvas.width) {
      petals[i] = createPetal();
    }
    drawPetal(p);
  }
  requestAnimationFrame(animateSakura);
}

animateSakura();
