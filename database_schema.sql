-- =====================================================
-- AbsensiPro Database Schema v2.0
-- Sistem Manajemen Kehadiran Digital
-- Pemerintah Kabupaten Hulu Sungai Tengah
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: events
-- Tabel untuk menyimpan data acara/event
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    datetime TIMESTAMPTZ NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'done', 'cancelled')),
    minutes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for events
CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(datetime DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- =====================================================
-- TABLE: attendees
-- Tabel untuk menyimpan data peserta/kehadiran
-- =====================================================
CREATE TABLE IF NOT EXISTS attendees (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    instansi TEXT,
    jabatan TEXT,
    email TEXT,
    phone TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', NULL)),
    signature_url TEXT,
    ts TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for attendees
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_ts ON attendees(ts ASC);
CREATE INDEX IF NOT EXISTS idx_attendees_name ON attendees(name);
CREATE INDEX IF NOT EXISTS idx_attendees_instansi ON attendees(instansi);
CREATE INDEX IF NOT EXISTS idx_attendees_created_at ON attendees(created_at DESC);

-- =====================================================
-- TABLE: master_tanda_tangan
-- Tabel untuk menyimpan data master penandatangan
-- =====================================================
CREATE TABLE IF NOT EXISTS master_tanda_tangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    instansi VARCHAR(255) NOT NULL,
    golongan VARCHAR(100),
    nip VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for master_tanda_tangan
CREATE INDEX IF NOT EXISTS idx_master_ttd_nama ON master_tanda_tangan(nama);
CREATE INDEX IF NOT EXISTS idx_master_ttd_updated_at ON master_tanda_tangan(updated_at DESC);

-- =====================================================
-- TABLE: notulen_acara
-- Tabel untuk menyimpan notulen rapat/acara
-- =====================================================
CREATE TABLE IF NOT EXISTS notulen_acara (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sidang_rapat TEXT,
    hari_tanggal DATE,
    surat_undangan TEXT,
    waktu_sidang_rapat TIME,
    acara JSONB,
    ketua TEXT,
    sekretaris TEXT,
    pencatat TEXT,
    peserta JSONB,
    kegiatan_sidang_rapat TEXT,
    nama_jabatan TEXT,
    nama_penandatangan TEXT,
    pangkat_golongan TEXT,
    nip TEXT,
    foto JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notulen_acara
CREATE INDEX IF NOT EXISTS idx_notulen_event_id ON notulen_acara(event_id);
CREATE INDEX IF NOT EXISTS idx_notulen_hari_tanggal ON notulen_acara(hari_tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_notulen_created_at ON notulen_acara(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notulen_acara_jsonb ON notulen_acara USING GIN(acara);
CREATE INDEX IF NOT EXISTS idx_notulen_peserta_jsonb ON notulen_acara USING GIN(peserta);
CREATE INDEX IF NOT EXISTS idx_notulen_foto_jsonb ON notulen_acara USING GIN(foto);

-- =====================================================
-- TABLE: admin_profiles
-- Tabel untuk menyimpan profil admin
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users(id) from Supabase Auth
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for admin_profiles
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_username ON admin_profiles(username);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_created_at ON admin_profiles(created_at DESC);

-- =====================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-update updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_ttd_updated_at
    BEFORE UPDATE ON master_tanda_tangan
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notulen_updated_at
    BEFORE UPDATE ON notulen_acara
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_tanda_tangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE notulen_acara ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for events table
-- Allow public read access
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Events are manageable by authenticated users"
    ON events FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for attendees table
-- Allow public read access
CREATE POLICY "Attendees are viewable by everyone"
    ON attendees FOR SELECT
    USING (true);

-- Allow public insert (for form submission)
CREATE POLICY "Anyone can insert attendees"
    ON attendees FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to update/delete
CREATE POLICY "Attendees are manageable by authenticated users"
    ON attendees FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for master_tanda_tangan table
-- Allow public read access
CREATE POLICY "Master TTD is viewable by everyone"
    ON master_tanda_tangan FOR SELECT
    USING (true);

-- Allow authenticated users to manage
CREATE POLICY "Master TTD is manageable by authenticated users"
    ON master_tanda_tangan FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for notulen_acara table
-- Allow public read access
CREATE POLICY "Notulen are viewable by everyone"
    ON notulen_acara FOR SELECT
    USING (true);

-- Allow authenticated users to manage
CREATE POLICY "Notulen are manageable by authenticated users"
    ON notulen_acara FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for admin_profiles table
-- Only authenticated users can view
CREATE POLICY "Admin profiles are viewable by authenticated users"
    ON admin_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only authenticated users can manage
CREATE POLICY "Admin profiles are manageable by authenticated users"
    ON admin_profiles FOR ALL
    USING (auth.role() = 'authenticated');

-- =====================================================
-- VIEWS: Useful views for reporting
-- =====================================================

-- View: Event with attendee count
CREATE OR REPLACE VIEW v_events_with_count AS
SELECT 
    e.*,
    COUNT(a.id) as attendee_count
FROM events e
LEFT JOIN attendees a ON e.id = a.event_id
GROUP BY e.id;

-- View: Recent attendees
CREATE OR REPLACE VIEW v_recent_attendees AS
SELECT 
    a.*,
    e.title as event_title,
    e.datetime as event_datetime,
    e.location as event_location
FROM attendees a
JOIN events e ON a.event_id = e.id
ORDER BY a.ts DESC
LIMIT 100;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment below to insert sample data for testing

/*
-- Sample event
INSERT INTO events (title, datetime, location, status) VALUES
('Rapat Koordinasi Bulanan', NOW() + INTERVAL '1 day', 'Aula Diskominfo HST', 'upcoming');

-- Sample master tanda tangan
INSERT INTO master_tanda_tangan (nama, jabatan, instansi, golongan, nip) VALUES
('Darkuni, S.Hut', 'Kepala Dinas Komunikasi, Informatika, Statistik dan Persandian', 'Diskominfo HST', 'Pembina Tk.l', '19730131 200501 1 007');
*/

-- =====================================================
-- COMMENTS: Documentation
-- =====================================================

COMMENT ON TABLE events IS 'Tabel untuk menyimpan data acara/event';
COMMENT ON TABLE attendees IS 'Tabel untuk menyimpan data peserta/kehadiran';
COMMENT ON TABLE master_tanda_tangan IS 'Tabel untuk menyimpan data master penandatangan';
COMMENT ON TABLE notulen_acara IS 'Tabel untuk menyimpan notulen rapat/acara';
COMMENT ON TABLE admin_profiles IS 'Tabel untuk menyimpan profil admin';

COMMENT ON COLUMN events.status IS 'Status acara: upcoming, ongoing, done, cancelled';
COMMENT ON COLUMN attendees.gender IS 'Jenis kelamin: male, female, atau NULL';
COMMENT ON COLUMN notulen_acara.acara IS 'JSON array berisi daftar acara';
COMMENT ON COLUMN notulen_acara.peserta IS 'JSON array berisi daftar peserta';
COMMENT ON COLUMN notulen_acara.foto IS 'JSON array berisi URL foto-foto';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
