// 要素取得
const entriesContainer = document.getElementById("entries");
const archiveList = document.getElementById("archive-list");
const categoryList = document.getElementById("category-list");
const welcome = document.getElementById("welcome");
const topButton = document.getElementById("top-button");
const menuButton = document.getElementById("menu-button");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");
const themeToggle = document.getElementById("theme-toggle");
const knob = document.querySelector(".knob");

// JSON 読み込み
fetch("diary.json")
  .then(res => res.json())
  .then(data => {
    generateEntries(data);
    generateArchive(data);
    generateCategories(data);
  });

// 日記生成（カテゴリも表示）
function generateEntries(data) {
  data.forEach(entry => {
    const id = entry.id || entry.date;

    const div = document.createElement("div");
    div.className = "entry";
    div.id = id;
    div.dataset.category = entry.category;

    div.innerHTML = `
      <div class="date">${entry.date}</div>
      <div class="category">カテゴリ：${entry.category}</div>
      <p>${entry.text}</p>
    `;

    entriesContainer.appendChild(div);
  });
}

// アーカイブ生成（件数表示 + 日付ごと1行）
function generateArchive(data) {
  const dateCount = {};

  // 日付ごとの件数をカウント
  data.forEach(entry => {
    const date = entry.date;
    dateCount[date] = (dateCount[date] || 0) + 1;
  });

  // 日付ごとに1行だけ作る
  Object.keys(dateCount).forEach(date => {
    const count = dateCount[date];

    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = count > 1 ? `${date} (${count})` : date;

    a.onclick = () => {
      filterByDate(date);
      closeMenu();
    };

    li.appendChild(a);
    archiveList.appendChild(li);
  });
}

// 同じ日付のエントリを全部表示
function filterByDate(date) {
  welcome.style.display = "none";
  entriesContainer.style.display = "block";

  document.querySelectorAll(".entry").forEach(entry => {
    const entryDate = entry.querySelector(".date").textContent;

    if (entryDate === date) {
      entry.style.display = "block";
      entry.classList.add("fade-in");
    } else {
      entry.style.display = "none";
      entry.classList.remove("fade-in");
    }
  });
}

// カテゴリ生成（件数表示 + カテゴリごと1行）
function generateCategories(data) {
  const categoryCount = {};

  // カテゴリごとの件数をカウント
  data.forEach(entry => {
    const cat = entry.category;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  // カテゴリごとに1行だけ作る
  Object.keys(categoryCount).forEach(cat => {
    const count = categoryCount[cat];

    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = count > 1 ? `${cat} (${count})` : cat;

    a.onclick = () => {
      filterByCategory(cat);
      closeMenu();
    };

    li.appendChild(a);
    categoryList.appendChild(li);
  });
}

// カテゴリでフィルタリング
function filterByCategory(category) {
  welcome.style.display = "none";
  entriesContainer.style.display = "block";

  document.querySelectorAll(".entry").forEach(entry => {
    if (entry.dataset.category === category) {
      entry.style.display = "block";
      entry.classList.add("fade-in");
    } else {
      entry.style.display = "none";
      entry.classList.remove("fade-in");
    }
  });
}

// TOP ボタン
topButton.onclick = () => {
  welcome.style.display = "block";
  entriesContainer.style.display = "none";
  closeMenu();
};

// ハンバーガーメニュー
menuButton.onclick = () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
};

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

overlay.onclick = closeMenu;

// ダークモード（iOS風スイッチ）
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  knob.textContent = "☀️";
} else {
  knob.textContent = "🌙";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    knob.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    knob.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
};
