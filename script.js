const API_URL = "https://api.18xo.eu.org/random?type=img";
const mainImg = document.getElementById("mainImg");
const resolutionDisplay = document.getElementById("resolution");
const thumbContainer = document.getElementById("thumbContainer");
const bgMusic = document.getElementById("bgMusic");
const history = [];
let currentIndex = -1;

function updateResolution(img) {
  resolutionDisplay.textContent = `分辨率: ${img.naturalWidth} x ${img.naturalHeight}`;
}

let musicPlaying = true;
let imageHistory = [];

function loadNewImage() {
  const url = "https://api.18xo.eu.org/random?type=img&t=" + Date.now();
  img.src = url;
  img.dataset.src = url;

  imageHistory.unshift(url);
  if (imageHistory.length > 6) imageHistory.pop();
}

function renderThumbnails() {
  thumbnailContainer.innerHTML = '';
  imageHistory.forEach((url, index) => {
    if (index === 0) return; // 当前显示的主图不重复显示为缩略图
    const thumb = document.createElement("img");
    thumb.src = url;

    // 点击：切换主图
    thumb.onclick = () => {
      img.src = url;
      img.dataset.src = url;
    };

    // 双击：下载原图
    thumb.ondblclick = () => {
      const link = document.createElement("a");
      link.href = url;
      link.download = "wallpaper.jpg";
      link.click();
    };

    // 高亮当前图
    if (url === img.dataset.src) {
      thumb.classList.add("active");
    }

    thumbnailContainer.appendChild(thumb);
  });
}

function downloadImage() {
  const link = document.createElement("a");
  link.href = mainImg.src;
  link.download = "wallpaper.jpg";
  link.click();
}

function updateDateTime() {
  const now = new Date();
  document.getElementById("dateTime").textContent =
    now.toLocaleDateString() + " " + now.toLocaleTimeString();
}

function toggleNightMode() {
  document.body.classList.toggle("dark");
}

// 背景音乐
bgMusic.src = "https://tc.cecily.eu.org/file/1748193433058_石进-夜的钢琴曲五 (钢琴曲)-《非诚勿扰2》电影插曲.flac"; // 请替换为你自己的音乐链接
bgMusic.volume = 0.6;
bgMusic.addEventListener("play", () => {
  bgMusic.animate([{ volume: 0 }, { volume: 0.6 }], {
    duration: 2000,
    fill: "forwards"
  });
});

// 初始化
fetchImage();
setInterval(fetchImage, 5000);
setInterval(updateDateTime, 1000);
