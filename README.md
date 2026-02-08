# AbsensiPro 📋

**Sistem Manajemen Kehadiran Digital untuk Dinas Komunikasi, Informatika, Statistik, dan Persandian Kabupaten Hulu Sungai Tengah**

Sistem absensi digital dengan form kehadiran, daftar hadir, notulen, print daftar hadir, dan **konfirmasi otomatis ke WhatsApp** peserta setelah submit absen.

[![Version](https://img.shields.io/badge/version-2.1-blue?style=flat-square)](https://github.com/hakiem17/absensipro/releases)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/hakiem17/absensipro)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

## 🎯 Tentang Aplikasi

AbsensiPro adalah sistem manajemen kehadiran digital yang dirancang khusus untuk meningkatkan efisiensi dan akurasi data kehadiran dalam setiap acara di lingkungan Pemerintah Kabupaten Hulu Sungai Tengah. Aplikasi ini menyediakan solusi modern untuk menggantikan sistem absensi manual tradisional.

## 🆕 Versi 2.1 - What's New (Terbaru)

**Versi 2.1** menambah notifikasi WhatsApp dan halaman publik daftar hadir:

### ✨ **Fitur Baru**
- 📱 **Notifikasi WhatsApp** - Konfirmasi absen otomatis dikirim ke nomor HP peserta via Fonnte setelah submit (Supabase Edge Function `send-wa`)
- 📄 **Daftar Hadir Publik** - Halaman `daftar-hadir-publik.html`: logo, teks rata tengah (Terima Kasih, judul acara, partisipan), dan tabel daftar hadir; tanpa login; link dikirim di pesan WA
- 🚀 **Deploy cPanel** - Konfigurasi `.cpanel.yml` untuk auto-deploy (push to cPanel repo → deploy ke production)

### 📌 **Versi 2.0** (sebelumnya)
- 📝 Admin Notulen Acara, 🖨️ Print Daftar Hadir, ✍️ Master Tanda Tangan
- 🐛 Perbaikan bug admin daftar hadir, loading states, error handling
- 🏗️ Struktur kode: `admin-common.js`, `admin-dashboard.js`, assets

## ✨ Fitur Utama

### 👥 **Untuk Peserta**
- 🎯 **Pilih Acara** - Akses mudah ke daftar acara yang tersedia
- 📝 **Form Kehadiran Digital** - Isi data kehadiran secara online
- 📱 **Konfirmasi WhatsApp** - Notifikasi konfirmasi absen dikirim ke nomor HP setelah submit (via Fonnte)
- 📄 **Daftar Hadir Publik** - Halaman dengan logo, teks rata tengah, dan daftar peserta (link di pesan WA)
- ✍️ **Tanda Tangan Digital** - Fitur signature pad untuk tanda tangan
- 📱 **Responsive Design** - Optimal di semua perangkat (mobile, tablet, desktop)

### 🔧 **Untuk Admin**
- 📊 **Dashboard Analytics** - Statistik lengkap dengan Chart.js
- 📅 **Manajemen Acara** - CRUD lengkap untuk pengelolaan acara
- 👥 **Daftar Hadir** - Pencarian, filter, dan pagination dengan loading states
- 📺 **Rekap Live** - Animasi credit roll (post-credit style) untuk tampilan real-time dengan kontrol Play/Pause dan Restart
- 📄 **Export & Print** - Export CSV dan cetak laporan dengan kop surat resmi
- 🖨️ **Print Daftar Hadir** - Cetak daftar hadir dengan format profesional
- 📝 **Notulen Acara** - Upload dan kelola dokumen notulen (Word/PDF) untuk setiap acara
- ✍️ **Master Tanda Tangan** - Pengelolaan data master penandatangan
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
- **Supabase Edge Functions** - `send-wa` untuk kirim notifikasi WhatsApp (Fonnte API)
- **PostgreSQL** - Database relasional
- **Real-time Subscriptions** - Update data secara live
- **Supabase Storage** - Penyimpanan file:
  - **Bucket `signatures`** - Tanda tangan digital peserta
  - **Bucket `notulen`** - Dokumen notulen (Word/PDF)

### **Integrasi**
- **Fonnte** - Gateway WhatsApp untuk kirim konfirmasi ke peserta

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
├── 📝 form-kehadiran.html           # Form isi kehadiran (+ trigger notif WA)
├── 📄 daftar-hadir-publik.html      # Daftar hadir publik (logo, teks rata tengah, tabel peserta)
├── 🔐 login.html                    # Login admin
├── 📊 admin-dashboard.html           # Dashboard statistik
├── 📅 admin-manajemen-acara.html    # CRUD acara
├── 👥 admin-daftar-hadir.html       # Daftar hadir peserta (improved in v2.0)
├── 📺 admin-rekap-acara.html        # Rekap live dengan animasi
├── 📝 admin-notulen-acara.html      # Upload & kelola dokumen notulen Word/PDF
├── 🖨️ admin-print-daftar-hadir.html # Print daftar hadir
├── 📁 assets/
│   ├── 📁 js/
│   │   ├── config.js               # Konfigurasi Supabase
│   │   ├── auth.js                 # Sistem autentikasi
│   │   ├── admin-common.js         # Shared admin functions
│   │   └── admin-dashboard.js      # Dashboard logic
│   ├── 📁 css/
│   │   └── admin.css               # Admin styling
│   ├── 📁 font/
│   │   └── arial/                  # Font assets
│   └── 📁 img/
│       └── logo_hst.png            # Logo resmi HST
├── 📄 Template Surat.pdf            # Template untuk print
├── 📄 FEATURES.md                   # Feature tracking & roadmap
├── 📄 database_schema.sql           # Database schema lengkap
├── 📄 .cpanel.yml                   # Deploy cPanel (auto-deploy on push)
├── 📁 .github/workflows/            # GitHub Actions (e.g. deploy.yml untuk GitHub Pages)
├── 📁 supabase/functions/send-wa/   # Edge Function: kirim WA via Fonnte
├── 📄 README.md                     # Dokumentasi
├── 📄 UPGRADE_RECOMMENDATIONS.md    # Rekomendasi upgrade & roadmap
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
   - **cPanel (Git Version Control):** Push ke repo cPanel; file `.cpanel.yml` menjalankan deploy otomatis ke folder production.
   - **GitHub Pages:** Workflow `.github/workflows/deploy.yml` bisa dipakai untuk deploy ke branch `gh-pages` (atur Source di Settings → Pages).
   - **Manual:** Upload semua file (HTML, folder `assets/`) ke web server; pastikan dapat diakses via HTTP/HTTPS.

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

### **Notifikasi WhatsApp (Opsional)**
Agar konfirmasi absen dikirim ke nomor WhatsApp peserta setelah submit:

1. **Daftar Fonnte** – Buat akun di [Fonnte](https://fonnte.com), buat device, dan dapatkan **Token API**.
2. **Deploy Edge Function** – Di folder project:
   ```bash
   npx supabase functions deploy send-wa
   ```
3. **Set secret token** – Di Supabase Dashboard → Edge Functions → send-wa → Secrets, atau via CLI:
   ```bash
   npx supabase secrets set FONNTE_TOKEN=your_fonnte_token
   ```
4. Peserta mengisi **No. Handphone** di form kehadiran; setelah submit, konfirmasi otomatis dikirim ke WhatsApp nomor tersebut.

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

Jika Anda menggunakan versi 1.0 atau 2.0, berikut langkah upgrade ke v2.1:

1. **Backup Data**
   ```bash
   # Backup database dan file penting
   ```

2. **Update Files**
   ```bash
   git pull origin main
   ```

3. **Update Database Schema** (jika dari v1.0)
   - Import `database_schema.sql` untuk tabel notulen, master tanda tangan, dll.

4. **Notifikasi WhatsApp (opsional)**
   - Deploy Edge Function `send-wa` dan set `FONNTE_TOKEN` (lihat bagian Konfigurasi).

5. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

6. **Test**
   - Form kehadiran + nomor HP → cek konfirmasi WA
   - Buka link daftar hadir publik dari pesan WA

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

**Note:** Untuk kontribusi ke versi 2.1+, pastikan mengikuti struktur kode dan konfigurasi yang ada.

## 📦 Release History

### Version 2.1 (Current) - 2026-02-08
- 📱 Notifikasi WhatsApp: konfirmasi absen ke nomor HP peserta via Fonnte (Edge Function `send-wa`)
- 📄 Daftar Hadir Publik: logo, teks rata tengah (Terima Kasih, judul acara, partisipan), tabel peserta; link di pesan WA
- 🚀 `.cpanel.yml` untuk deploy cPanel (auto-deploy on push)
- 🔧 CORS & header (`apikey`, `x-client-info`) untuk invoke Edge Function dari browser
- 📝 Nama instansi lengkap: Dinas Komunikasi, Informatika, Statistik, dan Persandian Kab. HST
- 📋 README & UPGRADE_RECOMMENDATIONS diperbarui

### Version 2.0 - 2025-01-27
- 🐛 Fixed: Admin daftar hadir event loading
- ✨ Admin Notulen Acara, Print Daftar Hadir, Master Tanda Tangan
- ✨ Edit & Delete daftar hadir, Credit Roll Rekap Acara
- 🏗️ Struktur kode, loading states, error handling
- 📋 FEATURES.md, database_schema.sql

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

- **Dinas Komunikasi, Informatika, Statistik, dan Persandian Kabupaten Hulu Sungai Tengah** - Instansi pengguna
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
  <p>© 2026 Dinas Komunikasi, Informatika, Statistik, dan Persandian Kab. Hulu Sungai Tengah. All Rights Reserved.</p>
</div>