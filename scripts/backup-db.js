#!/usr/bin/env node
/**
 * Supabase Automated Backup CLI
 * AbsensiPro - Diskominfo SP Kab. HST
 * 
 * Mengunduh seluruh data (Events, Attendees, Master TTD, Notulen) langsung dari Supabase
 * dan menyimpannya ke folder 'backups/absensipro-backup-[timestamp].json'.
 * 
 * Penggunaan:
 *   node scripts/backup-db.js
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

async function fetchTable(url, key, table, orderCol = 'id') {
  let allRows = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const endpoint = `${url}/rest/v1/${table}?select=*&order=${orderCol}.asc&limit=${limit}&offset=${offset}`;
    const res = await fetch(endpoint, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal mengambil data ${table} (HTTP ${res.status}): ${errText}`);
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) break;

    allRows.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
  }

  return allRows;
}

async function runBackup() {
  const startTime = Date.now();
  console.log(`\n======================================================`);
  console.log(`📦 MEMULAI AUTOMATED BACKUP SUPABASE - ABSENSIPRO`);
  console.log(`======================================================`);

  const { url, key } = getCredentials();
  console.log(`Target: ${url}\n`);

  try {
    process.stdout.write(`⏳ Mengambil data 'events'... `);
    const events = await fetchTable(url, key, 'events', 'created_at');
    console.log(`✓ (${events.length} data)`);

    process.stdout.write(`⏳ Mengambil data 'master_tanda_tangan'... `);
    const masterTTD = await fetchTable(url, key, 'master_tanda_tangan', 'created_at');
    console.log(`✓ (${masterTTD.length} data)`);

    process.stdout.write(`⏳ Mengambil data 'attendees'... `);
    const attendees = await fetchTable(url, key, 'attendees', 'id');
    console.log(`✓ (${attendees.length} data)`);

    process.stdout.write(`⏳ Mengambil data 'notulen_acara'... `);
    const notulen = await fetchTable(url, key, 'notulen_acara', 'created_at');
    console.log(`✓ (${notulen.length} data)`);

    const now = new Date();
    const tsStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.resolve(__dirname, '../backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = `absensipro-backup-${tsStr}.json`;
    const filePath = path.join(backupDir, fileName);

    const payload = {
      metadata: {
        version: "1.0",
        generated_at: now.toISOString(),
        app: "AbsensiPro",
        tool: "scripts/backup-db.js"
      },
      data: {
        events,
        attendees,
        master_tanda_tangan: masterTTD,
        notulen_acara: notulen
      }
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n======================================================`);
    console.log(`✅ BACKUP BERHASIL DISIMPAN! (${elapsedSec} detik)`);
    console.log(`📂 Lokasi File: backups/${fileName}`);
    console.log(`------------------------------------------------------`);
    console.log(`- Events             : ${events.length}`);
    console.log(`- Attendees (Peserta): ${attendees.length}`);
    console.log(`- Master TTD         : ${masterTTD.length}`);
    console.log(`- Notulen Acara      : ${notulen.length}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`\n❌ ERROR: Backup gagal!`, err.message);
    process.exitCode = 1;
  }
}

runBackup();
