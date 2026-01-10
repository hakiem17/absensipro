-- ============================================
-- SCRIPT SEDERHANA: Menambah Admin Baru
-- ============================================
-- 
-- CARA PENGGUNAAN:
-- 1. Buat user di Supabase Dashboard > Authentication > Users > Add User
--    - Masukkan email (contoh: admin2@hakim.com)
--    - Masukkan password
--    - Setelah user dibuat, catat user_id-nya
--
-- 2. Jalankan query di bawah ini dengan mengganti:
--    - 'USER_ID_DARI_AUTH' dengan user_id yang didapat dari langkah 1
--    - 'username_admin' dengan username untuk login (bisa sama dengan email)
--    - 'Nama Admin' dengan nama tampilan admin
--
-- 3. Selesai! Admin baru bisa login dengan username dan password yang dibuat

-- ============================================
-- QUERY INSERT ADMIN (EDIT NILAI-NILAI INI)
-- ============================================

INSERT INTO admin_profiles (user_id, username, display_name)
VALUES (
  'USER_ID_DARI_AUTH',        -- GANTI: user_id dari auth.users
  'username_admin',            -- GANTI: username untuk login
  'Nama Admin'                 -- GANTI: nama tampilan
);

-- ============================================
-- CONTOH PENGGUNAAN:
-- ============================================
-- Jika user_id = 'ab7a868e-6eed-47ce-abf0-ed9641234567'
-- Username = 'admin2@hakim.com'
-- Display Name = 'Administrator 2'
--
-- Maka query menjadi:
--
-- INSERT INTO admin_profiles (user_id, username, display_name)
-- VALUES (
--   'ab7a868e-6eed-47ce-abf0-ed9641234567',
--   'admin2@hakim.com',
--   'Administrator 2'
-- );

-- ============================================
-- CARA MENDAPATKAN USER_ID:
-- ============================================
-- Setelah membuat user di Authentication, jalankan query ini:
-- 
-- SELECT id, email, created_at 
-- FROM auth.users 
-- WHERE email = 'email_admin_baru@hakim.com';
--
-- Copy id yang muncul, itu adalah user_id yang digunakan di INSERT

-- ============================================
-- VERIFIKASI ADMIN BARU:
-- ============================================
-- Jalankan query ini untuk melihat semua admin:

SELECT 
  ap.username,
  ap.display_name,
  au.email,
  ap.created_at
FROM admin_profiles ap
JOIN auth.users au ON ap.user_id = au.id
ORDER BY ap.created_at DESC;

