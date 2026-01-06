-- Fix RLS Policies and Status Constraint for Events Table
-- Jalankan SQL ini di Supabase SQL Editor jika terjadi error "Gagal menyimpan" saat menambah/mengedit acara

-- 1. Fix Status Constraint (jika error: "violates check constraint events_status_check")
-- Hapus constraint lama jika ada
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;

-- Tambahkan constraint baru yang benar
ALTER TABLE events ADD CONSTRAINT events_status_check 
  CHECK (status IN ('upcoming', 'active', 'done'));

-- Set default value jika belum ada
ALTER TABLE events ALTER COLUMN status SET DEFAULT 'upcoming';

-- 2. Fix RLS Policies untuk INSERT, UPDATE, DELETE
-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
DROP POLICY IF EXISTS "Anyone can update events" ON events;
DROP POLICY IF EXISTS "Anyone can delete events" ON events;

-- Policy untuk INSERT (menambah acara)
CREATE POLICY "Anyone can insert events" ON events
  FOR INSERT WITH CHECK (true);

-- Policy untuk UPDATE (mengedit acara)
CREATE POLICY "Anyone can update events" ON events
  FOR UPDATE USING (true);

-- Policy untuk DELETE (menghapus acara)
CREATE POLICY "Anyone can delete events" ON events
  FOR DELETE USING (true);

