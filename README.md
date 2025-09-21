# AbsensiPro 📋

**Sistem Manajemen Kehadiran Digital untuk Pemerintah Kabupaten Hulu Sungai Tengah**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/hakiem17/absensipro)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

## 🎯 Tentang Aplikasi

AbsensiPro adalah sistem manajemen kehadiran digital yang dirancang khusus untuk meningkatkan efisiensi dan akurasi data kehadiran dalam setiap acara di lingkungan Pemerintah Kabupaten Hulu Sungai Tengah. Aplikasi ini menyediakan solusi modern untuk menggantikan sistem absensi manual tradisional.

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
- 👥 **Daftar Hadir** - Pencarian, filter, dan pagination
- 📺 **Rekap Live** - Animasi credit roll untuk tampilan real-time
- 📄 **Export & Print** - Export CSV dan cetak laporan dengan kop surat resmi
- 🔗 **QR Code Generator** - Generate QR code untuk akses form
- ⚡ **Real-time Updates** - Update kehadiran secara live

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
- **Supabase Storage** - Penyimpanan file tanda tangan

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
├── 👥 admin-daftar-hadir.html       # Daftar hadir peserta
├── 📺 admin-rekap-acara.html        # Rekap live dengan animasi
├── 📁 assets/
│   ├── 📁 js/
│   │   ├── config.js               # Konfigurasi Supabase
│   │   ├── auth.js                 # Sistem autentikasi
│   │   └── absensipro.js           # API wrapper utama
│   └── 📁 img/
│       └── logo_hst.png            # Logo resmi HST
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
   ```sql
   -- Tabel events
   CREATE TABLE events (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     datetime TIMESTAMPTZ NOT NULL,
     location TEXT,
     status TEXT DEFAULT 'upcoming',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Tabel attendees
   CREATE TABLE attendees (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     event_id UUID REFERENCES events(id),
     name TEXT NOT NULL,
     instansi TEXT,
     jabatan TEXT,
     email TEXT,
     phone TEXT,
     gender TEXT,
     signature_url TEXT,
     ts TIMESTAMPTZ DEFAULT NOW()
   );
   ```

## 🔧 Konfigurasi

### **Supabase Setup**
1. Buat project baru di Supabase Dashboard
2. Update `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `assets/js/config.js`
3. Setup authentication untuk admin
4. Konfigurasi storage bucket untuk tanda tangan

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
4. Export data atau cetak laporan
5. Generate QR code untuk akses form

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

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

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