# File yang Tidak Terpakai

## File HTML

### ❌ admin-tambah-user.html
**Status:** Tidak terpakai
**Alasan:** 
- Menu "Tambah User" sudah dihapus dari semua sidebar halaman admin
- Tidak ada referensi/link ke file ini dari file lain
- File ini tidak bisa diakses karena tidak ada menu yang mengarah ke sini

**Rekomendasi:** Bisa dihapus atau diarsipkan jika masih diperlukan untuk referensi

---

## File SQL

### ⚠️ add_admin.sql
**Status:** Mungkin tidak terpakai
**Alasan:**
- File ini adalah script manual untuk menambah admin
- Sudah ada versi yang lebih sederhana: `add_admin_simple.sql`
- Sudah ada RPC functions di `create_user_functions.sql` yang lebih otomatis

**Rekomendasi:** Bisa dihapus jika sudah menggunakan RPC functions

### ⚠️ add_admin_simple.sql
**Status:** Mungkin tidak terpakai
**Alasan:**
- Helper script untuk menambah admin secara manual
- Jika sudah menggunakan RPC functions (`create_user_functions.sql`), file ini tidak diperlukan
- Masih berguna untuk troubleshooting atau setup manual

**Rekomendasi:** Bisa dipertahankan sebagai dokumentasi/helper, atau dihapus jika sudah pakai RPC

### ⚠️ helper_get_user_id.sql
**Status:** Mungkin tidak terpakai
**Alasan:**
- Helper script untuk mencari user_id dari email
- Fungsi ini sudah ada di `create_user_functions.sql` sebagai RPC function `get_user_id_by_email()`
- Masih berguna untuk troubleshooting

**Rekomendasi:** Bisa dipertahankan sebagai dokumentasi/helper, atau dihapus jika sudah pakai RPC

### ❓ fix_events_policy.sql
**Status:** Perlu verifikasi
**Alasan:**
- Tidak ada referensi di kode
- Mungkin sudah dijalankan dan tidak diperlukan lagi
- Atau mungkin untuk perbaikan one-time

**Rekomendasi:** Verifikasi apakah sudah dijalankan di database, jika sudah bisa dihapus

---

## File yang Masih Terpakai

### ✅ create_user_functions.sql
**Status:** Terpakai
**Alasan:** Berisi RPC functions yang digunakan di aplikasi

### ✅ create_admin_user_with_password.sql
**Status:** Terpakai
**Alasan:** Direferensikan di `admin-tambah-user.html` dan `CARA_TAMBAH_ADMIN.md`

### ✅ CARA_TAMBAH_ADMIN.md
**Status:** Terpakai (Dokumentasi)
**Alasan:** Dokumentasi cara menambah admin

### ✅ DEPLOYMENT.md
**Status:** Terpakai (Dokumentasi)
**Alasan:** Dokumentasi deployment

### ✅ README.md
**Status:** Terpakai (Dokumentasi)
**Alasan:** Dokumentasi utama project

---

## Rekomendasi Penghapusan

### ✅ File yang Sudah Dihapus:
1. **admin-tambah-user.html** - ✅ DIHAPUS (Tidak ada akses, menu sudah dihapus)
2. **add_admin.sql** - ✅ DIHAPUS (Sudah ada versi yang lebih baik)
3. **fix_events_policy.sql** - ✅ DIHAPUS (Script one-time yang sudah tidak diperlukan)

### File yang Bisa Dipertahankan (Helper/Dokumentasi):
- **add_admin_simple.sql** - Berguna untuk troubleshooting
- **helper_get_user_id.sql** - Berguna untuk troubleshooting
- **CARA_TAMBAH_ADMIN.md** - Dokumentasi masih relevan

---

## Catatan
Sebelum menghapus file, pastikan:
1. File SQL sudah dijalankan di database (jika diperlukan)
2. Tidak ada referensi tersembunyi di kode
3. File dokumentasi masih relevan untuk project
