# 🚀 Panduan Deploy ke Render

Render adalah platform deployment cloud yang mirip Railway. Berikut langkah-langkahnya:

## ✅ Prasyarat

- ✅ Code sudah di GitHub (https://github.com/satopyio/restaurant-order-app)
- ✅ Render account (https://render.com)

---

## 📝 STEP 1: Create Render Account

1. Buka https://render.com
2. Klik **Sign Up**
3. Pilih **GitHub** untuk login
4. Authorize Render access ke GitHub

---

## 🎯 STEP 2: Deploy Service Baru

### 2.1 Create Web Service

1. Di Render dashboard, klik **New +**
2. Pilih **Web Service**
3. Pilih **Deploy an existing repository**
4. Cari & klik `restaurant-order-app`
5. Klik **Connect**

### 2.2 Configure Web Service

Fill the form:

| Field | Value |
|-------|-------|
| **Name** | `restaurant-order-app` |
| **Region** | Singapore (atau pilihan terdekat) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

### 2.3 Environment & Plan

- **Instance Type**: Free tier (gratis)
- **Environment Variables**: (tidak perlu diisi untuk app ini)

### 2.4 Deploy

Klik **Create Web Service**

Render akan:
1. Clone repo dari GitHub
2. Install dependencies (`npm install`)
3. Start server (`node server.js`)
4. Assign domain otomatis

**Tunggu 5-10 menit untuk deployment selesai**

---

## 📍 STEP 3: Akses Aplikasi

Setelah deploy selesai:

1. Di Render dashboard, lihat service `restaurant-order-app`
2. Di bagian atas ada URL seperti:
   ```
   https://restaurant-order-app-xxxx.onrender.com
   ```
3. Buka URL tersebut di browser

**Halaman:**
- **Ambil Pesanan**: `https://restaurant-order-app-xxxx.onrender.com`
- **Papan Kontrol**: `https://restaurant-order-app-xxxx.onrender.com/dashboard.html`

---

## 🔄 Update Aplikasi

Setiap push ke GitHub = Render otomatis redeploy:

```powershell
# Edit file
# ...

git add .
git commit -m "Update fitur"
git push origin main

# Render otomatis redeploy dalam 1-2 menit
```

Lihat status deploy di Render dashboard → **Events** tab

---

## ⚠️ Penting: Port Configuration

✅ **Sudah OK** - File `.railwayrc.json` dan `Procfile` sudah ada

Render akan:
- Automatically detect Node.js
- Use `Root Directory: backend` untuk entry point
- Run `node server.js`

---

## 🆚 Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | Generous | Generous |
| Auto-deploy | ✅ | ✅ |
| Database | PostgreSQL | PostgreSQL |
| Setup Time | 2-3 menit | 5-10 menit |
| Performance | Excellent | Excellent |

---

## 💡 Tips Render

1. **Custom Domain** (Paid)
   - Upgrade plan untuk custom domain
   - Atau gunakan subdomain gratis dari Render

2. **Environment Variables**
   - Di Service → Environment
   - Tambah variable jika diperlukan

3. **Monitor Logs**
   - Lihat di Service → **Logs** tab
   - Useful untuk troubleshooting

4. **Auto Sleep**
   - Free tier akan sleep jika idle
   - Akses pertama akan slow (30 detik)
   - Upgrade plan untuk always-on

---

## 🐛 Troubleshooting

### ❌ Build Failed

Lihat **Build Logs** di Render dashboard:
- Check if `package.json` complete
- Check Node version compatibility

### ❌ Port Error

Jika error port:
1. Edit `backend/Procfile`
2. Tambah: `web: PORT=3000 node server.js`

### ❌ Frontend Not Loading

Pastikan `Root Directory` di Render = `backend`

---

## ✨ Selesai!

Aplikasi Anda live di Render! 🎉

**URL Anda**: https://restaurant-order-app-xxxx.onrender.com

---

## 📚 Referensi

- Render Docs: https://render.com/docs
- Render Pricing: https://render.com/pricing
- GitHub Integration: https://render.com/docs/github

Butuh bantuan? Contact Render support atau refer docs mereka.
