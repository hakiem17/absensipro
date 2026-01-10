# Cara Menambahkan Admin Baru

## Metode 1: Menggunakan Form di Halaman "Tambah User" (Disarankan)

1. **Login sebagai admin** di aplikasi AbsensiPro
2. **Buka halaman "Tambah User"** dari sidebar (hanya terlihat untuk admin)
3. **Isi form dengan data berikut:**
   - **Email**: Email yang akan digunakan untuk login (contoh: `admin2@hakim.com`)
   - **Password**: Password untuk login (minimal 6 karakter)
   - **Username**: Username untuk login (bisa sama dengan email atau berbeda, contoh: `admin2`)
   - **Nama Tampilan**: Nama yang akan ditampilkan di sistem (contoh: `Administrator 2`)
4. **Klik tombol "Tambah Admin"**
5. **Selesai!** Admin baru dapat langsung login dengan email dan password yang dibuat

### Catatan Penting:
- Form ini akan **otomatis membuat user baru** di Supabase Auth dengan password yang Anda masukkan
- Jika email sudah terdaftar, sistem akan menambahkan user tersebut ke admin_profiles (jika belum menjadi admin)
- Username harus unik (tidak boleh sama dengan username admin lain)
- Password minimal 6 karakter

## Metode 2: Manual melalui Supabase Dashboard (Alternatif)

Jika Anda ingin membuat user secara manual:

1. **Buka Supabase Dashboard** > Authentication > Users
2. **Klik "Add User"** atau "Create User"
3. **Isi data user:**
   - Email: (contoh: `admin2@hakim.com`)
   - Password: (password yang aman)
   - Auto Confirm User: **Centang** (agar user langsung bisa login)
4. **Klik "Create User"**
5. **Catat user_id** dari user yang baru dibuat
6. **Buka Supabase SQL Editor** dan jalankan query berikut:

```sql
INSERT INTO admin_profiles (user_id, username, display_name)
VALUES (
  'USER_ID_DARI_AUTH',        -- Ganti dengan user_id dari langkah 5
  'username_admin',           -- Ganti dengan username untuk login
  'Nama Admin'                -- Ganti dengan nama tampilan
);
```

### Contoh:
```sql
INSERT INTO admin_profiles (user_id, username, display_name)
VALUES (
  'ab7a868e-6eed-47ce-abf0-ed9641234567',
  'admin2@hakim.com',
  'Administrator 2'
);
```

## Metode 3: Menggunakan RPC Function (Advanced)

Jika Anda sudah membuat RPC function `create_admin_user_with_password`, Anda dapat menggunakan SQL Editor:

```sql
SELECT create_admin_user_with_password(
  'admin2@hakim.com',    -- Email
  'Password123!',         -- Password
  'admin2',              -- Username
  'Administrator 2'      -- Display Name
);
```

**Catatan:** RPC function ini perlu dibuat terlebih dahulu di Supabase SQL Editor menggunakan file `create_admin_user_with_password.sql`

## Verifikasi Admin Baru

Setelah menambahkan admin, verifikasi dengan:

1. **Login dengan email dan password** yang dibuat
2. **Cek di halaman "Tambah User"** apakah admin baru muncul di daftar
3. **Pastikan menu "Tambah User"** terlihat di sidebar (hanya untuk admin)

## Troubleshooting

### Error: "Email sudah terdaftar"
- Email tersebut sudah ada di Supabase Auth
- Gunakan email lain atau tambahkan user yang sudah ada ke admin_profiles menggunakan Metode 2

### Error: "Username sudah digunakan"
- Username tersebut sudah digunakan oleh admin lain
- Gunakan username yang berbeda

### Error: "Password minimal 6 karakter"
- Password yang dimasukkan kurang dari 6 karakter
- Gunakan password yang lebih panjang

### Error: "Gagal membuat user"
- Pastikan koneksi internet stabil
- Pastikan Supabase project masih aktif
- Coba refresh halaman dan ulangi

## Keamanan

- **Jangan bagikan password** admin ke orang yang tidak berwenang
- **Gunakan password yang kuat** (minimal 8 karakter, kombinasi huruf, angka, dan simbol)
- **Hanya admin yang bisa menambahkan admin baru** (akses halaman "Tambah User" dibatasi)

