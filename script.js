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
    renderThumbs();
  };

  fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(d => ipEl.textContent = d.ip);

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

  function loadNewImage() {
    fetch(API_URL)
      .then(res => res.url)
      .then(url => {
        mainImg.classList.remove("loaded", "zoomed");
        mainImg.onload = () => {
          mainImg.classList.add("loaded");
          resEl.textContent = `${mainImg.naturalWidth} x ${mainImg.naturalHeight}`;
        };
        mainImg.src = url;
        dlBtn.href = url;
        dlBtn.setAttribute("download", generateFileName(url));
        history.unshift(url);
        history = history.slice(0, 20);
        localStorage.setItem("galleryHistory", JSON.stringify(history));
        renderThumbs();
      });
  }

  mainImg.onclick = () => {
    mainImg.classList.toggle("zoomed");
  };

  function renderThumbs() {
    thumbs.innerHTML = "";
    history.forEach((url, i) => {
      const img = document.createElement("img");
      img.src = url;
      img.className = mainImg.src === url ? "active" : "";
      img.loading = "lazy";
      img.onclick = () => {
        mainImg.src = url;
        dlBtn.href = url;
        resEl.textContent = "--";
      };
      img.ondblclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = generateFileName(url);
        a.click();
      };
      thumbs.appendChild(img);
    });
  }

  loadNewImage();
  setInterval(loadNewImage, 5000);
});
