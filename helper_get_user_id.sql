-- ============================================
-- HELPER: Mencari User ID dari Email
-- ============================================
-- Gunakan query ini untuk mendapatkan user_id setelah membuat user di Authentication
-- 
-- CARA PENGGUNAAN:
-- 1. Ganti 'email_admin@hakim.com' dengan email admin yang baru dibuat
-- 2. Jalankan query
-- 3. Copy user_id (kolom id) yang muncul
-- 4. Gunakan user_id tersebut di script add_admin_simple.sql

-- ============================================
-- QUERY: Cari User ID dari Email
-- ============================================

SELECT 
  id as user_id,           -- Ini yang digunakan di INSERT admin_profiles
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'email_admin@hakim.com';  -- GANTI dengan email admin baru

-- ============================================
-- CONTOH: Mencari semua user yang ada
-- ============================================
-- Jika ingin melihat semua user di sistem:

SELECT 
  id as user_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- CONTOH: Mencari user yang belum jadi admin
-- ============================================
-- Query ini menampilkan user yang ada di auth.users 
-- tapi belum ada di admin_profiles:

SELECT 
  au.id as user_id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN admin_profiles ap ON au.id = ap.user_id
WHERE ap.id IS NULL
ORDER BY au.created_at DESC;

