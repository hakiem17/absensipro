-- ============================================
-- RPC Functions untuk Manajemen User dan Admin
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- 
-- Fungsi-fungsi ini membantu proses menambah user dan admin
-- melalui aplikasi web

-- ============================================
-- 1. Fungsi untuk mendapatkan user_id dari email
-- ============================================
-- Fungsi ini membantu mendapatkan user_id dari email
-- untuk digunakan saat menambahkan ke admin_profiles

CREATE OR REPLACE FUNCTION get_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  RETURN v_user_id;
END;
$$;

-- ============================================
-- 2. Fungsi untuk menambahkan admin dari email
-- ============================================
-- Fungsi ini menambahkan user ke admin_profiles
-- berdasarkan email yang sudah ada di auth.users

CREATE OR REPLACE FUNCTION add_admin_by_email(
  p_email TEXT,
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
  v_result JSON;
BEGIN
  -- Cek apakah user ada di auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User dengan email tersebut tidak ditemukan di auth.users. Pastikan user sudah dibuat di Supabase Dashboard > Authentication > Users.'
    );
  END IF;
  
  -- Cek apakah sudah ada di admin_profiles
  IF EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = v_user_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User ini sudah terdaftar sebagai admin.'
    );
  END IF;
  
  -- Cek apakah username sudah digunakan
  IF EXISTS (SELECT 1 FROM admin_profiles WHERE username = p_username) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Username sudah digunakan. Pilih username lain.'
    );
  END IF;
  
  -- Insert ke admin_profiles
  INSERT INTO admin_profiles (user_id, username, display_name)
  VALUES (v_user_id, p_username, p_display_name)
  RETURNING id INTO v_admin_id;
  
  RETURN json_build_object(
    'success', true,
    'admin_id', v_admin_id,
    'user_id', v_user_id,
    'message', 'Admin berhasil ditambahkan.'
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
-- 3. Fungsi untuk mendapatkan daftar semua user (untuk admin)
-- ============================================
-- Fungsi ini mengembalikan daftar user yang ada di auth.users
-- Hanya bisa diakses oleh admin

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  is_admin BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Cek apakah user yang memanggil adalah admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Hanya admin yang bisa mengakses fungsi ini';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    au.created_at,
    EXISTS(SELECT 1 FROM admin_profiles ap WHERE ap.user_id = au.id) as is_admin
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;

-- ============================================
-- 4. Fungsi untuk menghapus admin (untuk admin)
-- ============================================
-- Fungsi ini menghapus user dari admin_profiles
-- Hanya bisa diakses oleh admin

CREATE OR REPLACE FUNCTION remove_admin(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Cek apakah user yang memanggil adalah admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Hanya admin yang bisa menghapus admin lain.'
    );
  END IF;
  
  -- Cek apakah user ada di admin_profiles
  IF NOT EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = p_user_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User tidak ditemukan di admin_profiles.'
    );
  END IF;
  
  -- Hapus dari admin_profiles
  DELETE FROM admin_profiles WHERE user_id = p_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Admin berhasil dihapus.'
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
-- 1. get_user_id_by_email(email)
--    - Mengembalikan user_id dari email
--    - Contoh: SELECT get_user_id_by_email('admin@hakim.com');
--
-- 2. add_admin_by_email(email, username, display_name)
--    - Menambahkan user ke admin_profiles
--    - User harus sudah ada di auth.users
--    - Contoh: SELECT add_admin_by_email('admin@hakim.com', 'admin', 'Administrator');
--
-- 3. get_all_users()
--    - Mengembalikan daftar semua user
--    - Hanya bisa dipanggil oleh admin
--    - Contoh: SELECT * FROM get_all_users();
--
-- 4. remove_admin(user_id)
--    - Menghapus user dari admin_profiles
--    - Hanya bisa dipanggil oleh admin
--    - Contoh: SELECT remove_admin('user-uuid-here');

