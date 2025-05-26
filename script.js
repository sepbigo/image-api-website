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

function fetchImage() {
  fetch(API_URL)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      showImage(url);
      addThumbnail(url);
    });
}

function showImage(url) {
  currentIndex = history.length;
  history.push(url);
  mainImg.src = url;
  mainImg.onload = () => updateResolution(mainImg);
  highlightThumbnail(currentIndex);
}

function addThumbnail(url) {
  if (history.length > 14) {
    history.shift();
    thumbContainer.removeChild(thumbContainer.firstChild);
    currentIndex--;
  }
  const img = document.createElement("img");
  img.src = url;
  img.addEventListener("click", () => {
    mainImg.src = url;
    currentIndex = history.indexOf(url);
    mainImg.onload = () => updateResolution(mainImg);
    highlightThumbnail(currentIndex);
  });
  img.addEventListener("dblclick", () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "wallpaper.jpg";
    link.click();
  });
  thumbContainer.appendChild(img);
}

function highlightThumbnail(index) {
  const thumbs = thumbContainer.querySelectorAll("img");
  thumbs.forEach((img, i) => {
    img.classList.toggle("active", i === index);
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

// 初始化背景音乐
bgMusic.src = "https://tc.cecily.eu.org/file/1748193433058_石进-夜的钢琴曲五 (钢琴曲)-《非诚勿扰2》电影插曲.flac"; // 替换为你自己的音乐链接
bgMusic.volume = 0.6;
bgMusic.addEventListener("play", () => {
  bgMusic.animate([{ volume: 0 }, { volume: 0.6 }], {
    duration: 2000,
    fill: "forwards",
  });
});

// 初始化
fetchImage();
setInterval(fetchImage, 5000);
setInterval(updateDateTime, 1000);
