# Wealth Dashboard — Setup Guide

## What You're Deploying
A personal wealth tracking PWA (Progressive Web App) that installs on your phone like a real app.

**Real-time data sources (all free, no keys needed):**
- Mutual Fund NAVs: Live from AMFI (mfapi.in)
- Stock Prices: Live from Yahoo Finance (via serverless API)
- Gold/Silver Prices: Manual entry (check Google, update in app)

**Data storage:** Everything saved locally on YOUR device (localStorage). No server, no account, completely private.

---

## Step-by-Step Setup (15 minutes)

### Step 1: Create a New GitHub Repository

1. Go to **github.com** → click the **+** button (top right) → **New repository**
2. Name it: `wealth-app`
3. Keep it **Public** (needed for free Vercel hosting)
4. Click **Create repository**

### Step 2: Upload the Files

1. On your new repo page, click **"uploading an existing file"** link
2. Upload these files/folders from the project:
   ```
   public/
     index.html
     manifest.json
     icon.svg
   api/
     stocks.js
   vercel.json
   ```

   **Important:** Maintain the folder structure. Upload the `public` and `api` folders with their contents.

   **Tip:** The easiest way is to drag and drop the entire `public` and `api` folders, plus `vercel.json`, onto the upload page.

3. Click **Commit changes**

### Step 3: Deploy on Vercel

1. Go to **vercel.com** (you already have an account from Kala Kuteer)
2. Click **Add New** → **Project**
3. Find and select your `wealth-app` repository
4. **Framework Preset:** Select **"Other"**
5. Leave all other settings as default
6. Click **Deploy**
7. Wait 1-2 minutes for deployment

Vercel will give you a URL like: `wealth-app-xyz.vercel.app`

### Step 4: Install on Your Phone (iPhone)

1. Open Safari → go to your Vercel URL
2. Tap the **Share button** (square with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Name it "Wealth" → tap **Add**
5. Done! You'll see a 💎 icon on your home screen

### Step 4: Install on Your Phone (Android)

1. Open Chrome → go to your Vercel URL
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **Add**
5. Done! Opens fullscreen like a native app

---

## How It Works

| Feature | Source | How |
|---------|--------|-----|
| Mutual Fund NAV | mfapi.in (AMFI) | Auto-fetches when you tap refresh |
| Stock Prices | Yahoo Finance | Auto-fetches via `/api/stocks` serverless function |
| Gold/Silver | Manual | Tap "Update" on Metals tab, enter today's rate |
| All your data | localStorage | Stored on YOUR phone, completely private |

---

## Daily Usage

1. **Open the app** from your home screen
2. **Metals tab:** Tap ✏️ Update → enter today's gold/silver rate from Google
3. **Markets tab:** Tap ↻ to refresh MF NAVs and stock prices
4. **Home tab:** See your total net worth instantly

---

## FAQ

**Q: Will I lose my data if I clear browser cache?**
A: Yes, localStorage is tied to your browser. Don't clear site data for this URL. Bookmark it and treat it like an app.

**Q: Can I access it from another device?**
A: Yes, same Vercel URL on any device. But data is per-device (stored locally). You'd need to re-enter on a new device.

**Q: Is my financial data safe?**
A: Your data never leaves your phone. It's stored in your browser's localStorage, not on any server. The only network calls are to fetch current prices (MF NAVs, stock prices).

**Q: What if Yahoo Finance stops working for stocks?**
A: You can still manually track stocks by entering quantities and average prices. The portfolio value will show based on the last fetched price.

**Q: Can I get a custom domain?**
A: Yes, in Vercel dashboard → your project → Settings → Domains. Add any domain you own. But the free `.vercel.app` URL works perfectly fine.
