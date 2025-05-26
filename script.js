const mainImage = document.getElementById("mainImage");
const loading = document.getElementById("loading");
const info = document.getElementById("info");
const downloadBtn = document.getElementById("downloadBtn");
const thumbnailsContainer = document.getElementById("thumbnails");
const modeToggle = document.getElementById("modeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const visitCountElem = document.getElementById("visitCount");

let thumbnails = [];
let currentIndex = 0;
let autoSwitchTimer = null;
let zoomed = false;

async function getImageUrl() {
  return "https://api.18xo.eu.org/random?type=img";
}

async function loadMainImage(url) {
  loading.style.display = "block";
  mainImage.classList.remove("zoomed");
  zoomed = false;
  mainImage.src = url;
  downloadBtn.href = url;

  mainImage.onload = () => {
    loading.style.display = "none";
    info.textContent = `分辨率：${mainImage.naturalWidth} × ${mainImage.naturalHeight}`;
  };
}

async function loadThumbnails() {
  thumbnails = [];
  thumbnailsContainer.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const url = await getImageUrl();
    thumbnails.push(url);

    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.addEventListener("click", () => {
      currentIndex = i;
      loadMainImage(url);
      highlightThumbnail(i);
    });
    thumb.addEventListener("dblclick", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "wallpaper.jpg";
      a.click();
    });
    thumbnailsContainer.appendChild(thumb);
  }
  highlightThumbnail(currentIndex);
}

function highlightThumbnail(index) {
  const thumbs = thumbnailsContainer.querySelectorAll("img");
  thumbs.forEach((img, i) => {
    img.classList.toggle("active", i === index);
  });
}

function startAutoSwitch() {
  autoSwitchTimer = setInterval(() => {
    if (document.querySelector(".container:hover")) return;
    currentIndex = (currentIndex + 1) % thumbnails.length;
    loadMainImage(thumbnails[currentIndex]);
    highlightThumbnail(currentIndex);
  }, 5000);
}

async function initGallery() {
  thumbnails = [];
  currentIndex = 0;
  await loadThumbnails();
  loadMainImage(thumbnails[currentIndex]);
  startAutoSwitch();
}

mainImage.addEventListener("dblclick", () => {
  const a = document.createElement("a");
  a.href = mainImage.src;
  a.download = "wallpaper.jpg";
  a.click();
});

mainImage.addEventListener("click", () => {
  zoomed = !zoomed;
  mainImage.classList.toggle("zoomed", zoomed);
});

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  modeToggle.textContent = dark ? "浅色模式" : "夜间模式";
  localStorage.setItem("theme", dark ? "dark" : "light");
});

refreshBtn.addEventListener("click", async () => {
  clearInterval(autoSwitchTimer);
  await initGallery();
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  modeToggle.textContent = "浅色模式";
}

function updateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = `当前时间：${now.toLocaleString()}`;
}
setInterval(updateTime, 1000);
updateTime();

fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("ip").textContent = `你的IP：${data.ip}`;
  })
  .catch(() => {
    document.getElementById("ip").textContent = "无法获取IP";
  });

let visits = localStorage.getItem("visitCount") || 0;
visits++;
localStorage.setItem("visitCount", visits);
visitCountElem.textContent = `浏览次数：${visits}`;

function createSakura() {
  const petal = document.createElement("div");
  petal.className = "sakura";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${5 + Math.random() * 5}s`;
  petal.style.opacity = 0.5;
  document.getElementById("sakura-container").appendChild(petal);
  setTimeout(() => petal.remove(), 10000);
}
setInterval(createSakura, 500);

initGallery();