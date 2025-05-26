document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.18xo.eu.org/random?type=img";
  const mainImg = document.getElementById("main-image");
  const thumbs = document.querySelector(".thumbs-container");
  const themeBtn = document.getElementById("toggle-theme");
  const fsBtn = document.getElementById("fullscreen-btn");
  const dlBtn = document.getElementById("download-btn");
  const clearCacheBtn = document.getElementById("clear-cache");
  const ipEl = document.getElementById("client-ip");
  const timeEl = document.getElementById("current-time");
  const resEl = document.getElementById("resolution");
  const audio = document.getElementById("bg-music");

  let history = JSON.parse(localStorage.getItem("galleryHistory") || "[]");

  // 背景音乐播放
  audio.volume = 0.5;
  audio.play().catch(() => {});

  themeBtn.onclick = () => document.body.classList.toggle("dark");

  fsBtn.onclick = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

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

  function generateFileName(url) {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const extMatch = url.match(/\.(jpg|jpeg|png|gif|webp)/i);
    const ext = extMatch ? extMatch[0] : ".jpg";
    return `image_${timestamp}${ext}`;
  }

  function renderThumbs() {
    thumbs.innerHTML = "";
    history.forEach(src => {
      const t = document.createElement("img");
      t.src = src;
      t.loading = "lazy";
      t.onclick = () => updateMain(src);
      t.ondblclick = () => {
        const link = document.createElement("a");
        link.href = src;
        link.download = generateFileName(src);
        link.click();
      };
      if (src === mainImg.src) t.classList.add("active");
      thumbs.appendChild(t);
    });
  }

  function updateMain(src) {
    mainImg.src = src;
    dlBtn.href = src;
    dlBtn.download = generateFileName(src);
    mainImg.onload = () => {
      resEl.textContent = `${mainImg.naturalWidth}×${mainImg.naturalHeight}`;
      renderThumbs();
    };
  }

  mainImg.onclick = () => {
    mainImg.classList.toggle("zoomed");
  };

  function loadImage() {
    const img = new Image();
    img.onload = () => {
      history.push(img.src);
      if (history.length > 5) history.shift();
      localStorage.setItem("galleryHistory", JSON.stringify(history));
      updateMain(img.src);
    };
    img.src = API_URL + "&_=" + Date.now();
  }

  if (history.length) {
    updateMain(history[history.length - 1]);
  } else {
    loadImage();
  }
  setInterval(loadImage, 5000);
});
