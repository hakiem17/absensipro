#!/usr/bin/env node
/**
 * Supabase Keep-Alive Script (Anti-Pause)
 * AbsensiPro - Diskominfo SP Kab. HST
 * 
 * Menjaga proyek Supabase agar tidak di-pause otomatis oleh sistem Free Tier (setiap 7 hari tidak aktif).
 * Menjalankan query ringan ke Supabase REST API untuk mereset timer inaktivitas.
 * 
 * Penggunaan:
 *   node scripts/keepalive.js
 */

const fs = require('fs');
const path = require('path');

function getCredentials() {
  let url = process.env.SUPABASE_URL;
  let key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    const configPath = path.resolve(__dirname, '../assets/js/config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const urlMatch = content.match(/SUPABASE_URL\s*=\s*["']([^"']+)["']/);
      const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*["']([^"']+)["']/);
      if (urlMatch) url = urlMatch[1];
      if (keyMatch) key = keyMatch[1];
    }
  }

  if (!url || !key) {
    throw new Error('Supabase URL atau Anon Key tidak ditemukan di assets/js/config.js maupun environment variables.');
  }

  return { url: url.replace(/\/+$/, ''), key };
}

async function pingSupabase() {
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
  console.log(`\n======================================================`);
  console.log(`[${now} WITA] Menjalankan Supabase Keep-Alive...`);
  console.log(`======================================================`);

  const { url, key } = getCredentials();
  const endpoint = `${url}/rest/v1/events?select=id&limit=1`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    const status = res.status;
    const body = await res.text();

    console.log(`Target  : ${endpoint}`);
    console.log(`Status  : HTTP ${status}`);
    console.log(`Response: ${body.slice(0, 150)}`);

    if (res.ok) {
      console.log(`\n✅ SUKSES: Supabase aktif! Timer 7 hari inaktivitas berhasil di-reset.`);
      console.log(`Database AbsensiPro tidak akan di-pause oleh Supabase.`);
    } else {
      console.log(`\nℹ️ Catatan: Request tercatat di Supabase Gateway (HTTP ${status}). Aktivitas berhasil terekam.`);
    }
  } catch (err) {
    console.error(`\n❌ Gagal menghubungi Supabase:`, err.message);
    process.exitCode = 1;
  }
}

pingSupabase();
