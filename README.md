# Restaurant Order Web App - Waiter System

Sistem web app untuk waiter mengambil pesanan dari pelanggan di restoran. Kompatibel dengan iOS 9 dan perangkat lama lainnya.

## 🎯 Fitur Utama

- **Ambil Pesanan** - Interface intuitif untuk waiter mengambil pesanan pelanggan
- **Menu Display** - Menampilkan menu restoran dengan harga dan kategori
- **Papan Kontrol** - Dashboard untuk tracking status pesanan (Menunggu → Siap → Selesai)
- **Update Status** - Waiter dapat update status pesanan secara real-time
- **Auto-Refresh** - Dashboard otomatis refresh setiap 5 detik
- **Responsive Design** - Bekerja sempurna di desktop, tablet, dan mobile
- **iOS 9 Compatible** - Menggunakan HTML/CSS/JavaScript vanilla tanpa library modern
- **Bahasa Melayu** - Interface dalam Bahasa Melayu

## 📱 Alur Sistem

### Halaman 1: Ambil Pesanan (Waiter Order Taker)
**URL**: `http://localhost:3000`

```
Waiter:
1. Lihat daftar menu di sebelah kiri
2. Pilih jumlah item dengan tombol +/-
3. Klik "Tambah" untuk menambah ke pesanan
4. Masukkan nama pelanggan
5. Masukkan nombor meja
6. Klik "Simpan Pesanan"
↓
Pesanan tersimpan dan tampil di Papan Kontrol
```

### Halaman 2: Papan Kontrol (Dashboard)
**URL**: `http://localhost:3000/dashboard.html`

```
Kitchen/Waiter:
1. Lihat semua pesanan dengan filter: Menunggu, Siap, Selesai, Semua
2. Setiap kartu pesanan menunjukkan:
   - Nama pelanggan & meja
   - Menu yang dipesan
   - Jumlah harga
   - Status pesanan
3. Tombol aksi:
   - "Siap" - Mark pesanan siap disajikan
   - "Selesai" - Tandai pesanan sudah diserahkan
   - "Batal" - Batalkan pesanan
4. Auto-refresh setiap 5 detik
5. Tombol "Segarkan" manual untuk refresh instant
```

## 📂 Struktur Project

```
restaurant-order-app/
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Dependencies
│   ├── data/
│   │   ├── menu.json      # Data menu
│   │   └── orders.json    # Data pesanan
│   └── routes/
└── frontend/
    ├── index.html              # Halaman ambil pesanan (Waiter)
    ├── dashboard.html          # Papan kontrol pesanan
    ├── waiter-order.css       # CSS untuk halaman ambil pesanan
    ├── waiter-order.js        # JavaScript untuk halaman ambil pesanan
    ├── dashboard.css          # CSS untuk papan kontrol
    ├── dashboard.js           # JavaScript untuk papan kontrol
    ├── waiter.css             # (Legacy - tidak digunakan)
    ├── waiter.js              # (Legacy - tidak digunakan)
    ├── app.js                 # (Legacy - tidak digunakan)
    └── style.css              # (Legacy - tidak digunakan)
```

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### 3. Akses Aplikasi

**Ambil Pesanan** (Main Interface):
```
http://localhost:3000
```

**Papan Kontrol** (Dashboard untuk tracking):
```
http://localhost:3000/dashboard.html
```

## 📊 API Endpoints

### GET /api/menu
Mendapatkan semua menu items

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nasi Goreng Istimewa",
    "category": "main",
    "price": 8.50,
    "description": "Nasi goreng dengan telur, udang dan sayuran"
  }
]
```

### GET /api/orders
Mendapatkan semua orders

**Response:**
```json
[
  {
    "id": 1234567890,
    "customerName": "Ali (Meja 1)",
    "items": [
      {
        "id": 1,
        "name": "Nasi Goreng Istimewa",
        "price": 8.50,
        "quantity": 2
      }
    ],
    "totalPrice": 17.00,
    "status": "pending",
    "createdAt": "2024-05-23T10:30:00.000Z"
  }
]
```

### POST /api/orders
Membuat order baru

**Request Body:**
```json
{
  "customerName": "Ali (Meja 1)",
  "items": [
    {
      "id": 1,
      "name": "Nasi Goreng Istimewa",
      "price": 8.50,
      "quantity": 2
    }
  ],
  "totalPrice": 17.00
}
```

### PUT /api/orders/:id
Update status order

**Request Body:**
```json
{
  "status": "ready"
}
```

**Status Values**: `pending`, `ready`, `completed`

## 🎨 Customization

### Edit Menu
Edit file `backend/data/menu.json` untuk mengubah menu items

### Edit Styling
- `frontend/waiter-order.css` - Styling halaman ambil pesanan
- `frontend/dashboard.css` - Styling papan kontrol

### Add/Remove Features
Edit file:
- `backend/server.js` - API endpoints
- `frontend/waiter-order.js` - Logic halaman ambil pesanan
- `frontend/dashboard.js` - Logic papan kontrol

## 🌐 Browser Compatibility

- iOS 9+ (Safari)
- Android 4.4+ (Chrome, Firefox)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## 💡 User Roles

### Waiter (Pelayan)
- Akses halaman "Ambil Pesanan"
- Lihat menu
- Buat pesanan baru
- Akses Papan Kontrol untuk tracking

### Kitchen/Management
- Akses Papan Kontrol
- Lihat status pesanan
- Update status (Menunggu → Siap → Selesai)

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript ES5 (vanilla)
- **Backend**: Node.js, Express.js
- **Database**: JSON file storage
- **Language**: Bahasa Melayu

## 📝 Menu Default (RM - Ringgit Malaysia)

1. Nasi Goreng Istimewa - RM 8.50
2. Mee Goreng Mamak - RM 7.50
3. Laksa Lemak - RM 6.50
4. Gado-Gado Istimewa - RM 7.00
5. Teh Tarik - RM 2.50
6. Jus Tembikai - RM 4.00

## 📄 License

MIT

---

**Catatan**: Sistem ini dirancang khusus untuk waiter mengambil pesanan. Tidak ada customer-facing ordering interface - semua pesanan harus diambil oleh waiter.
