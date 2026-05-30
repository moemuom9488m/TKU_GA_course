# 📊 GA4 與 Expression Web 4 練習目標追蹤清單

此清單旨在協助您在使用本餐廳模板時，逐步掌握 Microsoft Expression Web 4 的編輯技巧，以及 Google Analytics 4 (GA4) 的數據追蹤與分析實務。

---

## 🛠️ 第一階段：Microsoft Expression Web 4 工具熟悉

- [ ] **1-1. 建立與開啟網站專案**
  - 使用 `Site` -> `Open Site...` 正確載入 `sarab` 資料夾。
- [ ] **1-2. 熟悉編輯界面與視圖切換**
  - 練習在 `Design`（設計）、`Split`（分割）、`Code`（程式碼）三種視圖之間進行切換。
- [ ] **1-3. 網頁文字與基本排版修改**
  - 試著修改首頁 `index.html` 中的主標題（例如將 "Delicious Fast Food" 修改為您自訂的店名）。
- [ ] **1-4. 設定瀏覽器預覽（F12）**
  - 設定預覽瀏覽器（如 Chrome/Edge），並熟悉在編輯後按 F12 即時重新整理檢視結果。

---

## 📈 第二階段：GA4 基礎安裝與流量驗證

- [ ] **2-1. 取得 GA4 評估 ID**
  - 在 Google Analytics 後台建立一個全新的「建立資源」並新增「網站資料串流」，取得以 `G-` 開頭的評估 ID。
- [ ] **2-2. 埋設全站追蹤碼（Google Tag）**
  - 在 Expression Web 4 中打開 `index.html`，將 GA4 的 gtag 程式碼貼入 `<head>` 區段中。
- [ ] **2-3. ⚡ 關鍵：建立網頁伺服器環境（不使用 `file://`）**
  - **重要提醒**：GA4 基於安全 Cookie 規定，**預設不支援直接雙擊開啟的 `file://` 協議網頁**。
  - **實作方法**：請利用 Expression Web 4 內建的 Development Server 預覽功能（網址通常為 `http://localhost:XXXX`），或者將專案部署至 GitHub Pages 等靜態託管平台。必須確保網址開頭是 `http://` 或 `https://`，GA4 才能正確運作。
- [ ] **2-4. 即時流量驗證（Real-time Test）**
  - 使用伺服器環境瀏覽網頁並在網頁上隨意點擊，確認 GA4 後台的「即時報告」中能即時偵測到您的造訪與 `page_view` 事件。
