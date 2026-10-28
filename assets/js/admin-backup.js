// File: assets/js/admin-backup.js

(function () {
    'use strict';

    // State
    let isProcessing = false;

    // DOM Elements
    const btnBackup = document.getElementById('btn-backup');
    const backupStatus = document.getElementById('backup-status');

    const btnRestore = document.getElementById('btn-restore');
    const fileInput = document.getElementById('restore-file');
    const restoreStatus = document.getElementById('restore-status');
    const restoreStatusText = document.getElementById('restore-status-text');
    const restoreProgress = document.getElementById('restore-progress');

    // Initialization
    function init() {
        // Auth check
        if (typeof AdminAuth !== 'undefined') {
            AdminAuth.requireAdmin();
        } else {
            console.error("AdminAuth not loaded");
        }

        // Initialize Supabase
        if (!window.sb && window.supabase) {
            window.sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        }
    }

    // Helper: Format Date for Filename
    function getTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    }

    // --- BACKUP FUNCTIONALITY ---

    async function performBackup() {
        if (isProcessing) return;
        isProcessing = true;
        btnBackup.disabled = true;
        backupStatus.classList.remove('d-none');

        try {
            // 1. Fetch Events
            const { data: events, error: errEvents } = await window.sb
                .from('events')
                .select('*')
                .order('created_at', { ascending: true });
            if (errEvents) throw new Error("Gagal mengambil data Events: " + errEvents.message);

            // 2. Fetch Attendees
            // Fetch in chunks if too large (simple implementation for now)
            const { data: attendees, error: errAttendees } = await window.sb
                .from('attendees')
                .select('*')
                .order('id', { ascending: true });
            if (errAttendees) throw new Error("Gagal mengambil data Attendees: " + errAttendees.message);

            // 3. Fetch Master TTD
            const { data: masterTTD, error: errTTD } = await window.sb
                .from('master_tanda_tangan')
                .select('*');
            if (errTTD) throw new Error("Gagal mengambil data Master TTD: " + errTTD.message);

            // 4. Fetch Notulen
            const { data: notulen, error: errNotulen } = await window.sb
                .from('notulen_acara')
                .select('*');
            if (errNotulen) throw new Error("Gagal mengambil data Notulen: " + errNotulen.message);

            // 5. Construct JSON
            const backupData = {
                metadata: {
                    version: "1.0",
                    generated_at: new Date().toISOString(),
                    app: "AbsensiPro"
                },
                data: {
                    events: events || [],
                    attendees: attendees || [],
                    master_tanda_tangan: masterTTD || [],
                    notulen_acara: notulen || []
                }
            };

            // 6. Download File
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `absensipro-backup-${getTimestamp()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat backup::\n" + err.message);
        } finally {
            isProcessing = false;
            btnBackup.disabled = false;
            backupStatus.classList.add('d-none');
        }
    }

    // --- RESTORE FUNCTIONALITY ---

    function handleFileSelect(e) {
        if (e.target.files.length > 0) {
            btnRestore.disabled = false;
        } else {
            btnRestore.disabled = true;
        }
    }

    async function performRestore() {
        const file = fileInput.files[0];
        if (!file) return;

        if (!confirm("PERINGATAN: Restore akan menimpa data yang memiliki ID sama. Data baru akan ditambahkan. Lanjutkan?")) {
            return;
        }

        if (isProcessing) return;
        isProcessing = true;
        btnRestore.disabled = true;
        fileInput.disabled = true;
        restoreStatus.classList.remove('d-none');
        updateProgress(0, "Membaca file...");

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const json = JSON.parse(e.target.result);

                if (!json.data || !json.metadata) {
                    throw new Error("Format file backup tidak valid.");
                }

                await processRestoreData(json.data);

                alert("Restore data berhasil selesai!");
                fileInput.value = "";
                btnRestore.disabled = true;

            } catch (err) {
                console.error(err);
                alert("Gagal melakukan restore:\n" + err.message);
            } finally {
                isProcessing = false;
                fileInput.disabled = false;
                if (fileInput.files.length > 0) btnRestore.disabled = false;
                restoreStatus.classList.add('d-none');
            }
        };
        reader.readAsText(file);
    }

    async function processRestoreData(data) {
        // Order matters due to foreign keys: Events -> Attendees, Notulen

        // 1. Events
        if (data.events && data.events.length > 0) {
            updateProgress(10, `Memulihkan ${data.events.length} Events...`);
            const { error } = await window.sb.from('events').upsert(data.events);
            if (error) throw new Error("Gagal restore Events: " + error.message);
        }

        // 2. Master TTD
        if (data.master_tanda_tangan && data.master_tanda_tangan.length > 0) {
            updateProgress(30, `Memulihkan ${data.master_tanda_tangan.length} Master TTD...`);
            const { error } = await window.sb.from('master_tanda_tangan').upsert(data.master_tanda_tangan);
            if (error) throw new Error("Gagal restore Master TTD: " + error.message);
        }

        // 3. Attendees
        if (data.attendees && data.attendees.length > 0) {
            updateProgress(50, `Memulihkan ${data.attendees.length} Attendees... (ini mungkin memakan waktu)`);
            // Batch insert attendees to avoid payload limits
            const batchSize = 100;
            for (let i = 0; i < data.attendees.length; i += batchSize) {
                const batch = data.attendees.slice(i, i + batchSize);
                // Remove id if it causes identity issues, usually upsert handles it if PK is provided
                // But for serial ID (bigint), it's better to keep it if we want exact restoration
                const { error } = await window.sb.from('attendees').upsert(batch);
                if (error) throw new Error(`Gagal restore Attendees batch ${i}: ` + error.message);

                const pct = 50 + Math.floor(((i + batch.length) / data.attendees.length) * 30);
                updateProgress(pct, `Memulihkan Attendees (${i + batch.length}/${data.attendees.length})...`);
            }
        }

        // 4. Notulen
        if (data.notulen_acara && data.notulen_acara.length > 0) {
            updateProgress(90, `Memulihkan ${data.notulen_acara.length} Notulen...`);
            const { error } = await window.sb.from('notulen_acara').upsert(data.notulen_acara);
            if (error) throw new Error("Gagal restore Notulen: " + error.message);
        }

        updateProgress(100, "Selesai!");
    }

    function updateProgress(percent, text) {
        restoreProgress.style.width = `${percent}%`;
        restoreStatusText.textContent = text;
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        init();
        if (btnBackup) btnBackup.addEventListener('click', performBackup);
        if (btnRestore) btnRestore.addEventListener('click', performRestore);
        if (fileInput) fileInput.addEventListener('change', handleFileSelect);

        // Pager for Backup Views (Page 1 & Page 2)
        const pager = document.getElementById('backupViewPager');
        if (pager) {
            let currentPage = 1;
            const totalPages = 2;
            const titles = {
                1: 'Backup & Restore Database',
                2: 'Catatan Penting & Panduan'
            };
            const panes = {
                1: document.getElementById('backupPane1'),
                2: document.getElementById('backupPane2')
            };
            const prevBtn = document.getElementById('backupPrevBtn');
            const nextBtn = document.getElementById('backupNextBtn');
            const badge = document.getElementById('backupPageBadge');
            const titleEl = document.getElementById('backupPageTitle');
            const numBtns = pager.querySelectorAll('[data-backup-page]');

            function setPage(p) {
                if (p < 1 || p > totalPages) return;
                currentPage = p;
                Object.keys(panes).forEach((k) => {
                    if (panes[k]) panes[k].classList.toggle('active', Number(k) === currentPage);
                });
                numBtns.forEach((btn) => {
                    btn.classList.toggle('active', Number(btn.getAttribute('data-backup-page')) === currentPage);
                });
                if (prevBtn) prevBtn.disabled = currentPage === 1;
                if (nextBtn) nextBtn.disabled = currentPage === totalPages;
                if (badge) badge.textContent = `Halaman ${currentPage} / ${totalPages}`;
                if (titleEl) titleEl.textContent = titles[currentPage] || '';
            }

            if (prevBtn) prevBtn.addEventListener('click', () => setPage(currentPage - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => setPage(currentPage + 1));
            numBtns.forEach((btn) => {
                btn.addEventListener('click', () => setPage(Number(btn.getAttribute('data-backup-page'))));
            });
        }
    });

})();
