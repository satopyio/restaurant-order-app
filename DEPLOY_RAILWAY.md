# 🚀 Panduan Deploy ke Railway

Railway adalah platform deployment cloud yang mudah digunakan untuk aplikasi Node.js. Berikut langkah-langkah lengkapnya:

## ✅ Prasyarat

1. **GitHub Account** - Untuk menyimpan code
2. **Railway Account** - Gratis (https://railway.app)
3. **Git installed** - Untuk push ke GitHub

---

## 📝 STEP 1: Siapkan GitHub Repository

### 1.1 Create Repository di GitHub

1. Buka https://github.com/new
2. Masukkan nama repo: `restaurant-order-app`
3. Pilih **Public** atau **Private**
4. Klik **Create repository**

### 1.2 Push Code ke GitHub

Dari folder project Anda:

```bash
# Navigasi ke folder project
cd c:\Users\User\Documents\Project

# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit - Restaurant Order App"

# Add remote (ganti YOUR_USERNAME dan REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/restaurant-order-app.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## 🎯 STEP 2: Setup Railway

### 2.1 Create Account Railway

1. Buka https://railway.app
2. Klik **Sign Up** (gunakan GitHub login untuk kemudahan)
3. Authorize Railway access ke GitHub Anda

### 2.2 Create New Project

1. Klik **New Project** di dashboard Railway
2. Pilih **Deploy from GitHub repo**
3. Cari dan pilih `restaurant-order-app`
4. Authorize Railway untuk access repo

---

## ⚙️ STEP 3: Configure Service

Railway akan auto-detect Node.js karena ada `package.json` di folder `backend`. Tapi kita perlu setup khusus karena struktur project kita unik (backend + frontend terpisah).

### 3.1 Tambah File `.railwayrc.json`

Buat file di **root project** (bukan di backend):

```json
{
  "root": "backend"
}
```

Ini memberitahu Railway bahwa entry point adalah di folder `backend`.

### 3.2 Tambah/Update `Procfile` di Backend

Buat file `backend/Procfile`:

```
web: node server.js
```

---

## 🔧 STEP 4: Set Environment Variables (Opsional)

Jika ada env variables yang diperlukan:

1. Di dashboard Railway → Project Anda
2. Klik **Variables** 
3. Tambahkan jika diperlukan:
   ```
   NODE_ENV = production
   PORT = 3000
   ```

Untuk app ini, semuanya berjalan di port default jadi tidak wajib.

---

## 🚀 STEP 5: Deploy

### 5.1 Trigger Automatic Deploy

Railway akan **otomatis deploy** ketika Anda push ke GitHub:

```bash
# Buat perubahan apapun
echo "# Update" >> README.md

# Commit dan push
git add .
git commit -m "Update for Railway deployment"
git push origin main
```

Railway akan:
1. Detect changes
2. Build aplikasi (npm install)
3. Start server (npm start)
4. Assign domain otomatis

### 5.2 Monitor Deployment

Di Railway dashboard:
1. Klik project Anda
2. Lihat **Deployments** tab
3. Lihat logs real-time
4. Tunggu sampai deploy complete

---

## 📍 STEP 6: Akses Aplikasi

Setelah deploy selesai:

1. Di Railway dashboard, cari **Service** → **backend**
2. Lihat **Deployments** → pilih latest deployment
3. Klik tombol URL atau lihat di **Settings** → **Domains**
4. Railway akan memberikan URL seperti: `https://restaurant-order-app-production.railway.app`

Buka aplikasi:
- **Ambil Pesanan**: `https://your-app.railway.app`
- **Papan Kontrol**: `https://your-app.railway.app/dashboard.html`

---

## 🔄 Update & Redeploy

Setiap kali Anda push update ke GitHub, Railway otomatis redeploy:

```bash
# Buat perubahan
# ...

# Push
git add .
git commit -m "Update menu items"
git push origin main

# Railway akan otomatis redeploy dalam beberapa menit
```

---

## ⚠️ Penting: Penyimpanan Data

**⚠️ PERHATIAN**: File `data/orders.json` dan `data/menu.json` **akan hilang** setiap kali Railway restart atau redeploy karena sistem file Railway ephemeral.

### Solusi 1: Gunakan Database (Recommended)
- Upgrade ke Database PostgreSQL di Railway
- Implement API untuk save/load data dari database

### Solusi 2: Gunakan External API
- Gunakan Firebase, MongoDB Cloud, atau service sejenisnya

### Solusi 3: Untuk Development Saja
- Jika hanya test/demo, tidak perlu khawatir
- Data reset otomatis saat restart

---

## 🐛 Troubleshooting

### ❌ Build Failed

1. Check logs di Railway → Deployments → Build Logs
2. Common issues:
   - ❌ Port conflict → update `server.js` untuk gunakan `process.env.PORT || 3000`
   - ❌ Dependencies missing → ensure `package.json` updated
   - ❌ Wrong root folder → check `.railwayrc.json`

### ❌ Aplikasi tidak load

1. Check logs → Runtime Logs
2. Ensure server.js berjalan tanpa error
3. Verify frontend files ada di `../frontend`

### ❌ CORS errors

Update `server.js` untuk accept all origins (tidak aman untuk production):

```javascript
const cors = require('cors');
app.use(cors());
```

---

## 💡 Tips

1. **Gunakan GitHub Desktop** untuk push lebih mudah (jika tidak terbiasa CLI)
2. **Enable auto-deploy** di Railway settings
3. **Monitor costs** - Railway free tier generous tapi monitor usage
4. **Backup data regularly** sebelum deploy major changes
5. **Test locally dulu** sebelum push ke production

---

## 📚 Referensi Berguna

- Railway Docs: https://docs.railway.app
- Railway Pricing: https://railway.app/pricing
- GitHub Push Guide: https://docs.github.com/en/get-started/importing-your-project-to-github

---

## ✨ Selesai!

Aplikasi Anda sekarang live di Railway! 🎉

**Tips selanjutnya:**
- Customize domain Anda di Railway settings
- Setup monitoring dan alerts
- Backup data ke database yang proper
- Scale up resources jika traffic tinggi

Butuh bantuan? Hubungi Railway support atau baca docs mereka.
