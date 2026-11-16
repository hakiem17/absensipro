#!/usr/bin/env node
/**
 * Supabase Automated Restore CLI
 * AbsensiPro - Diskominfo SP Kab. HST
 * 
 * Memulihkan data dari file JSON backup langsung ke Supabase melalui REST API.
 * 
 * Penggunaan:
 *   node scripts/restore-db.js                   -> Otomatis mencari file backup terbaru di folder backups/
 *   node scripts/restore-db.js backups/file.json -> Menggunakan file tertentu
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
    throw new Error('Supabase credentials tidak ditemukan.');
  }

  return { url: url.replace(/\/+$/, ''), key };
}

function findLatestBackup() {
  const backupDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) return null;

  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(backupDir, f),
      mtime: fs.statSync(path.join(backupDir, f)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].path : null;
}

async function upsertBatch(url, key, table, rows, batchSize = 100) {
  if (!rows || rows.length === 0) {
    console.log(`- ${table}: 0 data (dilewati)`);
    return 0;
  }

  const endpoint = `${url}/rest/v1/${table}`;
  let count = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(batch)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal upsert ke ${table} [index ${i}..${i + batch.length}]: (HTTP ${res.status}) ${errText}`);
    }

    count += batch.length;
    process.stdout.write(`\r  Memulihkan ${table}: ${count}/${rows.length}...`);
  }

  console.log(`\r  ✓ ${table}: ${count} data berhasil dipulihkan.`);
  return count;
}

async function runRestore() {
  console.log(`\n======================================================`);
  console.log(`🔄 MEMULAI AUTOMATED RESTORE SUPABASE - ABSENSIPRO`);
  console.log(`======================================================`);

  let targetFile = process.argv[2];
  if (!targetFile) {
    targetFile = findLatestBackup();
    if (!targetFile) {
      console.error(`\n❌ ERROR: Tidak ada file backup yang ditentukan dan folder 'backups/' kosong.`);
      console.error(`Gunakan: node scripts/restore-db.js <path-ke-file-backup.json>\n`);
      process.exit(1);
    }
    console.log(`ℹ️ Memilih file backup terbaru otomatis:\n   ${targetFile}`);
  } else {
    targetFile = path.resolve(process.cwd(), targetFile);
    if (!fs.existsSync(targetFile)) {
      console.error(`\n❌ ERROR: File tidak ditemukan: ${targetFile}\n`);
      process.exit(1);
    }
  }

  // Parse JSON
  let backupData;
  try {
    const raw = fs.readFileSync(targetFile, 'utf8');
    backupData = JSON.parse(raw);
  } catch (err) {
    console.error(`\n❌ ERROR: File JSON tidak valid!`, err.message);
    process.exit(1);
  }

  if (!backupData.data) {
    console.error(`\n❌ ERROR: Struktur file backup tidak memiliki properti 'data'.`);
    process.exit(1);
  }

  const { events = [], master_tanda_tangan = [], attendees = [], notulen_acara = [] } = backupData.data;
  const { url, key } = getCredentials();
  console.log(`Target Supabase: ${url}`);
  console.log(`Backup dibuat  : ${backupData.metadata?.generated_at || 'Tidak diketahui'}\n`);

  console.log(`Urutan restore (Foreign Key safe):`);
  console.log(`1. events (${events.length})`);
  console.log(`2. master_tanda_tangan (${master_tanda_tangan.length})`);
  console.log(`3. attendees (${attendees.length})`);
  console.log(`4. notulen_acara (${notulen_acara.length})\n`);

  const startTime = Date.now();
  try {
    // 1. Events
    await upsertBatch(url, key, 'events', events, 100);

    // 2. Master Tanda Tangan
    await upsertBatch(url, key, 'master_tanda_tangan', master_tanda_tangan, 100);

    // 3. Attendees
    await upsertBatch(url, key, 'attendees', attendees, 100);

    // 4. Notulen Acara
    await upsertBatch(url, key, 'notulen_acara', notulen_acara, 100);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n======================================================`);
    console.log(`🎉 RESTORE SELESAI DENGAN SUKSES! (${elapsed} detik)`);
    console.log(`Database Supabase telah dipulihkan secara penuh.`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`\n❌ GAGAL RESTORE:`, err.message);
    process.exitCode = 1;
  }
}

runRestore();
