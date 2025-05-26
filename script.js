const mainImage = document.getElementById("mainImage");
const loading = document.getElementById("loading");
const info = document.getElementById("info");
const downloadBtn = document.getElementById("downloadBtn");
const thumbnailsContainer = document.getElementById("thumbnails");
const modeToggle = document.getElementById("modeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const visitCountElem = document.getElementById("visitCount");

let historyImages = [];
let currentIndex = 0;
let autoSwitchTimer = null;
let zoomed = false;

// 获取图片地址
async function getImageUrl() {
  return "https://api.18xo.eu.org/random?type=img";
}

// 加载图片（带淡入动画和历史更新）
async function loadMainImage(url, updateHistory = true) {
  loading.style.display = "block";
  mainImage.classList.remove("show", "zoomed");
  zoomed = false;

  mainImage.style.opacity = 0; // 预先隐藏避免闪烁
  mainImage.src = "";

  // 小延迟避免切换太快导致闪烁
  await new Promise(resolve => setTimeout(resolve, 50));

  mainImage.src = url;
  downloadBtn.href = url;

  return new Promise((resolve) => {
    mainImage.onload = () => {
      loading.style.display = "none";
      info.textContent = `分辨率：${mainImage.naturalWidth} × ${mainImage.naturalHeight}`;
      mainImage.classList.add("show");
      resolve();
    };
  }).then(() => {
    if (updateHistory) {
      if (!historyImages.includes(url)) {
        historyImages.push(url);
        if (historyImages.length > 10) historyImages.shift();
      } else {
        historyImages = historyImages.filter(u => u !== url);
        historyImages.push(url);
      }
      renderThumbnails();
    }
  });
}

// 渲染缩略图
function renderThumbnails() {
  thumbnailsContainer.innerHTML = "";
  historyImages.forEach((url, i) => {
    const thumb = document.createElement("img");
    thumb.src = url;
    if (i === historyImages.length - 1) {
      thumb.classList.add("active");
      currentIndex = i;
    }
    thumb.addEventListener("click", async () => {
      if (currentIndex === i) return;
      currentIndex = i;
      await loadMainImage(url, false);
      highlightThumbnail(i);
      resetAutoSwitch();
    });
    thumbnailsContainer.appendChild(thumb);
  });
}

// 高亮缩略图
function highlightThumbnail(index) {
  const thumbs = thumbnailsContainer.querySelectorAll("img");
  thumbs.forEach((img, i) => {
    img.classList.toggle("active", i === index);
  });
}

// 自动轮播
function startAutoSwitch() {
  if (autoSwitchTimer) clearInterval(autoSwitchTimer);
  autoSwitchTimer = setInterval(async () => {
    currentIndex++;
    if (currentIndex >= historyImages.length) {
      // 请求新图
      const url = await getImageUrl();
      await loadMainImage(url);
      currentIndex = historyImages.length - 1;
    } else {
      // 切换历史图
      await loadMainImage(historyImages[currentIndex], false);
    }
    highlightThumbnail(currentIndex);
  }, 5000);
}

// 重置轮播计时
function resetAutoSwitch() {
  if (autoSwitchTimer) clearInterval(autoSwitchTimer