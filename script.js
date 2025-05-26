document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.18xo.eu.org/random?type=img";
  const mainImg = document.getElementById("main-image");
  const spinner = document.getElementById("spinner");
  const thumbs = document.querySelector(".thumbs-container");
  const themeBtn = document.getElementById("toggle-theme");
  const fsBtn = document.getElementById("fullscreen-btn");
  const dlBtn = document.getElementById("download-btn");
  const clearCacheBtn = document.getElementById("clear-cache");
  const ipEl = document.getElementById("client-ip");
  const timeEl = document.getElementById("current-time");
  const resEl = document.getElementById("resolution");
  const audio = document.getElementById("bg-music");

  // 读取并保存历史缓存
  let history = JSON.parse(localStorage.getItem("galleryHistory") || "[]");

  // 播放背景音乐
  audio.volume = 0.5;
  audio.play().catch(() => {});

  // 切换夜间模式
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
  };

  // 全屏预览
  fsBtn.onclick = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

  // 清除缓存
  clearCacheBtn.onclick = () => {
    localStorage.removeItem("galleryHistory");
    history = [];
    thumbs.innerHTML = "";
  };

  // 获取 IP
  fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(d => ipEl.textContent = d.ip);

  // 更新时间
  function updateTime() {
    timeEl.textContent = new Date().toLocaleString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 渲染缩略图
  function renderThumbs() {
    thumbs.innerHTML = "";
    history.forEach(src => {
      const t = document.createElement("img");
      t.src = src;
      t.onclick = () => updateMain(src);
      if (src === mainImg.src) t.classList.add("active");
      thumbs.appendChild(t);
    });
  }

  // 更新主图
  function updateMain(src) {
    spinner.style.display = "block";
    mainImg.style.opacity = 0;
    mainImg.src = src;
    dlBtn.href = src;
    mainImg.onload = () => {
      spinner.style.display = "none";
      mainImg.style.opacity = 1;
      resEl.textContent = `${mainImg.naturalWidth}×${mainImg.naturalHeight}`;
      renderThumbs();
    };
  }

  // 加载新图
  function loadImage() {
    const img = new Image();
    img.onload = () => {
      // 缓存最新
      history.push(img.src);
      if (history.length > 5) history.shift();
      localStorage.setItem("galleryHistory", JSON.stringify(history));
      updateMain(img.src);
    };
    img.src = API_URL + "&_=" + Date.now();
  }

  // 启动
  if (history.length) {
    updateMain(history[history.length - 1]);
  } else {
    loadImage();
  }
  setInterval(loadImage, 5000);
});
