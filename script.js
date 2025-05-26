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
let isPaused = false;
let zoomed = false;

// 获取图片 URL（接口请求）
async function getImageUrl() {
  try {
    const res = await fetch("https://api.18xo.eu.org/random?type=img");
    const data = await res.json();
    return data.url || "";
  } catch {
    return "";
  }
}

// 更新主图及相关信息
function updateMainImage(url) {
  loading.style.display = "block";
  mainImage.classList.remove("zoomed");
  zoomed = false;
  mainImage.src = url;
  download