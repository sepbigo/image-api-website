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

  // 先移除图片src，防止快速切换时闪烁
  mainImage.src = "";
  await new Promise(resolve => setTimeout(resolve, 50)); // 小延迟防止无动画

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
        // 已存在就放到尾部
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
  if (autoSwitchTimer) clearInterval(autoSwitchTimer);
  startAutoSwitch();
}

// 初始化画廊
async function initGallery() {
  historyImages = [];
  currentIndex = 0;
  const firstUrl = await getImageUrl();
  await loadMainImage(firstUrl);
  startAutoSwitch();
}

// 主图双击下载
mainImage.addEventListener("dblclick", () => {
  const a = document.createElement("a");
  a.href = mainImage.src;
  a.download = "wallpaper.jpg";
  a.click();
});

// 主图点击缩放
mainImage.addEventListener("click", () => {
  zoomed = !zoomed;
  mainImage.classList.toggle("zoomed", zoomed);
});

// 夜间/浅色模式切换
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  modeToggle.textContent = dark ? "浅色模式" : "夜间模式";
  localStorage.setItem("theme", dark ? "dark" : "light");
});

// 刷新按钮立即切换图片
refreshBtn.addEventListener("click", async () => {
  const url = await getImageUrl();
  await loadMainImage(url);
  resetAutoSwitch();
});

// 读取主题偏好
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  modeToggle.textContent = "浅色模式";
}

// 更新时间显示
function updateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = `当前时间：${now.toLocaleString()}`;
}
setInterval(updateTime, 1000);
updateTime();

// 获取IP地址
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("ip").textContent = `你的IP：${data.ip}`;
  })
  .catch(() => {
    document.getElementById("ip").textContent = "无法获取IP";
  });

// 浏览次数统计
let visits = localStorage.getItem("visitCount") || 0;
visits++;
localStorage.setItem("visitCount", visits);
visitCountElem.textContent = `浏览次数：${visits}`;

// 樱花背景动画
function createSakura() {
  const petal = document.createElement("div");
  petal.className = "sakura";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${5 + Math.random() * 5}s`;
  document.getElementById("sakura-container").appendChild(petal);
  setTimeout(() => petal.remove(), 10000);
}
setInterval(createSakura, 500);

// 启动
initGallery();