# 🥗 伊布的沙拉吧 - 開發與串接整合文件 (GEMINI.md)

本文件完整記錄了「伊布的沙拉吧」專案中所有新增與更新的檔案、核心功能邏輯、Google 試算表資料庫串接指南，以及 GA4 電子商務與站內搜尋事件追蹤設定。

---

## 🔗 實作線上網址
- **線上展示網站**：[https://moemuom9488m.github.io/TKU_GA_course/sarab/](https://moemuom9488m.github.io/TKU_GA_course/sarab/)
- **Sitemap 網址**：[https://moemuom9488m.github.io/TKU_GA_course/sarab/sitemap.xml](https://moemuom9488m.github.io/TKU_GA_course/sarab/sitemap.xml)

---

## 📂 更新與新增檔案對照表

本專案主要修改及新增的檔案結構如下：
```text
TKU_GA_course/
├── sarab/
│   ├── index.html              # 首頁（修改：Order Now 連結與建議搜尋 HTML）
│   ├── checkout.html           # [NEW] 結帳中心頁面（含購物清單、收件表單與資料庫連線）
│   ├── js/
│   │   └── main.js             # 專案腳本（修改：加入 LocalStorage 購物車、封閉式建議搜尋與 URL 參數）
│   └── sitemap.xml             # Sitemap 網站地圖（已包含首頁與結帳頁）
├── robots.txt                  # 爬蟲規則（已設定 sitemap 指向）
└── GEMINI.md                   # 本開發整合說明文件 [NEW]
```

---

## 🛠️ 核心功能開發細節

### 1. 購物車持久化 (LocalStorage Cart Persistence)
* **目的**：解決靜態網頁在重整時購物車商品數字會歸零的問題。
* **邏輯**：
  - 在 `main.js` 新增 `getCart()`、`saveCart()` 與 `updateCartBadge()` 方法。
  - 當使用者點選商品詳情彈窗中的 "Add to Cart" 時，會將商品的 `title`、`price`、`img`、`quantity` 與 `category` 組合成物件存入 `localStorage` 的 `sarab_cart` 陣列中。
  - 網頁初始化與每次購物車增減時，自動讀取並更新右上角購物袋的 `cartCount` 徽章數字。

### 2. 封閉式搜尋與建議清單 (Autocomplete Search & Dropdown)
* **目的**：提供顧客在搜尋欄輸入時，能快速點選選單直接跳轉，且僅在現有菜單中進行精準過濾。
* **邏輯**：
  - **建議清單**：輸入英文字母時，JS 會動態擷取首頁所有 `.mcard` 的 `data-title` 與 `data-cat`，進行即時模糊比對，並在搜尋框下方展開高質感的懸浮選單。
  - **點選跳轉**：點擊選單中的建議項目，會自動代入輸入框、關閉搜尋遮罩，並平滑滾動（Smooth Scroll）至首頁菜單（`#menu`）進行過濾。
  - **無結果提示**：搜尋無相符商品時，顯示「無此商品」提示及 **Show All Items** 的重設按鈕。

### 3. 網址參數深度連結 (?q= Query Parameter)
* **目的**：支援搜尋結果分享，並有助於 SEO 檢索與行銷推廣。
* **邏輯**：
  - **動態更新 URL**：搜尋時使用 `window.history.pushState`，在不重整網頁的前提下將網址列更新為 `.../sarab/?q=關鍵字`；重設搜尋時自動清空參數。
  - **進入頁面自動搜尋**：網頁載入時（`DOMContentLoaded`），若偵測到 URL 中有 `?q=` 參數，會自動帶入搜尋框並在 600 毫秒後滾動過濾。

---

## 📊 Google Analytics 4 (GA4) 數據追蹤設定

本專案已在結帳與搜尋流程中完美整合了 GA4 的推薦事件，用於分析轉換漏斗：

1. **進入結帳頁面 (`begin_checkout`)**：
   - 載入結帳頁時，若購物車有商品，會傳送商品明細（名稱、價格、數量、分類）與購物車總額至 GA4。
2. **下單成功 (`purchase`)**：
   - 模擬付款完成後，發送 `purchase` 轉換事件。回傳隨機產生的 `transaction_id`、總付費金額 `value`、稅額 `tax`、運費 `shipping` 以及商品明細。
3. **站內搜尋 (`view_search_results`)**：
   - 每次執行搜尋時，發送 `view_search_results` 事件，並帶有 `search_term` 參數以記錄使用者的搜尋關鍵字。

> [!TIP]
> **本地端除錯 (Localhost Debug)**：
> 在本地端預覽時，為了防範第三方 Cookie 阻擋，我們在 gtag 初始化設定中加入了 `SameSite=None;Secure`：
> ```javascript
> gtag('config', 'G-H8YB1Z4BRP', {
>    'cookie_flags': 'SameSite=None;Secure'
> });
> ```

---

## 🗄️ Google Sheets 後端資料庫串接指南

為解決靜態網頁（GitHub Pages）無法運行資料庫的問題，我們使用 **Google Apps Script (GAS)** 作為 Web API 橋樑，將結帳資訊即時寫入 Google 試算表。

### 1. 雲端試算表 GAS 程式碼
在 Google 試算表 -> **延伸功能** -> **Apps Script** 中貼上以下程式：

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 檢查第一行是否已經有表頭，如果沒有則自動建立
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["訂單時間", "訂單編號", "顧客姓名", "電話號碼", "電子郵件", "外送地址", "付款方式", "商品明細", "總金額", "備註"]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.orderId,
      data.name,
      data.phone,
      data.email,
      data.address,
      data.paymentMethod === 'cod' ? '貨到付款' : '線上刷卡',
      data.items,
      "$" + data.totalPrice,
      data.notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2. GAS 部署設定
1. 點擊 **部署** -> **新增部署** -> 選擇 **網頁應用程式 (Web App)**。
2. **執行身份** 選擇：`我 (Me)`。
3. **誰有權限存取** 選擇：`所有人 (Anyone)`（這步非常重要，否則 GitHub Pages 的下單請求會被拒絕）。
4. 部署後複製產生的 **網頁應用程式 URL**。

### 3. 前端串接設定
在 [checkout.html](file:///c:/Users/TKU-STAFF/Desktop/TKU_GA_course/sarab/checkout.html) 的第 579 行，填入您的部署網址：
```javascript
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyANhyGw4NnSDd8VbB8S8-FBd9aaB7nM_N93VjV11L-xI2JaLASAcH2954bydxPvZ4S/exec';
```

---

## 🧪 功能完整驗證流程

1. **購物與持久化測試**：首頁隨意將 2 個 Classic Smash Burger 加入購物車，重整網頁後，右上角購物袋標籤數字維持 `2` 不變。
2. **搜尋與聯想測試**：點擊首頁搜尋圖示，輸入字母 `p`，自動彈出 *Margherita Royale* (Pizza) 與 *Truffle Mushroom Pasta* (Pasta)。點擊 *Margherita Royale*，搜尋框自動關閉並滾動至 Pizza 卡片。
3. **網址參數測試**：此時觀察網址列應變為 `.../sarab/?q=Margherita%20Royale`。複製該網址，在新分頁開啟，網頁載入後應會自動聚焦並搜尋過濾 Pizza。
4. **結帳與資料庫測試**：點擊 Order Now 跳轉至結帳頁，填寫收貨資料，點選 **Place Secure Order**。觀察多步驟「訂單交易處理中...」遮罩動畫。確認 2 秒後顯示「下單成功」收據，此時您的 Google 試算表會立即新增一筆對應的顧客訂單資料。
5. **GA4 追蹤確認**：打開 GA4 後台的 `DebugView`，應能即時觀測到包含品項價格的 `begin_checkout`、`purchase` 以及 `view_search_results` 事件。
