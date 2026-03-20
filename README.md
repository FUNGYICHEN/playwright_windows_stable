# Playwright Windows 本機穩定版

這份版本改用 **Node.js Playwright**，目的就是避開 Windows 上 Python + `greenlet` 容易被本機安全政策擋掉的問題。

## 內容
- `tests/public.spec.js`：公開頁基本檢查與基礎站點流程
- `tests/i18n.spec.js`：多語系首頁文案檢查
- `tests/auth.spec.js`：登入、切頁、登出流程檢查
- `tests/visual.spec.js`：首頁 / 登入頁桌機版面與基本視覺檢查
- `tests/copy.spec.js`：標題、公告、placeholder、CTA、共用文案一致性檢查

## 安裝
在 Windows PowerShell：

```powershell
cd C:\Users\user\Desktop\playwright
copy .env.example .env
npm install
npx playwright install chromium
```

## 執行
### 跑全部
```powershell
npx playwright test
```

### 跑全部 headed
```powershell
run_all_headed.cmd
```

### 只跑公開頁
```powershell
npx playwright test tests/public.spec.js
```

### 只跑多語系
```powershell
npx playwright test tests/i18n.spec.js
```

### 只跑登入 / 登出流程
```powershell
npx playwright test tests/auth.spec.js
```

### 只跑視覺 / 版面檢查
```powershell
npx playwright test tests/visual.spec.js
```

### 只跑文案 / 一致性檢查
```powershell
npx playwright test tests/copy.spec.js
```

### Windows 直接雙擊 headed 腳本
- `run_public_headed.cmd`
- `run_i18n_headed.cmd`
- `run_auth_headed.cmd`
- `run_visual_headed.cmd`
- `run_copy_headed.cmd`

## 說明
- 這份版本優先追求 **Windows 本機可跑**
- 目前 selector 以首頁導覽、登入頁欄位、cookie、固定文案為主，避免使用太脆弱的動畫或 hover 依賴
- 登出 case 已針對站點右側面板在 1440px 桌機視窗下容易落在邊界外的情況，改用 DOM click 方式避免 Windows headed 執行時誤判為 flaky
- 如需再補更多 case，可在這份穩定版上繼續擴充
