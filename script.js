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
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  let history = JSON.parse(localStorage.getItem("galleryHistory") || "[]");
  const thumbsPerPage = 5;
  let currentPage = 0;

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
    currentPage = 0;
    renderThumbs();
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
    const start = currentPage * thumbsPerPage;
    const end = start + thumbsPerPage;
    const
::contentReference[oaicite:4]{index=4}
