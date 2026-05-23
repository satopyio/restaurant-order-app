# ⚡ QUICK START - Deploy ke Railway

Copy-paste commands ini satu per satu. Ganti `YOUR_USERNAME` dengan username GitHub Anda.

## 1️⃣ Setup GitHub (Terminal PowerShell)

```powershell
# Navigate ke project folder
cd c:\Users\User\Documents\Project

# Initialize git
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit - Restaurant Order App"

# Buat repo di GitHub terlebih dahulu di https://github.com/new
# Kemudian run ini (ganti YOUR_USERNAME):

git remote add origin https://github.com/YOUR_USERNAME/restaurant-order-app.git
git branch -M main
git push -u origin main
```

## 2️⃣ Setup Railway

1. Buka https://railway.app
2. Sign up dengan GitHub
3. Klik **New Project**
4. Pilih **Deploy from GitHub repo**
5. Cari `restaurant-order-app`
6. Klik **Deploy**

Railway akan otomatis:
- ✅ Detect Node.js
- ✅ Install dependencies
- ✅ Run server
- ✅ Assign URL

## 3️⃣ Akses Aplikasi

Tunggu 2-3 menit, kemudian:

1. Buka Railway dashboard
2. Klik project → **backend service**
3. Lihat **Deployments** tab
4. Copy URL dari deployment
5. Buka di browser

**Contoh URL:** `https://restaurant-order-app-prod-xyz.railway.app`

---

## 🔄 Update Aplikasi (Push Changes)

Setiap update auto-deploy:

```powershell
cd c:\Users\User\Documents\Project

# Edit files Anda...

git add .
git commit -m "Your update message"
git push origin main

# Railway otomatis redeploy dalam 1-2 menit
```

---

## ✅ Checklist Sebelum Deploy

- [ ] GitHub account sudah siap
- [ ] Railway account sudah siap  
- [ ] Git installed dan working
- [ ] Repo sudah di GitHub dengan semua files
- [ ] Package.json ada di `backend/`
- [ ] Frontend files ada di `frontend/`
- [ ] Port di server.js sudah pakai `process.env.PORT`

---

## 🎯 Links Berguna

- Create GitHub Repo: https://github.com/new
- Railway: https://railway.app
- Railway Docs: https://docs.railway.app

---

## ⚠️ Catatan Penting

- **Data Pesanan Hilang di Restart**: Gunakan database (Firebase, MongoDB, PostgreSQL) untuk production
- **CORS**: Sudah enable di server.js
- **Frontend + Backend**: Structure sudah correct, `.railwayrc.json` handle ini

Butuh bantuan? Baca `DEPLOY_RAILWAY.md` untuk detail lengkap.
