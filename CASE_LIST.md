# Windows 本機穩定版 CASE LIST

## 已提供
- WIN-PUB-001 首頁可正常開啟
- WIN-PUB-002 首頁主要分類顯示
- WIN-PUB-003 首頁主要分類路徑存在
- WIN-PUB-004 客服入口顯示
- WIN-PUB-005 語系 icon 存在
- WIN-PUB-006 版權資訊顯示
- WIN-PUB-007 登入頁元素存在
- WIN-PUB-008 首頁分類可導向對應頁面
- WIN-PUB-009 首頁登入 CTA 可進入登入頁
- WIN-PUB-010 客服連結指向 Lin.ee
- WIN-PUB-011 登入頁先去逛逛可回首頁
- WIN-I18N-001 繁中首頁文案
- WIN-I18N-002 簡中首頁文案
- WIN-I18N-003 英文首頁文案
- WIN-I18N-004 泰文首頁文案
- WIN-I18N-005 越文首頁文案
- WIN-AUTH-001 可登入並看到帳號資訊
- WIN-AUTH-002 登入後會員功能文案存在
- WIN-AUTH-003 登入後會建立主要登入 cookie
- WIN-AUTH-004 登入後可切換真人與電子頁
- WIN-AUTH-005 可登出並回到未登入狀態
- WIN-VIS-001 首頁沒有明顯橫向超框
- WIN-VIS-002 首頁圖片資源沒有明顯破圖
- WIN-VIS-003 首頁主要 banner 區塊可見
- WIN-VIS-004 首頁主要文案區塊未明顯被裁切
- WIN-VIS-005 登入頁沒有明顯橫向超框
- WIN-VIS-006 登入表單輸入框與按鈕左右對齊
- WIN-VIS-007 首頁桌機導覽列與登入 CTA 都在視窗內
- WIN-COPY-001 首頁標題與頁尾文案一致
- WIN-COPY-002 登入頁 placeholder 與 CTA 文案正確
- WIN-COPY-003 登入頁欄位標籤文案正確
- WIN-COPY-004 登入頁免責聲明文案存在
- WIN-COPY-005 首頁四個主分類文案順序一致
- WIN-VR-001 首頁 shell 截圖比對
- WIN-VR-002 登入頁表單截圖比對
- WIN-VR-003 首頁上方導覽列截圖比對
- WIN-LVIS-TW-001~006 繁中語系視覺驗證矩陣（首頁 / 登入頁規章 / 會員側欄 / 投注紀錄 / 會員資料 / 維護時間）
- WIN-LVIS-CN-001~006 簡中語系視覺驗證矩陣（首頁 / 登入頁規章 / 會員側欄 / 投注紀錄 / 會員資料 / 維護時間）
- WIN-LVIS-EN-001~006 英文語系視覺驗證矩陣（首頁 / 登入頁規章 / 會員側欄 / 投注紀錄 / 會員資料 / 維護時間）
- WIN-LVIS-TH-001~006 泰文語系視覺驗證矩陣（首頁 / 登入頁規章 / 會員側欄 / 投注紀錄 / 會員資料 / 維護時間）
- WIN-LVIS-VN-001~006 越文語系視覺驗證矩陣（首頁 / 登入頁規章 / 會員側欄 / 投注紀錄 / 會員資料 / 維護時間）

## 備註
這份版本是為了 Windows 本機穩定執行而建立，使用 Node.js Playwright。
語系視覺驗證矩陣已新增至 `tests/locale-visual-matrix.spec.js`，目標是用 baseline screenshot + overflow audit 捕捉多語系長文案造成的超框、重疊、跑版與會員功能畫面異常。
