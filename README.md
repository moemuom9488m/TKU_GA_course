# Sarab - 免費快餐與餐廳 HTML 模板

[![Demo](https://img.shields.io/badge/Demo-Live_Preview-orange?style=for-the-badge)](https://themewagon.github.io/sarab/)
[![Download](https://img.shields.io/badge/Download-ThemeWagon-green?style=for-the-badge)](https://themewagon.com/themes/sarab/)

**Sarab** 是一款現代、響應式且功能豐富的快餐與餐廳單頁 HTML 網頁模板。它專為快餐店、餐廳、咖啡廳及各類餐飲業設計，擁有精美的視覺特效與直觀的互動設計，能夠完美展示菜單、廚師團隊、顧客評價，並包含預約與聯絡表單的模擬互動。

---

## 📂 目錄結構

```text
sarab-1.0.0/
├── sarab/                      # 模板主專案資料夾
│   ├── index.html              # 首頁（主 HTML 檔案）
│   ├── css/                    # 樣式表資料夾
│   │   ├── style.css           # 自訂主樣式表 (含自訂變數)
│   │   ├── bootstrap.min.css   # Bootstrap 5.3 框架
│   │   ├── aos.css             # 捲動動畫樣式 (Animate on Scroll)
│   │   ├── swiper-bundle.min.css # 輪播圖樣式
│   │   ├── magnific-popup.css  # 影片彈窗樣式
│   │   └── all.min.css         # FontAwesome 圖標字型樣式
│   ├── js/                     # 腳本資料夾
│   │   ├── main.js             # 專案自訂邏輯與互動行為
│   │   ├── jquery-3.7.1.min.js  # jQuery 核心庫
│   │   ├── bootstrap.bundle.min.js # Bootstrap 5 JS 套件
│   │   ├── aos.js              # 捲動動畫套件
│   │   ├── swiper-bundle.min.js  # Swiper 輪播圖套件
│   │   └── jquery.magnific-popup.min.js # 彈窗套件
│   ├── img/                    # 圖片與媒體資源
│   └── webfonts/               # FontAwesome 字型檔案
├── Documentation/              # 專案說明文件檔
│   ├── index.html              # 說明文件網頁
│   ├── css/
│   ├── fonts/
│   └── js/
└── README.md                   # 本專案說明（中文版）
```

---

## ✨ 主要功能與特色

- **響應式佈局 (Responsive Layout)**：基於 Bootstrap 5 構建，完美適應桌機、平板與手機等各種螢幕尺寸。
- **動態捲動動畫 (AOS Animation)**：網頁捲動時，元素會以平滑的動畫淡入或放大，提升用戶體驗。
- **菜單動態篩選 (Dynamic Menu Filtering)**：顧客可以點擊分類標籤（如漢堡、披薩、義大利麵、甜點等）來即時過濾展示的菜品。
- **菜單詳情彈窗 (Interactive Item Modal)**：點擊菜品或 "+" 按鈕可彈出詳細視窗，包含卡路里、準備時間、評分、標籤，並可調整數量模擬「加入購物車」。
- **影片彈窗 (Video Lightbox Popup)**：首頁設有「觀看我們的故事」按鈕，點擊可直接以彈窗播放 YouTube 影片。
- **限時優惠倒計時 (Countdown Timer)**：提供逼真的限時特惠倒計時動畫，吸引顧客下單。
- **數字計數器動畫 (Stats Counter)**：捲動到統計區塊時，數字（如滿意顧客、廚師數量等）會產生動態遞增計數效果。
- **預約與聯絡表單 (Reservation & Contact Forms)**：表單點擊提交時會顯示載入動畫（Loading Spinner），模擬與後端的串接過程。
- **自訂燈箱藝廊 (Custom Gallery Popup)**：精美的食物展示牆，點擊可開啟全螢幕大圖並支援上一張/下一張切換。
- **訂閱電子報 (Newsletter)**：底部提供訂閱電子報功能，模擬成功訂閱提示。

---

## 🛠️ 技術棧與第三方套件

- **HTML5 & CSS3**
- **Bootstrap 5.3** - 響應式網頁框架
- **jQuery 3.7.1** - DOM 操作與外掛支援
- **AOS (Animate On Scroll)** - 捲動動畫庫
- **Swiper Bundle** - 用於客戶評價輪播
- **Magnific Popup** - 彈窗與燈箱效果
- **FontAwesome 5** - 豐富的向量圖標庫
- **Google Fonts**：使用的字型包括：
  - *Playfair Display* (用於主標題)
  - *Poppins* (用於內文)
  - *Dancing Script* (用於手寫風副標題)

---

## 🚀 如何開始使用

### 本地瀏覽
1. 下載或複製此專案到您的本地電腦。
2. 進入 `sarab/` 目錄，雙擊 `index.html` 即可在瀏覽器中直接開啟網頁。
3. （推薦）使用本地伺服器工具（如 VS Code 的 **Live Server** 套件）開啟，可獲得更好的載入體驗及避免本地路徑跨域問題。

### 🔗 連接到您的 GitHub 倉庫 (Repository)
本專案已對接此課程倉庫：[TKU_GA_course](https://github.com/moemuom9488m/TKU_GA_course)。

如果您想將本地修改好的專案推送到您的 GitHub 倉庫，請先確保您的電腦已安裝 [Git for Windows](https://git-scm.com/)，並在專案根目錄下依序執行以下指令：
```bash
# 1. 初始化本地 Git 倉庫
git init

# 2. 將本地專案連接到 GitHub 遠端倉庫
git remote add origin https://github.com/moemuom9488m/TKU_GA_course.git

# 3. 新增所有檔案到暫存區
git add .

# 4. 提交檔案至本地版本庫
git commit -m "feat: 導入 Sarab 餐廳模板與 GA 練習追蹤清單"

# 5. 將預設分支命名為 main
git branch -M main

# 6. 強制推送/推送至 GitHub 倉庫
git push -u origin main
```

### 部署上線
將 `sarab/` 目錄下的所有檔案及資料夾（`index.html`、`css/`、`js/`、`img/`、`webfonts/`）上傳至您的 Web 主機空間（如 GitHub Pages, Vercel, Netlify 或傳統虛擬主機）即可。

---

## 🎨 自訂與修改指南

### 1. 修改網站主色調
本專案的主色調定義於 `sarab/css/style.css` 的 CSS 變數中。若要更改網站的主色調（預設為紅色 `#e8281a`），只需修改 `:root` 中的變數：
```css
:root {
    --primary: #e8281a;     /* 修改此處可改變全站的主顏色 */
    --primary-rgb: 232, 40, 26;
    /* 其他變數如 --secondary 等也可以在此處自訂 */
}
```

### 2. 更換圖片
所有圖片均存放在 `sarab/img/` 目錄下：
- **Logo與橫幅**：`sarab/img/banner-img.jpg`
- **菜單圖片**：`sarab/img/menu/`
- **廚師圖片**：`sarab/img/chefs/`
- **關於我們**：`sarab/img/about1.jpg`、`sarab/img/about2.jpg`
- 更換圖片時，建議**保持相同的文件名與解析度尺寸**直接替換，以確保排版不跑樣。

### 3. 修改字型
如果您想使用其他字型，可在 `sarab/index.html` 的 `<head>` 中引入新的 Google Fonts，並在 `sarab/css/style.css` 中修改字型定義：
```css
body {
    font-family: 'Poppins', sans-serif; /* 變更內文字型 */
}
h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif; /* 變更標題字型 */
}
```

---

## 👥 作者與授權

- **設計與開發**：由 [Bestwpware](https://bestwpware.com/) 團隊精心設計與編碼。
- **授權協議**：採用 **MIT 授權條款**。您可以自由地修改和使用於個人或商業專案中。
- **發行管道**：由 [ThemeWagon](https://themewagon.com) 進行推廣與發行。
