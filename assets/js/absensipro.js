<!DOCTYPE html>
<html lang="id" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Daftar Hadir - Admin Panel</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

      :root[data-theme="light"]{
        --bg-main:#f8f9fa; --bg-sidebar:#ffffff; --text-primary:#212529; --text-secondary:#6c757d; --border-color:#dee2e6; --card-bg:#ffffff;
      }
      :root[data-theme="dark"]{
        --bg-main:#1a202c; --bg-sidebar:#2d3748; --text-primary:#e2e8f0; --text-secondary:#a0aec0; --border-color:#4a5568; --card-bg:#2d3748;
      }

      body{display:flex;min-height:100vh;background:var(--bg-main);color:var(--text-primary);font-family:"Poppins",sans-serif;}
      .sidebar{background:var(--bg-sidebar);position:fixed;inset:0 auto 0 0;z-index:100;width:260px;box-shadow:0 0 15px rgba(0,0,0,.1);display:flex;flex-direction:column;transition:background .3s;}
      .sidebar .nav-link{color:var(--text-secondary);font-weight:500;padding:12px 20px;display:flex;align-items:center;}
      .sidebar .nav-link .bi{margin-right:12px;font-size:1.1rem;}
      .sidebar .nav-link:hover{background:rgba(255,255,255,.05);color:var(--text-primary);}
      [data-theme="light"] .sidebar .nav-link:hover{background:rgba(0,0,0,.05);}
      .sidebar .nav-link.active{color:#3b82f6;font-weight:600;}

      .main-content-wrapper{margin-left:260px;width:calc(100% - 260px);display:flex;flex-direction:column;flex-grow:1;}
      .top-header{background:var(--card-bg);border-bottom:1px solid var(--border-color);}
      .main-content{flex-grow:1;}

      .card{background:var(--card-bg);border:1px solid var(--border-color);}
      .table{--bs-table-bg:var(--card-bg);--bs-table-color:var(--text-primary);--bs-table-border-color:var(--border-color);--bs-table-striped-bg:rgba(255,255,255,.02);--bs-table-hover-bg:rgba(255,255,255,.04);}
      [data-theme="light"] .table{--bs-table-striped-bg:rgba(0,0,0,.02);--bs-table-hover-bg:rgba(0,0,0,.04);}

      .signature-thumbnail{width:100px;height:50px;object-fit:contain;background:#f0f0f0;border:1px solid var(--border-color);border-radius:4px;cursor:pointer;}
      [data-theme="dark"] .signature-thumbnail{background:#4a5568;}

      .footer-professional{background:#3b82f6;color:#e5e7eb;padding-top:3rem;padding-bottom:1.5rem;font-size:.95rem;}
      .footer-professional .footer-title{color:#fff;font-weight:600;margin-bottom:1.25rem;display:flex;align-items:center;}
      .footer-professional .footer-title .bi{margin-right:.5rem;font-size:1.2rem;}
      .footer-professional .footer-links{list-style:none;padding-left:0;}
      .footer-professional .footer-links li{margin-bottom:.75rem;}
      .footer-professional .footer-links a,.footer-professional .contact-item{color:#e5e7eb;text-decoration:none;display:flex;align-items:center;}
      .footer-professional .footer-links a:hover{color:#fff;}
      .footer-professional .contact-item .bi{margin-right:.5rem;}
      .footer-professional .social-icons a{color:#e5e7eb;font-size:1.2rem;margin-right:1rem;}
      .footer-professional .social-icons a:hover{color:#fff;}
      .footer-professional .footer-divider{border-top:1px solid #4b92f7;margin-top:2rem;margin-bottom:1.5rem;}
      .footer-professional .copyright{font-size:.875rem;}

      /* === PRINT: KOP SURAT === */
      .print-kop{display:none;}
      .print-kop .kop-title{font-size:20px;font-weight:700;letter-spacing:.4px;}
      .print-kop .kop-subtitle{font-size:20px;font-weight:800;text-transform:uppercase;}
      .print-kop .kop-address{font-size:12px;margin-top:4px;line-height:1.35;}
      .print-kop .kop-lines{border-top:3px solid #000;border-bottom:1px solid #000;height:6px;margin-top:8px;margin-bottom:16px;}

      @media print{
        @page{size:A4 portrait;margin:18mm 12mm;}
        body{background:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        nav, .top-header, .footer-professional, #toolbar, #theme-toggle{display:none!important;}
        .print-kop{display:block!important;color:#000!important;}
        .card{border:none!important;box-shadow:none!important;}
        .table{font-size:12px;}
        .signature-thumbnail{height:28px!important;width:auto;}
      }
    </style>
  </head>
  <body>
    <script>
      // tema awal dari localStorage
      (function(){ const t = localStorage.getItem("theme") || "dark"; document.documentElement.setAttribute("data-theme", t); })();
    </script>

    <!-- SIDEBAR -->
    <nav class="sidebar">
      <div class="p-4"><h4 class="fw-bold">AbsensiPro</h4></div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
        <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-calendar-event"></i> Manajemen Acara</a></li>
      </ul>
      <div class="p-3 mt-auto"><a href="#" class="btn btn-outline-danger w-100"><i class="bi bi-box-arrow-right"></i> Logout</a></div>
    </nav>

    <div class="main-content-wrapper">
      <!-- HEADER -->
      <header class="top-header p-3 d-flex justify-content-end align-items-center">
        <button id="theme-toggle" class="btn btn-outline-secondary"><i class="bi bi-sun-fill"></i></button>
        <span class="ms-3">Selamat datang, Hakiem</span>
      </header>

      <!-- MAIN -->
      <main class="main-content p-4">

        <!-- KOP SURAT (muncul saat PRINT) -->
        <div class="print-kop">
          <table style="width:100%;">
            <tr>
              <td style="width:90px;vertical-align:top;">
                <!-- ganti src jika file logo berbeda -->
                <img src="assets/img/logo-hst.png" alt="Logo HST" style="width:72px;height:auto;">
              </td>
              <td style="text-align:center;">
                <div class="kop-title">PEMERINTAH KABUPATEN HULU SUNGAI TENGAH</div>
                <div class="kop-subtitle">DINAS KOMUNIKASI DAN INFORMATIKA</div>
                <div class="kop-address">
                  Jalan Perintis Kemerdekaan, Desa Benawa Tengah, Barabai, Kalimantan Selatan 71351<br>
                  Telepon (0517) 3791750, Faksimile (0517) 3791750<br>
                  Laman: diskominfo.hstkab.go.id, Pos-el diskominfo@hstkab.go.id
                </div>
                <div class="kop-lines"></div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Toolbar -->
        <div id="toolbar" class="mb-4">
          <a href="admin-manajemen-acara.html" class="btn btn-outline-secondary mb-3">
            <i class="bi bi-arrow-left"></i> Kembali
          </a>

          <div class="row g-3 align-items-end">
            <div class="col-md-5">
              <label class="form-label">Acara</label>
              <select id="event-select" class="form-select"></select>
              <div class="small text-secondary mt-2" id="event-meta"></div>
            </div>
            <div class="col-md-7 text-md-end">
              <div class="btn-group me-2">
                <button id="btn-export" class="btn btn-success"><i class="bi bi-file-earmark-spreadsheet"></i> Export CSV</button>
                <button id="btn-print"  class="btn btn-danger"><i class="bi bi-file-earmark-pdf"></i> Export PDF</button>
              </div>
              <button id="btn-copy" class="btn btn-outline-info"><i class="bi bi-link-45deg"></i> Copy Link Form</button>
            </div>
          </div>
        </div>

        <!-- Card Daftar Hadir -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h4 class="mb-0">Daftar Hadir</h4>
              <div class="text-secondary"><span id="count">0</span> peserta</div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="width:60px">#</th>
                    <th>Nama Lengkap</th>
                    <th>Instansi</th>
                    <th>Jabatan</th>
                    <th>Waktu Kehadiran</th>
                    <th>Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody id="tbody"></tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      <!-- FOOTER -->
      <footer class="footer-professional">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <h5 class="footer-title"><i class="bi bi-geo-alt-fill"></i>Kantor Kami</h5>
              <p>Jl. Antasari, Barabai,<br/>Kab. Hulu Sungai Tengah,<br/>Kalimantan Selatan</p>
            </div>
            <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <h5 class="footer-title">Sitemap</h5>
              <ul class="footer-links">
                <li><a href="#">Beranda</a></li>
                <li><a href="#">Daftar Acara</a></li>
                <li><a href="#">Login Admin</a></li>
              </ul>
            </div>
            <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
              <h5 class="footer-title">Kontak Kami</h5>
              <div class="contact-item mb-2"><i class="bi bi-envelope-fill"></i><span>diskominfo@hstkab.go.id</span></div>
              <div class="contact-item"><i class="bi bi-telephone-fill"></i><span>(0517) 21111</span></div>
            </div>
            <div class="col-lg-3 col-md-6">
              <h5 class="footer-title">Media Sosial</h5>
              <div class="social-icons">
                <a href="#"><i class="bi bi-facebook"></i></a>
                <a href="#"><i class="bi bi-twitter-x"></i></a>
                <a href="#"><i class="bi bi-instagram"></i></a>
                <a href="#"><i class="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>
          <div class="footer-divider"></div>
          <div class="text-center copyright">
            &copy; <span id="copyright-year"></span> Diskominfo Hulu Sungai Tengah. All rights reserved.
          </div>
        </div>
      </footer>
    </div>

    <!-- Modal preview tanda tangan -->
    <div class="modal fade" id="signatureModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:var(--card-bg)">
          <div class="modal-header">
            <h5 class="modal-title">Pratinjau Tanda Tangan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img id="modalSignatureImage" class="img-fluid" alt="Tanda Tangan"/>
          </div>
        </div>
      </div>
    </div>

    <!-- JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./assets/js/absensipro.js?v=4"></script>
    <script>
      // Tahun & toggle tema
      document.getElementById("copyright-year").textContent = new Date().getFullYear();
      const htmlEl = document.documentElement, themeBtn = document.getElementById("theme-toggle");
      function updateIcon(){ themeBtn.querySelector("i").className = htmlEl.getAttribute("data-theme")==="dark"?"bi bi-sun-fill":"bi bi-moon-fill"; }
      themeBtn.addEventListener("click",()=>{ const t=htmlEl.getAttribute("data-theme")==="dark"?"light":"dark"; htmlEl.setAttribute("data-theme",t); localStorage.setItem("theme",t); updateIcon(); }); updateIcon();

      // ====== AbsensiPro: data & render ======
      if(!window.AbsensiPro){ alert("absensipro.js tidak ditemukan. Pastikan path './assets/js/absensipro.js?v=4' benar."); }
      AbsensiPro.seedIfEmpty();

      const $select = document.getElementById("event-select");
      const $meta = document.getElementById("event-meta");
      const $tbody = document.getElementById("tbody");
      const $count = document.getElementById("count");

      function resolveEvent(){
        let eventId = new URLSearchParams(location.search).get("event");
        let ev = eventId ? AbsensiPro.getEvent(eventId) : null;
        if(!ev){
          const list = AbsensiPro.listEvents();
          ev = list.find(e=>e.status==="active") || list[0];
          if(ev){
            const url = new URL(location.href);
            url.searchParams.set("event", ev.id);
            history.replaceState({}, "", url.toString());
          }
        }
        return ev;
      }

      function fillEventSelect(currentId){
        const events = AbsensiPro.listEvents();
        $select.innerHTML = events.map(e => `<option value="${e.id}" ${e.id===currentId?'selected':''}>${e.title}</option>`).join("");
      }

      function toCSVWithBOM(rows, headers){
        const esc = v => `"${String(v ?? "").replace(/"/g,'""')}"`;
        const head = headers.map(esc).join(",");
        const body = rows.map(r => headers.map(h => esc(r[h])).join(",")).join("\n");
        return "\uFEFF" + head + "\n" + body;
      }
      function download(name, content, mime="text/csv;charset=utf-8"){
        const blob = new Blob([content], {type:mime});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = name; a.click();
        URL.revokeObjectURL(url);
      }

      function render(){
        const ev = resolveEvent();
        if(!ev){
          $meta.textContent = "Acara tidak ditemukan.";
          $tbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary">Tidak ada data.</td></tr>`;
          $count.textContent = 0;
          return;
        }

        // meta + select
        $meta.innerHTML = `
          <span class="me-3"><i class="bi bi-calendar-event"></i> ${AbsensiPro.fmtDT(ev.datetime)}</span>
          <span class="me-3"><i class="bi bi-geo-alt"></i> ${ev.location}</span>
          <span class="badge ${ev.status==='done'?'text-bg-success':(ev.status==='active'?'text-bg-primary':'text-bg-secondary')}">${ev.status}</span>
        `;
        fillEventSelect(ev.id);

        // table
        const list = AbsensiPro.listAttendees(ev.id);
        $count.textContent = list.length;
        if(list.length===0){
          $tbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary">Belum ada peserta hadir.</td></tr>`;
        } else {
          $tbody.innerHTML = list.map((a,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${a.name || "-"}</td>
              <td>${a.instansi || "-"}</td>
              <td>${a.jabatan || "-"}</td>
              <td>${a.ts ? new Date(a.ts).toLocaleString("id-ID") : "-"}</td>
              <td>${a.signatureDataUrl ? `<img class="signature-thumbnail" src="${a.signatureDataUrl}" alt="ttd" />` : '-'}</td>
            </tr>
          `).join("");
        }

        // preview tanda tangan
        document.querySelectorAll(".signature-thumbnail").forEach(img=>{
          img.addEventListener("click", ()=>{
            document.getElementById("modalSignatureImage").src = img.src;
            new bootstrap.Modal(document.getElementById("signatureModal")).show();
          });
        });

        // tombol
        document.getElementById("btn-export").onclick = ()=>{
          const headers = ["name","instansi","jabatan","email","phone","ts"];
          const rows = list.map(a=>({
            name:a.name||"", instansi:a.instansi||"", jabatan:a.jabatan||"",
            email:a.email||"", phone:a.phone||"", ts:a.ts||""
          }));
          const csv = toCSVWithBOM(rows, headers);
          download(`absensi-${ev.id}.csv`, csv);
        };
        document.getElementById("btn-print").onclick = ()=> window.print();
        document.getElementById("btn-copy").onclick = async ()=>{
          const base = location.pathname.replace(/[^/]+$/, "");
          const url = `${location.origin}${base}form-kehadiran.html?event=${encodeURIComponent(ev.id)}`;
          await navigator.clipboard.writeText(url);
          alert("Link form telah disalin:\n" + url);
        };
      }

      $select.addEventListener("change",(e)=>{
        const id = e.target.value;
        const url = new URL(location.href); url.searchParams.set("event", id);
        history.replaceState({}, "", url.toString());
        render();
      });

      render();
    </script>
  </body>
</html>
