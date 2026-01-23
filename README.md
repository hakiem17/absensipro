# AbsensiPro 📋

**Sistem Manajemen Kehadiran Digital untuk Pemerintah Kabupaten Hulu Sungai Tengah**

[![Version](https://img.shields.io/badge/version-2.0-blue?style=flat-square)](https://github.com/hakiem17/absensipro/releases/tag/v2.0)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/hakiem17/absensipro)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

## 🎯 Tentang Aplikasi

AbsensiPro adalah sistem manajemen kehadiran digital yang dirancang khusus untuk meningkatkan efisiensi dan akurasi data kehadiran dalam setiap acara di lingkungan Pemerintah Kabupaten Hulu Sungai Tengah. Aplikasi ini menyediakan solusi modern untuk menggantikan sistem absensi manual tradisional.

## 🆕 Versi 2.0 - What's New

**Versi 2.0** membawa perbaikan signifikan dan fitur-fitur baru:

### 🐛 **Perbaikan Bug Kritis**
- ✅ Fixed: Admin daftar hadir sekarang dapat memuat acara dengan benar
- ✅ Improved: Alur autentikasi dengan proper async/await handling
- ✅ Enhanced: Error handling yang lebih baik dengan try-catch blocks
- ✅ Added: Loading states untuk UX yang lebih baik (spinners, indicators)

### ✨ **Fitur Baru**
- 📝 **Admin Notulen Acara** - Manajemen notulen rapat/acara
- 🖨️ **Admin Print Daftar Hadir** - Cetak daftar hadir dengan format resmi
- ✍️ **Master Tanda Tangan** - Pengelolaan data master penandatangan
- 📋 **FEATURES.md** - Dokumentasi tracking fitur dan roadmap

### 🏗️ **Peningkatan Struktur Kode**
- 🔧 Separated `admin-common.js` untuk fungsi-fungsi shared
- 📊 Added `admin-dashboard.js` untuk logika dashboard spesifik
- 🎨 Added CSS dan font assets untuk styling yang lebih baik
- 🧹 Cleaned up unused files dan dokumentasi

### 📈 **Peningkatan Kualitas**
- ⚡ Improved realtime subscription handling
- 🛡️ Better error messages dan user feedback
- 🎯 Enhanced code organization dan maintainability

## ✨ Fitur Utama

### 👥 **Untuk Peserta**
- 🎯 **Pilih Acara** - Akses mudah ke daftar acara yang tersedia
- 📝 **Form Kehadiran Digital** - Isi data kehadiran secara online
- ✍️ **Tanda Tangan Digital** - Fitur signature pad untuk tanda tangan
- 📱 **Responsive Design** - Optimal di semua perangkat (mobile, tablet, desktop)
- 🌙 **Dark/Light Mode** - Tema yang dapat disesuaikan

### 🔧 **Untuk Admin**
- 📊 **Dashboard Analytics** - Statistik lengkap dengan Chart.js
- 📅 **Manajemen Acara** - CRUD lengkap untuk pengelolaan acara
- 👥 **Daftar Hadir** - Pencarian, filter, dan pagination dengan loading states
- 📺 **Rekap Live** - Animasi credit roll (post-credit style) untuk tampilan real-time dengan kontrol Play/Pause dan Restart
- 📄 **Export & Print** - Export CSV dan cetak laporan dengan kop surat resmi
- 🖨️ **Print Daftar Hadir** - Cetak daftar hadir dengan format profesional (NEW in v2.0)
- 📝 **Notulen Acara** - Upload dan kelola dokumen notulen (Word/PDF) untuk setiap acara (NEW in v2.0)
- ✍️ **Master Tanda Tangan** - Pengelolaan data master penandatangan (NEW in v2.0)
- 🔗 **QR Code Generator** - Generate QR code untuk akses form
- ⚡ **Real-time Updates** - Update kehadiran secara live dengan error handling yang lebih baik
- 🎨 **Improved UI/UX** - Loading states, better error messages, dan user feedback

## 🏗️ Arsitektur Teknologi

### **Frontend**
- **HTML5** - Struktur semantic dan accessible
- **Bootstrap 5.3.3** - Framework CSS responsif
- **Vanilla JavaScript** - Tanpa dependency framework
- **CSS Custom** - Sistem tema light/dark mode
- **Font Poppins** - Typography modern

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database relasional
- **Real-time Subscriptions** - Update data secara live
- **Supabase Storage** - Penyimpanan file:
  - **Bucket `signatures`** - Tanda tangan digital peserta
  - **Bucket `notulen`** - Dokumen notulen (Word/PDF)

### **Libraries & Tools**
- **Chart.js** - Visualisasi data dashboard
- **Signature Pad** - Tanda tangan digital
- **QRCode.js** - Generator QR code
- **Bootstrap Icons** - Icon set lengkap

## 📁 Struktur Proyek

```
absensipro/
├── 📄 index.html                    # Redirect ke pilih acara
├── 🎯 pilih-acara.html              # Landing page peserta
├── 📝 form-kehadiran.html           # Form isi kehadiran
├── 🔐 login.html                    # Login admin
├── 📊 admin-dashboard.html           # Dashboard statistik
├── 📅 admin-manajemen-acara.html    # CRUD acara
├── 👥 admin-daftar-hadir.html       # Daftar hadir peserta (improved in v2.0)
├── 📺 admin-rekap-acara.html        # Rekap live dengan animasi
├── 📝 admin-notulen-acara.html      # Upload & kelola dokumen notulen Word/PDF (NEW in v2.0)
├── 🖨️ admin-print-daftar-hadir.html # Print daftar hadir (NEW in v2.0)
├── 📁 assets/
│   ├── 📁 js/
│   │   ├── config.js               # Konfigurasi Supabase
│   │   ├── auth.js                 # Sistem autentikasi
│   │   ├── admin-common.js         # Shared admin functions (NEW in v2.0)
│   │   └── admin-dashboard.js      # Dashboard logic (NEW in v2.0)
│   ├── 📁 css/
│   │   └── admin.css               # Admin styling (NEW in v2.0)
│   ├── 📁 font/
│   │   └── arial/                  # Font assets (NEW in v2.0)
│   └── 📁 img/
│       └── logo_hst.png            # Logo resmi HST
├── 📄 Template Surat.pdf            # Template untuk print (NEW in v2.0)
├── 📄 FEATURES.md                   # Feature tracking & roadmap (NEW in v2.0)
├── 📄 database_schema.sql           # Database schema lengkap (NEW in v2.0)
├── 📄 README.md                     # Dokumentasi
└── 📄 .gitignore                    # Git ignore rules
```

## 🚀 Instalasi & Setup

### **Prasyarat**
- Web server (Apache, Nginx, atau static hosting)
- Akun Supabase
- Browser modern dengan JavaScript enabled

### **Langkah Instalasi**

1. **Clone Repository**
   ```bash
   git clone https://github.com/hakiem17/absensipro.git
   cd absensipro
   ```

2. **Konfigurasi Supabase**
   - Buat project baru di [Supabase](https://supabase.com)
   - Buat tabel `events` dan `attendees`
   - Setup Row Level Security (RLS)
   - Update konfigurasi di `assets/js/config.js`

3. **Deploy ke Web Server**
   ```bash
   # Upload semua file ke web server
   # Pastikan file dapat diakses via HTTP/HTTPS
   ```

4. **Konfigurasi Database**
   
   **Cara 1: Menggunakan file schema lengkap (Recommended)**
   ```bash
   # Import file database_schema.sql ke Supabase SQL Editor
   # File ini sudah termasuk semua tabel, indexes, triggers, dan RLS policies
   ```
   
   Atau jalankan file SQL langsung di Supabase Dashboard:
   - Buka Supabase Dashboard → SQL Editor
   - Copy paste isi file `database_schema.sql`
   - Klik "Run" untuk menjalankan
   
   **Cara 2: Manual setup (untuk customisasi)**
   ```sql
   -- File database_schema.sql sudah tersedia di repository
   -- Berisi lengkap: tables, indexes, triggers, RLS policies, views
   -- Lihat file database_schema.sql untuk detail lengkap
   ```
   
   **Tabel yang dibuat:**
   - `events` - Data acara/event
   - `attendees` - Data peserta/kehadiran
   - `master_tanda_tangan` - Master data penandatangan
   - `notulen_acara` - Notulen rapat/acara (dengan kolom `document_url`, `document_name`, `document_type`, `document_path` untuk upload dokumen Word/PDF)
   - `admin_profiles` - Profil admin
   
   **Storage Bucket yang dibuat:**
   - `signatures` - Untuk menyimpan tanda tangan digital peserta
   - `notulen` - Untuk menyimpan dokumen notulen (Word/PDF)

## 🔧 Konfigurasi

### **Supabase Setup**
1. Buat project baru di Supabase Dashboard
2. Update `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `assets/js/config.js`
3. Setup authentication untuk admin
4. Konfigurasi storage bucket:
   - **Bucket `signatures`** - Untuk menyimpan tanda tangan digital peserta
   - **Bucket `notulen`** - Untuk menyimpan dokumen notulen (Word/PDF)
   - Kedua bucket akan dibuat otomatis saat menjalankan `database_schema.sql`

### **Environment Variables**
```javascript
// assets/js/config.js
window.SUPABASE_URL = "your-supabase-url";
window.SUPABASE_ANON_KEY = "your-supabase-anon-key";
```

## 📱 Penggunaan

### **Untuk Peserta**
1. Buka aplikasi di browser
2. Pilih acara yang akan dihadiri
3. Isi form kehadiran lengkap
4. Tanda tangan digital (opsional)
5. Submit form

### **Untuk Admin**
1. Login dengan kredensial admin
2. Kelola acara di halaman Manajemen Acara
3. Monitor kehadiran di Dashboard
4. Upload dokumen notulen (Word/PDF) di halaman Notulen Acara
5. Export data atau cetak laporan
6. Generate QR code untuk akses form

## 🎨 Customization

### **Tema & Styling**
- Edit CSS variables di setiap file HTML
- Customize warna, font, dan layout
- Sesuaikan dengan brand identity instansi

### **Fitur Tambahan**
- Tambahkan field baru di form kehadiran
- Integrasi dengan sistem lain
- Custom report format

## 🔒 Security

- **Authentication** - Sistem login admin yang aman
- **Input Validation** - Sanitasi semua input user
- **HTTPS** - Enkripsi data transmission
- **Row Level Security** - Database access control
- **File Upload Security** - Validasi file tanda tangan

## 📊 Performance

- **Lazy Loading** - Load data sesuai kebutuhan
- **Pagination** - Handle data besar dengan efisien
- **Caching** - Browser caching untuk static assets
- **Optimized Queries** - Database query yang efisien

## 🔄 Upgrade dari Versi Sebelumnya

Jika Anda menggunakan versi 1.0 atau sebelumnya, berikut langkah upgrade ke v2.0:

1. **Backup Data**
   ```bash
   # Backup database dan file penting
   ```

2. **Update Files**
   ```bash
   git pull origin main
   # atau
   git checkout v2.0
   ```

3. **Update Database Schema** (jika diperlukan)
   - Tabel baru untuk notulen dan master tanda tangan
   - Lihat dokumentasi database di folder project

4. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
   - Clear cache untuk memastikan file baru ter-load

5. **Test Fitur Baru**
   - Test admin daftar hadir loading
   - Test fitur notulen acara
   - Test print daftar hadir

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

**Note:** Untuk kontribusi ke versi 2.0+, pastikan mengikuti struktur kode yang sudah diperbaiki.

## 📦 Release History

### Version 2.0 (Current) - 2025-01-27
- 🐛 Fixed critical bug: Admin daftar hadir event loading
- ✨ Added Admin Notulen Acara - Upload & kelola dokumen notulen (Word/PDF) untuk setiap acara
- ✨ Added Admin Print Daftar Hadir feature
- ✨ Added Master Tanda Tangan management
- ✨ Added Edit & Delete fitur untuk daftar hadir peserta
- ✨ Added Credit Roll Animation untuk Rekap Acara Live - Animasi teks berjalan seperti post-credit bioskop dengan kontrol Play/Pause dan Restart
- 🏗️ Improved code organization and structure
- 🎨 Enhanced UI/UX with loading states
- 🛡️ Better error handling and user feedback
- 📋 Added FEATURES.md for feature tracking
- 📦 Added storage bucket setup untuk dokumen notulen di database_schema.sql

### Version 1.0
- 🎉 Initial release
- Basic attendance management features
- Admin dashboard and event management
- Real-time updates

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Hakiem** - [@hakiem17](https://github.com/hakiem17)

## 🙏 Acknowledgments

- **Diskominfo Hulu Sungai Tengah** - Instansi pengguna
- **Supabase** - Backend infrastructure
- **Bootstrap** - UI framework
- **Chart.js** - Data visualization
- **Signature Pad** - Digital signature

## 📞 Support

Jika mengalami masalah atau membutuhkan bantuan:

- 📧 Email: [diskominfo@hstkab.go.id](mailto:diskominfo@hstkab.go.id)
- 🌐 Website: [diskominfo.hstkab.go.id](https://diskominfo.hstkab.go.id)
- 📱 Phone: (0517) 3791750

---

<div align="center">
  <p><strong>Dikembangkan dengan ❤️ untuk Pemerintah Kabupaten Hulu Sungai Tengah</strong></p>
  <p>© 2025 Diskominfo Hulu Sungai Tengah. All Rights Reserved.</p>
</div>