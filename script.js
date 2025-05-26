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

  // —— 背景音乐 & 音量 —— 
  audio.volume = 0.5;
  audio.play().catch(() => {});

  // —— 生成樱花花瓣 —— 
  function createPetals(n = 40) {
    for (let i = 0; i < n; i++) {
      let p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (5 + Math.random()*5) + "s";
      p.style.animationDelay = Math.random()*5 + "s";
      sakura.appendChild(p);
    }
  }
  createPetals();

  // —— 切换主题 —— 
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
  };

  // —— 全屏预览 —— 
  fsBtn.onclick = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

  // —— 实时 IP & 时间 —— 
  fetch("https://api.ipify.org?format=json")
    .then(r=>r.json()).then(d=> ipEl.textContent = d.ip );
  function tick() {
    timeEl.textContent = new Date().toLocaleString();
  }
  setInterval(tick, 1000);
  tick();

  // —— 加载新图 & 缩略图导航 —— 
  function loadImage() {
    let img = new Image();
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
      let t = document.createElement("img");
      t.src = src;
      t.onclick = () => updateMain(src);
      thumbs.appendChild(t);
    });
  }
  function updateMain(src) {
    mainImg.classList.remove("zoomed");
    mainImg.src = src;
    dlBtn.href = src;
    // 更新分辨率
    mainImg.onload = () => {
      resEl.textContent = `${mainImg.naturalWidth}×${mainImg.naturalHeight}`;
    };
    // 高亮
    document.querySelectorAll(".thumbs-container img")
      .forEach(i=> i.classList.toggle("active", i.src===src));
  }
  mainImg.onclick = () => mainImg.classList.toggle("zoomed");

  // —— 启动自动轮播 —— 
  loadImage();
  setInterval(loadImage, 5000);
});
