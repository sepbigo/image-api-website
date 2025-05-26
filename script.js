document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.18xo.eu.org/random?type=img";
  const mainImg = document.getElementById("main-image");
  const thumbs = document.querySelector(".thumbs-container");
  const themeBtn = document.getElementById("toggle-theme");
  const fsBtn = document.getElementById("fullscreen-btn");
  const dlBtn = document.getElementById("download-btn");
  const ipEl = document.getElementById("client-ip");
  const timeEl = document.getElementById("current-time");
  const resEl = document.getElementById("resolution");
  const audio = document.getElementById("bg-music");
  const sakura = document.getElementById("sakura-container");

  let history = [];

  // 播放背景音乐
  audio.volume = 0.5;
  audio.play().catch(() => {});

  // 创建樱花
  function createPetals(n = 40) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (5 + Math.random()*5) + "s";
      p.style.animationDelay = Math.random()*5 + "s";
      sakura.appendChild(p);
    }
  }
  createPetals();

  // 切换夜间模式
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
  };

  // 全屏
  fsBtn.onclick = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

  // IP和时间
  fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(d => ipEl.textContent = d.ip);
  function updateTime() {
    timeEl.textContent = new Date().toLocaleString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 加载图片
  function loadImage() {
    const img = new Image();
    img.onload = () => {
      history.push(img.src);
      if (history.length > 5) history.shift();
      renderThumbs();
      updateMain(img.src);
    };
    img.src = API_URL + "&_=" + Date.now();
  }

  function renderThumbs() {
    thumbs.innerHTML = "";
    history.forEach(src => {
      const t = document.createElement("img");
      t.src = src;
      t.onclick = () => updateMain(src);
      thumbs.appendChild(t);
    });
  }

  function updateMain(src) {
    mainImg.classList.remove("zoomed");
    mainImg.src = src;
    dlBtn.href = src;
    mainImg.onload = () => {
      resEl.textContent = `${mainImg.naturalWidth}×${mainImg.naturalHeight}`;
    };
    document.querySelectorAll(".thumbs-container img")
      .forEach(i => i.classList.toggle("active", i.src === src));
  }

  // 图片点击缩放
  mainImg.onclick = () => {
    mainImg.classList.toggle("zoomed");
  };

  // 初始加载 + 自动轮播
  loadImage();
  setInterval(loadImage, 5000);
});
