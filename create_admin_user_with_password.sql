-- ============================================
-- Fungsi untuk Membuat Admin User Baru dengan Password
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- 
-- Fungsi ini membuat user baru di auth.users dengan password,
-- lalu menambahkan ke admin_profiles
-- 
-- CATATAN: Fungsi ini memerlukan extension pgcrypto untuk hash password

-- Pastikan extension pgcrypto sudah diinstall
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Fungsi untuk membuat admin user baru dengan password
-- ============================================
CREATE OR REPLACE FUNCTION create_admin_user_with_password(
  p_email TEXT,
  p_password TEXT,
  p_username TEXT,
  p_display_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_admin_id UUID;
  v_encrypted_password TEXT;
  v_result JSON;
BEGIN
  -- Validasi input
  IF p_email IS NULL OR p_email = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email tidak boleh kosong.'
    );
  END IF;

  IF p_password IS NULL OR p_password = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Password tidak boleh kosong.'
    );
  END IF;

  IF length(p_password) < 6 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Password minimal 6 karakter.'
    );
  END IF;

  IF p_username IS NULL OR p_username = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Username tidak boleh kosong.'
    );
  END IF;

  IF p_display_name IS NULL OR p_display_name = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Nama tampilan tidak boleh kosong.'
    );
  END IF;

  -- Cek apakah email sudah ada di auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email sudah terdaftar. Gunakan email lain atau gunakan fungsi add_admin_by_email jika user sudah ada.'
    );
  END IF;
  
  -- Cek apakah username sudah digunakan di admin_profiles
  IF EXISTS (SELECT 1 FROM admin_profiles WHERE username = p_username) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Username sudah digunakan. Pilih username lain.'
    );
  END IF;
  
  -- Hash password menggunakan crypt (bcrypt)
  -- Supabase menggunakan format khusus untuk password hash
  -- Kita perlu menggunakan auth.crypt() atau membuat hash manual
  -- Untuk Supabase, kita akan menggunakan extension pgcrypto dengan format bcrypt
  v_encrypted_password := crypt(p_password, gen_salt('bf', 10));
  
  -- Insert user baru ke auth.users
  -- CATATAN: Ini memerlukan akses langsung ke auth schema
  -- Supabase menggunakan format khusus untuk auth.users
  -- Kita akan menggunakan auth.uid() dan auth.users table
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    v_encrypted_password,
    now(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO v_user_id;
  
  -- Insert ke admin_profiles
  INSERT INTO admin_profiles (user_id, username, display_name)
  VALUES (v_user_id, p_username, p_display_name)
  RETURNING id INTO v_admin_id;
  
  RETURN json_build_object(
    'success', true,
    'admin_id', v_admin_id,
    'user_id', v_user_id,
    'email', p_email,
    'username', p_username,
    'message', 'Admin user berhasil dibuat dengan password.'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- ============================================
-- CATATAN PENGGUNAAN
-- ============================================
-- Fungsi ini membuat user baru di auth.users dengan password,
-- lalu menambahkan ke admin_profiles
--
-- Contoh penggunaan:
-- SELECT create_admin_user_with_password(
--   'admin2@hakim.com',
--   'Password123!',
--   'admin2',
--   'Administrator 2'
-- );
--
-- CATATAN PENTING:
-- 1. Fungsi ini memerlukan akses ke auth.users table
-- 2. Pastikan extension pgcrypto sudah diinstall
-- 3. Password akan di-hash menggunakan bcrypt
-- 4. User akan otomatis terkonfirmasi (email_confirmed_at di-set)
-- 5. Jika email sudah ada, fungsi akan mengembalikan error

