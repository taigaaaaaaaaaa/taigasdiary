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
// 日記生成（id が無い場合は date を使う
function generateEntries(data) {
  data.forEach(entry => {
    const id = entry.id || entry.date;

    const div = document.createElement("div");
    div.className = "entry";
    div.id = id;
    div.dataset.category = entry.category;

    div.innerHTML = `
      <div class="date">${entry.date}</div>
      <p>${entry.text}</p>
    `;

    entriesContainer.appendChild(div);
  });
}
// アーカイブ生成（←ここで closeMenu を付ける
function generateArchive(data) {
  data.forEach(entry => {
    const id = entry.id || entry.date;

    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = entry.date;
    a.onclick = () => {
      showEntry(id);
      closeMenu(); // ← スマホで閉じる
    };

    li.appendChild(a);
    archiveList.appendChild(li);
  });
}
// カテゴリ生成（←ここで closeMenu を付ける
function generateCategories(data) {
  const categories = new Set(data.map(e => e.category));

  categories.forEach(cat => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = cat;
    a.onclick = () => {
      filterByCategory(cat);
      closeMenu(); 
    };

    li.appendChild(a);
    categoryList.appendChild(li);
  });
}
// 日記1つだけ表
function showEntry(id) {
  welcome.style.display = "none";
  entriesContainer.style.display = "block";

  document.querySelectorAll(".entry").forEach(entry => {
    if (entry.id === id) {
      entry.style.display = "block";
      entry.classList.add("fade-in");
    } else {
      entry.style.display = "none";
      entry.classList.remove("fade-in");
    }
  });
}
// カテゴリでフィルタリン
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
// TOP ボタ
topButton.onclick = () => {
  welcome.style.display = "block";
  entriesContainer.style.display = "none";
  closeMenu();
};
// ハンバーガーメニュ
menuButton.onclick = () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
};

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

overlay.onclick = closeMenu;
// ダークモード（iOS風スイッチ
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
