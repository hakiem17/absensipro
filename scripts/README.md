# Panduan Otomatisasi Supabase & Anti-Pause (Keep-Alive)
**AbsensiPro - Pemerintah Kabupaten Hulu Sungai Tengah**

---

## 💡 Mengapa Supabase Meminta Restore?
Pada **Supabase Free Tier (Paket Gratis)**, Supabase memiliki kebijakan otomatis:
> **Jika database tidak menerima aktivitas/request selama 7 hari berturut-turut, proyek akan di-PAUSE secara otomatis.**

Ketika proyek di-pause:
1. AbsensiPro tidak bisa memuat agenda atau presensi peserta.
2. Anda terpaksa membuka dashboard Supabase dan mengklik tombol **"Restore Project"**, yang memakan waktu beberapa menit.
3. Jika dibiarkan terlalu lama, database bisa dinonaktifkan permanen dan Anda harus me-restore ulang data dari file backup.

---

## 🚀 Solusi yang Telah Diterapkan

### 1. Otomatis 24/7 di Cloud: GitHub Actions Keep-Alive (Rekomendasi Utama)
File workflow: [`.github/workflows/supabase-keepalive.yml`](../.github/workflows/supabase-keepalive.yml)
- **Cara Kerja**: GitHub Actions akan otomatis melakukan ping (query ringan) ke Supabase **setiap 3 hari sekali** pada pukul 08:00 WITA.
- **Kelebihan**: 
  - Berjalan di server cloud GitHub secara gratis.
  - **Laptop/komputer Anda TIDAK PERLU menyala**.
  - Supabase melihat ada aktivitas rutin sehingga status database **SELALU AKTIF** dan **TIDAK PERNAH DI-PAUSE LAGI**.
  - Anda tidak perlu lagi repot klik "Restore" di Supabase!

Untuk memicu ping secara manual kapan saja:
1. Buka repository AbsensiPro di GitHub.
2. Klik tab **Actions**.
3. Pilih workflow **Supabase Keep-Alive (Anti-Pause)** di sebelah kiri.
4. Klik tombol **Run workflow**.

---

### 2. Script Lokal Manual / Cron Laptop

Jika ingin menjalankan ping atau backup langsung dari komputer Anda:

#### A. Keep-Alive (Ping Supabase Sekali Jalan)
```bash
node scripts/keepalive.js
# atau menggunakan shell script
bash scripts/keepalive.sh
```

#### B. Backup Otomatis ke File JSON
Mengunduh seluruh data (acara, peserta, master tanda tangan, dan notulen) langsung ke folder `backups/`:
```bash
node scripts/backup-db.js
```
*File hasil backup akan tersimpan rapi di folder `backups/absensipro-backup-YYYY-MM-DD-HHmmss.json`.*

#### C. Restore Otomatis Sekali Perintah
Jika suatu saat database kosong atau ingin dipulihkan tanpa harus buka browser dan klik upload:
```bash
# Memulihkan dari file backup terbaru di folder backups/
node scripts/restore-db.js

# Atau tentukan file tertentu
node scripts/restore-db.js backups/nama-file-backup.json
```
Script ini otomatis menangani urutan relasi data (*Foreign Key*) mulai dari Events, Master TTD, Attendees (dalam batch 100 baris agar tidak timeout), hingga Notulen Acara.

---

## 🛠️ Ringkasan File Baru
| File | Fungsi |
|---|---|
| [`.github/workflows/supabase-keepalive.yml`](../.github/workflows/supabase-keepalive.yml) | Otomatis ping Supabase setiap 3 hari via cloud GitHub Actions (Anti-Pause) |
| [`scripts/keepalive.js`](./keepalive.js) | Ping Supabase dari terminal Node.js |
| [`scripts/keepalive.sh`](./keepalive.sh) | Ping Supabase via Shell Script (curl) |
| [`scripts/backup-db.js`](./backup-db.js) | Tarik backup database ke file JSON |
| [`scripts/restore-db.js`](./restore-db.js) | Pulihkan database dari file backup tanpa repot lewat browser |