- [ ] **2-5. 🚀 部署至 GitHub Pages（實戰線上環境）**
  - **步驟 1**：進入您的專案網頁 [TKU_GA_course 設定頁面](https://github.com/moemuom9488m/TKU_GA_course/settings/pages)。
  - **步驟 2**：在 **Build and deployment** 底下的 **Source** 選擇 `Deploy from a branch`。
  - **步驟 3**：將 **Branch** 選擇 `main` 分支，資料夾選擇 `/ (root)`，並點擊 **Save**。
  - **步驟 4**：等待 1-2 分鐘後重新整理設定頁面，確認看見 `Your site is live at...` 綠色區塊。
  - **步驟 5**：造訪線上網址並加上子路徑以觀看網頁：`https://moemuom9488m.github.io/TKU_GA_course/sarab/`。

---

## 🎯 第三階段：GA4 自訂事件追蹤（核心實戰）

當使用者與網頁上的動態元素互動時，主動發送自訂事件（於 `index.html` 或 `js/main.js` 中新增代碼）。

- [ ] **3-1. 追蹤「導覽列點擊動作」**
  - **目標**：追蹤點擊 "Order Now" 或其它選單連結。
  - **事件名稱**：`click_order_now` 或 `nav_click`。
- [ ] **3-2. 追蹤「菜單分類篩選動作」**
  - **目標**：了解顧客最常點擊漢堡、披薩還是甜點等分類。
  - **實作方式**：在 [main.js](file:///c:/Users/TKU-STAFF/Downloads/sarab-1.0.0/sarab/js/main.js) 的 `.filtbtn` 點擊監聽器中，抓取 `data-f` 屬性值（例如 `burgers`）發送事件。
  - **事件名稱**：`select_content`（包含參數 `content_type: 'menu_category'` 與 `item_id: 分類名稱`）。
- [ ] **3-3. 追蹤「商品詳情彈窗開啟」**
  - **目標**：當顧客點選某道菜開啟彈窗時進行紀錄。
  - **事件名稱**：`view_item`（包含參數 `item_name` 紀錄菜色名稱）。
- [ ] **3-4. 追蹤「加入購物車（模擬）」**
  - **目標**：顧客在彈窗內選擇數量後點擊 "Add to Cart"。
  - **💡 預防中斷小撇步**：原版靜態網頁點擊加入購物車按鈕時，若有連結跳轉，請使用 `event.preventDefault()` 阻止預設跳轉/重整，確保 GA4 事件有足夠時間送出。
  - **事件名稱**：`add_to_cart`（包含參數 `quantity` 紀錄加入數量）。
- [ ] **3-5. 追蹤「預約提交成功（名單收集）」**
  - **目標**：在預約表單提交成功、載入動畫結束後觸發。
  - **事件名稱**：`generate_lead`。
- [ ] **3-6. 追蹤「聯絡我們表單提交」**
  - **目標**：顧客成功送出聯絡我們訊息。
  - **事件名稱**：`contact`。
- [ ] **3-7. ➕ 追蹤「外連點擊：點擊 Google 地圖或電話」**
  - **目標**：追蹤顧客是否點擊頁尾的聯絡地址（連到 Google Map）或撥打電話，評估實體店導客效果。
  - **事件名稱**：`click_contact_link`（參數 `link_url` 紀錄是地圖連結或電話號碼）。
- [ ] **3-8. ➕ 追蹤「預約表單欄位填寫失敗 / 錯誤」**
  - **目標**：若顧客未填寫必填欄位或格式錯誤導致無法送出，可觸發錯誤事件，幫助優化 UI/UX 體驗。
  - **事件名稱**：`form_error`。

---

## 🏆 第四階段：GA4 除錯與數據分析報表

- [ ] **4-1. 使用 GA4 DebugView 工具進行即時除錯**
  - 安裝 Chrome 外掛 `Google Analytics Debugger` 或在網址後加上 `?gtag_debug=1`。
  - **💡 本地端 Debug 秘訣**：若在 `localhost` 除錯，可在 `index.html` 的 gtag 設定中加入以下設定，防範 Cookie 阻擋：
    ```javascript
    gtag('config', 'G-XXXXXXXXXX', { 'cookie_flags': 'SameSite=None;Secure' });
    ```
- [ ] **4-2. 自訂維度與參數設定**
  - 在 GA4 後台將自訂的事件參數（如商品名稱、分類、數量等）註冊為「自訂維度」或「自訂指標」。
- [ ] **4-3. 觀察與設計分析報表**
  - 累積測試數據後，在 GA4 的「探索」功能中，拉出一張「哪款食物點擊率最高」或「預約轉化漏斗」的分析圖表。
  - **🎯 預約轉化漏斗步驟定義**：
    1. `page_view` (進入首頁)
    2. `scroll` (滾動到預約表單區塊，或點擊導覽列 Table Reservation)
    3. `generate_lead` (成功送出預約表單)

---

💡 **貼心提醒**：
* 編輯程式碼時，請使用 [index.html](file:///c:/Users/TKU-STAFF/Downloads/sarab-1.0.0/sarab/index.html) 以及 [main.js](file:///c:/Users/TKU-STAFF/Downloads/sarab-1.0.0/sarab/js/main.js) 來定位並修改。
* 修改完成後，記得在 Expression Web 4 按下 `Ctrl + S` 儲存，再到瀏覽器按 `F5` 重新整理，才能順利將事件送出喔！
