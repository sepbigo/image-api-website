document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.18xo.eu.org/random?type=img";
  const NAMESPACE = "phantom-gallery";
  const KEY = "global-visits";

  const mainImg = document.getElementById("main-image");
  const thumbsContainer = document.querySelector(".thumbs-container");
  const themeBtn = document.getElementById("toggle-theme");
  const fsBtn = document.getElementById("fullscreen-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resEl = document.getElementById("resolution");
  const countEl = document.getElementById("visit-count");
  const ipEl = document.getElementById("client-ip");
  const timeEl = document.getElementById("current-time");
  const audio = document.getElementById("bg-music");
  const sakuraContainer = document.getElementById("sakura-container");

  const history = [];

  // 背景音乐设置
  audio.volume = 0.5; // 50% 音量
  audio.play().catch(() => {
    // 某些浏览器需用户交互才能播放，忽略错误
  });

  // 生成樱花花瓣
  function createPetals(count = 40) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("div");
      petal.classList.add("petal");
      petal.style.left = Math.random() * 100 + "%";
      const duration = 5 + Math.random() * 5; // 5–10s
      const delay = Math.random() * 5;       // 0–5s
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      sakuraContainer.appendChild(petal);
    }
  }
  createPetals();

  // 初始化/切换主题
  (function initTheme() {
    if (localStorage.getItem("lightMode") === "true") document.body.classList.add("light");
  })();
  themeBtn.onclick = () => {
    const light = document.body.classList.toggle("light");
    localStorage.setItem("lightMode", light);
  };

  // 全屏预览
  fsBtn.onclick = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

  // 获取访问统计
  fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
    .then(r => r.json()).then(d => { countEl.textContent = d.value; });

  // 获取客户端 IP
  fetch("https://api.ipify.org?format=json")
    .then(r => r.json()).then(d => { ipEl.textContent = d.ip; });

  // 实时更新时间
  function updateTime() {
    timeEl.textContent = new Date().toLocaleString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 加载图片完成后更新分辨率和下载链接
  mainImg.onload = () => {
    resEl.textContent = `${mainImg.naturalWidth}×${mainImg.naturalHeight}`;
    downloadBtn.href = mainImg.src;
    // 重新触发弹跳动画
    mainImg.classList.remove("pop-in");
    void mainImg.offsetWidth;
    mainImg.classList.add("pop-in");
  };

  // 更新主图及高亮缩略图
  function updateDisplay(url) {
    mainImg.classList.remove("zoomed");
    mainImg.src = url;
    document.querySelectorAll(".thumbs-container img")
      .forEach(img => img.classList.toggle("active", img.src === url));
  }

  // 刷新缩略图列表
  function refreshThumbs() {
    thumbsContainer.innerHTML = "";
    history.forEach(u => {
      const t = document.createElement("img");
      t.src = u;
      t.onclick = () => updateDisplay(u);
      thumbsContainer.appendChild(t);
    });
    if (history.length) updateDisplay(history[history.length - 1]);
  }

  // 加载新图并维护历史
  function loadImage() {
    const img = new Image();
    img.onload = () => {
      history.push(img.src);
      if (history.length > 5) history.shift();
      refreshThumbs();
    };
    img.src = API_URL + "&_=" + Date.now();
  }

  // 点击主图放大/缩小
  mainImg.onclick = () => mainImg.classList.toggle("zoomed");

  // 启动自动轮播
  loadImage();
  setInterval(loadImage, 5000);
});
