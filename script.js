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

// 初期表示
welcome.style.display = "block";
entriesContainer.style.display = "none";

// JSON 読み込み
fetch("diary.json")
  .then(res => {
    if (!res.ok) throw new Error(`読み込み失敗: ${res.status}`);
    return res.json();
  })
  .then(data => {
    generateEntries(data);
    generateArchive(data);
    generateCategories(data);
  })
  .catch(err => {
    console.error(err);
    entriesContainer.innerHTML = "<p>日記データの読み込みに失敗しました。</p>";
    entriesContainer.style.display = "block";
  });

// 日記生成（カテゴリも表示）
function generateEntries(data) {
  const fragment = document.createDocumentFragment();

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

    fragment.appendChild(div);
  });

  entriesContainer.appendChild(fragment);
}

// アーカイブ生成（日付ごと1行 + 件数表示）
function generateArchive(data) {
  const dateCount = {};

  // 日付ごとの件数をカウント
  data.forEach(entry => {
    dateCount[entry.date] = (dateCount[entry.date] || 0) + 1;
  });

  // 日付ごとに1行だけ作る
  Object.keys(dateCount).forEach(date => {
    const count = dateCount[date];

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${date} (${count})`;

    a.addEventListener("click", e => {
      e.preventDefault();
      filterByDate(date);
      closeMenu();
    });

    li.appendChild(a);
    archiveList.appendChild(li);
  });
}

// 同じ日付のエントリを全部表示
function filterByDate(date) {
  welcome.style.display = "none";
  entriesContainer.style.display = "block";

  document.querySelectorAll(".entry").forEach(entry => {
    const entryDate = entry.querySelector(".date").textContent.trim();

    if (entryDate === date) {
      entry.style.display = "block";
      entry.classList.add("fade-in");
    } else {
      entry.style.display = "none";
      entry.classList.remove("fade-in");
    }
  });
}

// カテゴリ生成（カテゴリごと1行 + 件数表示）
function generateCategories(data) {
  const categoryCount = {};

  data.forEach(entry => {
    categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
  });

  Object.keys(categoryCount).forEach(cat => {
    const count = categoryCount[cat];

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${cat} (${count})`;

    a.addEventListener("click", e => {
      e.preventDefault();
      filterByCategory(cat);
      closeMenu();
    });

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
topButton.addEventListener("click", () => {
  welcome.style.display = "block";
  entriesContainer.style.display = "none";
  closeMenu();
});

// ハンバーガーメニュー
menuButton.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

overlay.addEventListener("click", closeMenu);

// ダークモード
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  knob.textContent = "☀️";
} else {
  knob.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  knob.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/*
jsonファイル横に長すぎるから、
"id":"",
"date":"",
"category":"",
"text":[
  "a",
  "b",
  "c"
]
っていう形にしたい。だからちょっと仕様変えないといけない。
多分33行目の
// 日記生成（カテゴリも表示）
function generateEntries(data) {
  const fragment = document.createDocumentFragment();

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

    fragment.appendChild(div);
  });

  entriesContainer.appendChild(fragment);
}
を
  // 日記生成（カテゴリも表示）
function generateEntries(data) {
  const fragment = document.createDocumentFragment();

  data.forEach(entry => {
    const id = entry.id || entry.date;

    const div = document.createElement("div");
    div.className = "entry";
    div.id = id;
    div.dataset.category = entry.category;

    const text = Array.isArray(entry.text)
    ? entry.text.join("<br>")
    : entry.text;

    div.innerHTML = `
      <div class="date">${entry.date}</div>
      <div class="category">カテゴリ：${entry.category}</div>
      <p>${entry.text}</p>
    `;

    fragment.appendChild(div);
  });

  entriesContainer.appendChild(fragment);
}
に変えたらいけるかもだけど、過去の日記をどうするのか問題あるからいったんここに書いとく
あとちゃんと動くかもわかんないから
*/