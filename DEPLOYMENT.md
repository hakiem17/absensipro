# 🚀 Deployment Guide - AbsensiPro

## GitHub Pages Deployment

### Automatic Deployment
Repository ini sudah dikonfigurasi untuk deployment otomatis ke GitHub Pages menggunakan GitHub Actions.

### Manual Setup GitHub Pages

1. **Akses Repository Settings**
   - Buka repository di GitHub
   - Klik tab "Settings"
   - Scroll ke bagian "Pages"

2. **Konfigurasi Source**
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

3. **Custom Domain (Opsional)**
   - Tambahkan custom domain di file `CNAME`
   - Contoh: `absensipro.hstkab.go.id`

### URL Deployment
- **GitHub Pages**: `https://hakiem17.github.io/absensipro`
- **Custom Domain**: `https://absensipro.hstkab.go.id` (jika dikonfigurasi)

## Environment Setup

### Supabase Configuration
1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Update konfigurasi di `assets/js/config.js`:

```javascript
window.SUPABASE_URL = "your-supabase-project-url";
window.SUPABASE_ANON_KEY = "your-supabase-anon-key";
```

### Database Schema
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tabel events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'done')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel attendees
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instansi TEXT,
  jabatan TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  signature_url TEXT,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Policies untuk events (public read)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- Policies untuk attendees (public insert, admin full access)
CREATE POLICY "Anyone can insert attendees" ON attendees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view attendees" ON attendees
  FOR SELECT USING (true);
```

### Storage Setup
1. Buat bucket baru di Supabase Storage
2. Nama bucket: `signatures`
3. Set public access untuk bucket

## Production Checklist

### ✅ Pre-deployment
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Storage bucket configured
- [ ] Environment variables updated
- [ ] Domain DNS configured (jika custom domain)

### ✅ Post-deployment
- [ ] Test semua fitur aplikasi
- [ ] Verifikasi real-time updates
- [ ] Test export dan print functionality
- [ ] Verify mobile responsiveness
- [ ] Check security settings

## Monitoring & Maintenance

### Logs
- Monitor Supabase logs untuk error
- Check GitHub Actions untuk deployment status
- Monitor application performance

### Updates
- Update dependencies secara berkala
- Backup database secara rutin
- Monitor security updates

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Pastikan Supabase project URL benar
   - Check domain whitelist di Supabase

2. **Authentication Issues**
   - Verify admin credentials
   - Check RLS policies

3. **File Upload Issues**
   - Verify storage bucket permissions
   - Check file size limits

### Support
- 📧 Email: diskominfo@hstkab.go.id
- 📱 Phone: (0517) 3791750
- 🌐 Website: diskominfo.hstkab.go.id
