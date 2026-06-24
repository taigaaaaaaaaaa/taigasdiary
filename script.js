// JSON を読み込んで日記を生成
fetch("diary.json")
  .then(response => response.json())
  .then(data => {
    generateEntries(data);
    generateArchive(data);
    generateCategories(data);
  });

const entriesContainer = document.getElementById("entries");
const archiveList = document.getElementById("archive-list");
const categoryList = document.getElementById("category-list");
const welcome = document.getElementById("welcome");

// 日記を HTML に生成
function generateEntries(data) {
  data.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.id = entry.id;
    div.dataset.category = entry.category;

    div.innerHTML = `
      <div class="date">${entry.date}</div>
      <p>${entry.text}</p>
    `;

    entriesContainer.appendChild(div);
  });
}

// アーカイブ生成
function generateArchive(data) {
  data.forEach(entry => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = entry.date;
    a.onclick = () => showEntry(entry.id);

    li.appendChild(a);
    archiveList.appendChild(li);
  });
}

// カテゴリ生成
function generateCategories(data) {
  const categories = new Set(data.map(e => e.category));

  categories.forEach(cat => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = cat;
    a.onclick = () => filterByCategory(cat);

    li.appendChild(a);
    categoryList.appendChild(li);
  });
}

// 日記1つだけ表示
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
// ダークモード切り替え
const themeToggle = document.getElementById("theme-toggle");

// 保存されたテーマを読み込む
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// スイッチを押したとき
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};
//json の id が無い場合は date を id にするように変更
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

// TOP ボタン（ウェルカムページに戻る）
const topButton = document.getElementById("top-button");

topButton.onclick = () => {
  // ウェルカムページを表示
  welcome.style.display = "block";
  entriesContainer.style.display = "none";

  // メニューを閉じる（スマホ用）
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
};

// ハンバーガーメニュー開閉
const menuButton = document.getElementById("menu-button");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

// メニューを開く
menuButton.onclick = () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
};

// メニューを閉じる関数
function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

// オーバーレイを押したら閉じる
overlay.onclick = () => {
  closeMenu();
};

// サイドバーのリンクを押したら閉じる
document.querySelectorAll(".sidebar a").forEach(a => {
  a.onclick = () => closeMenu();
});
const themeToggle = document.getElementById("theme-toggle");
const knob = document.querySelector(".knob");

//ダークモード関連
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  knob.textContent = "☀️";
} else {
  knob.textContent = "🌙";
}

// スイッチを押したとき
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
//ここまでダークモード関連