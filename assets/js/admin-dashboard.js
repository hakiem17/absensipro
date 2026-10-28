// Admin Dashboard JavaScript
// File: assets/js/admin-dashboard.js

(function() {
  'use strict';

  // Initialize theme from localStorage
  (function initTheme() {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  })();

  // Wait for DOM and dependencies to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Wait for Supabase and AdminAuth to be available
    if (typeof supabase === 'undefined' || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      console.error('Supabase belum siap');
      return;
    }

    if (typeof AdminAuth === 'undefined') {
      console.error('AdminAuth belum siap');
      return;
    }

    // Supabase client
    const sb = window.sb || supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
    window.sb = sb;

    // Auth check
    AdminAuth.requireAdmin();
  
  // DOM Elements
  const $statEvents = document.getElementById("stat-events");
  const $statActive = document.getElementById("stat-events-active");
  const $statDone = document.getElementById("stat-events-done");
  const $statAtt = document.getElementById("stat-attendees");
  const $upcoming = document.getElementById("upcoming-list");
  const $yearFilter = document.getElementById("year-filter");
  const chartCtx = document.getElementById("attendanceChart")?.getContext("2d");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleHeader = document.getElementById("theme-toggle-header");
  const btnLogout = document.getElementById("btn-logout");

  // State
  let selectedYear = new Date().getFullYear();
  let attendanceChartInstance = null;

  // Theme Management (handled by admin-common.js; listen to themechange to refresh chart if present)
  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const icon = themeToggle?.querySelector("i");
    const iconHeader = themeToggleHeader?.querySelector("i");
    if (icon) {
      icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
    }
    if (iconHeader) {
      iconHeader.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
    }
  }

  window.addEventListener("themechange", () => {
    if (attendanceChartInstance) {
      attendanceChartInstance.destroy();
      attendanceChartInstance = null;
    }
    loadChart();
  });

  // Utility Functions
  function safeNum(n) {
    return typeof n === "number" && isFinite(n) ? n : 0;
  }

  function fmtDateShort(iso) {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function truncateText(text, maxLength = 40) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  function getYearFilter() {
    const yearStart = `${selectedYear}-01-01T00:00:00`;
    const yearEnd = `${selectedYear}-12-31T23:59:59`;
    return { yearStart, yearEnd };
  }

  function getThemeColors() {
    const css = getComputedStyle(document.documentElement);
    return {
      textPrimary: css.getPropertyValue("--text-primary").trim() || "#e2e8f0",
      textSecondary: css.getPropertyValue("--text-secondary").trim() || "#a0aec0",
      border: css.getPropertyValue("--border-color").trim() || "#4a5568",
      cardBg: css.getPropertyValue("--bg-card").trim() || "#2d3748",
    };
  }

  // Year Filter Functions
  async function loadAvailableYears() {
    try {
      const { data, error } = await sb
        .from("events")
        .select("datetime")
        .order("datetime", { ascending: false });

      if (error || !data) return [];

      const years = new Set();
      data.forEach(event => {
        if (event.datetime) {
          const year = new Date(event.datetime).getFullYear();
          years.add(year);
        }
      });

      return Array.from(years).sort((a, b) => b - a);
    } catch (error) {
      console.error("Error loading years:", error);
      return [];
    }
  }

  async function populateYearFilter() {
    const years = await loadAvailableYears();
    const currentYear = new Date().getFullYear();
    
    if (years.length === 0) {
      years.push(currentYear);
    }

    if (!$yearFilter) return;

    $yearFilter.innerHTML = '<option value="all">Semua Tahun</option>';
    const defaultYear = years.includes(currentYear) ? currentYear : years[0];
    selectedYear = defaultYear;

    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === defaultYear) {
        option.selected = true;
      }
      $yearFilter.appendChild(option);
    });

    loadAllData();
  }

  // Stats Loading
  async function loadStats() {
    try {
      let query = sb.from("events").select("id, status, datetime");
      if (selectedYear && selectedYear !== "all") {
        const { yearStart, yearEnd } = getYearFilter();
        query = query.gte("datetime", yearStart).lte("datetime", yearEnd);
      }

      const { data: eventsInYear, error: evError } = await query;
      if (evError) throw evError;

      const list = eventsInYear || [];
      const totalEventsCount = list.length;
      const doneEventsCount = list.filter(e => e.status === "done").length;
      const activeEventsCount = list.filter(e => e.status !== "done").length;

      const eventIds = list.map(e => e.id);
      let attendeesCount = 0;
      if (eventIds.length > 0) {
        const { count, error: attError } = await sb
          .from("attendees")
          .select("*", { count: "exact", head: true })
          .in("event_id", eventIds);
        if (!attError && typeof count === "number") {
          attendeesCount = count;
        }
      }
      
      const updateValue = (el, countVal) => {
        if (!el) return;
        el.textContent = "";
        const num = safeNum(countVal);
        el.textContent = num.toLocaleString("id-ID");
        el.classList.add("fade-in");
      };
      
      updateValue($statEvents, totalEventsCount);
      updateValue($statDone, doneEventsCount);
      updateValue($statActive, activeEventsCount);
      updateValue($statAtt, attendeesCount);
    } catch (error) {
      console.error("Error loading stats:", error);
      if ($statEvents) $statEvents.textContent = "—";
      if ($statDone) $statDone.textContent = "—";
      if ($statActive) $statActive.textContent = "—";
      if ($statAtt) $statAtt.textContent = "—";
    }
  }

  // Upcoming Events
  async function loadUpcoming() {
    try {
      const nowIso = new Date().toISOString();
      const { yearStart, yearEnd } = getYearFilter();
      
      const { data, error } = await sb
        .from("events")
        .select("id,title,datetime,location,status")
        .gte("datetime", yearStart)
        .lte("datetime", yearEnd)
        .gt("datetime", nowIso)
        .neq("status", "done")
        .order("datetime", { ascending: true })
        .limit(12);
      
      if (error) {
        if ($upcoming) {
          $upcoming.innerHTML =
            '<div class="list-group-item text-danger"><i class="bi bi-exclamation-triangle me-2"></i>Gagal memuat data.</div>';
        }
        return;
      }
      
      if (!data || !data.length) {
        if ($upcoming) {
          $upcoming.innerHTML = `
            <div class="empty-state" style="padding: 1.25rem 1rem;">
              <div class="empty-state-icon" style="font-size: 2.25rem; margin-bottom: 0.4rem;">
                <i class="bi bi-calendar-x"></i>
              </div>
              <div class="empty-state-title" style="font-size: 0.95rem;">Tidak ada acara</div>
              <div class="empty-state-text" style="font-size: 0.78rem;">Belum ada acara yang akan datang</div>
            </div>
          `;
        }
        return;
      }
      
      if (!$upcoming) return;

      let upPage = 1;
      const upPerPage = 2;
      const upTotalPages = Math.max(1, Math.ceil(data.length / upPerPage));

      function renderUpcomingPage() {
        $upcoming.innerHTML = "";
        const start = (upPage - 1) * upPerPage;
        const slice = data.slice(start, start + upPerPage);

        slice.forEach((ev, index) => {
          const d = new Date(ev.datetime);
          const dayStr = d.toLocaleDateString("id-ID", { day: "2-digit" });
          const monthStr = d.toLocaleDateString("id-ID", { month: "short" });
          const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

          const a = document.createElement("a");
          a.className = "list-group-item list-group-item-action fade-in py-2 px-3";
          a.style.animationDelay = `${index * 0.06}s`;
          a.href = `admin-daftar-hadir.html?event=${encodeURIComponent(ev.id)}`;
          a.innerHTML = `
            <div class="d-flex align-items-center gap-2">
              <div class="upcoming-date-badge" style="width: 40px; height: 42px;">
                <span class="upcoming-date-day" style="font-size: 0.95rem;">${dayStr}</span>
                <span class="upcoming-date-month" style="font-size: 0.58rem;">${monthStr}</span>
              </div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-bold text-truncate mb-0" style="font-size: 0.82rem;">${ev.title}</div>
                <div class="d-flex flex-wrap align-items-center gap-2 text-secondary" style="font-size: 0.72rem;">
                  <span><i class="bi bi-clock me-1 text-primary"></i>${timeStr} WITA</span>
                  ${ev.location ? `<span class="text-truncate" style="max-width: 150px;"><i class="bi bi-geo-alt me-1 text-danger"></i>${ev.location}</span>` : ""}
                </div>
              </div>
              <i class="bi bi-chevron-right text-secondary small"></i>
            </div>
          `;
          $upcoming.appendChild(a);
        });

        if (upTotalPages > 1) {
          const nav = document.createElement("div");
          nav.className = "d-flex justify-content-between align-items-center px-3 py-1 border-top mt-auto";
          nav.style.background = "var(--bg-secondary)";
          nav.innerHTML = `
            <span class="small text-muted" style="font-size: 0.72rem;">Hal ${upPage}/${upTotalPages} (${data.length} agenda)</span>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary py-0 px-2" id="upPrev" ${upPage <= 1 ? "disabled" : ""}><i class="bi bi-chevron-left"></i></button>
              <button type="button" class="btn btn-outline-secondary py-0 px-2" id="upNext" ${upPage >= upTotalPages ? "disabled" : ""}><i class="bi bi-chevron-right"></i></button>
            </div>
          `;
          $upcoming.appendChild(nav);
          nav.querySelector("#upPrev")?.addEventListener("click", (e) => {
            e.preventDefault();
            if (upPage > 1) { upPage--; renderUpcomingPage(); }
          });
          nav.querySelector("#upNext")?.addEventListener("click", (e) => {
            e.preventDefault();
            if (upPage < upTotalPages) { upPage++; renderUpcomingPage(); }
          });
        }
      }

      renderUpcomingPage();
    } catch (error) {
      console.error("Error loading upcoming:", error);
      if ($upcoming) {
        $upcoming.innerHTML =
          '<div class="list-group-item text-danger"><i class="bi bi-exclamation-triangle me-2"></i>Gagal memuat data.</div>';
      }
    }
  }

  // Chart Loading
  async function loadChart() {
    if (!chartCtx) return;

    const chartLoading = document.getElementById("chart-loading");
    const chartCanvas = document.getElementById("attendanceChart");
    const chartEmpty = document.getElementById("chart-empty");
    
    try {
      const { yearStart, yearEnd } = getYearFilter();
      
      const { data: events, error } = await sb
        .from("events")
        .select("id,title,datetime")
        .gte("datetime", yearStart)
        .lte("datetime", yearEnd)
        .order("datetime", { ascending: false })
        .limit(5);
      
      if (error) {
        if (chartLoading) chartLoading.style.display = "none";
        if (chartEmpty) chartEmpty.style.display = "block";
        return;
      }
      
      if (!events || !events.length) {
        if (chartLoading) chartLoading.style.display = "none";
        if (chartEmpty) chartEmpty.style.display = "block";
        return;
      }

      const counts = await Promise.all(
        events.map(async (ev) => {
          const r = await sb
            .from("attendees")
            .select("*", { count: "exact", head: true })
            .eq("event_id", ev.id);
          return safeNum(r?.count);
        })
      );
      
      const eventsReversed = events.slice().reverse();
      const labels = eventsReversed.map((e) => truncateText(e.title, 35));
      const fullLabels = eventsReversed.map((e) => e.title);
      const values = counts.slice().reverse();
      const c = getThemeColors();
      
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const gradient = chartCtx.createLinearGradient(0, 0, 0, 320);
      if (isDark) {
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.9)");
        gradient.addColorStop(1, "rgba(30, 64, 175, 0.5)");
      } else {
        gradient.addColorStop(0, "rgba(15, 37, 71, 0.92)");
        gradient.addColorStop(0.6, "rgba(30, 64, 175, 0.85)");
        gradient.addColorStop(1, "rgba(37, 99, 235, 0.65)");
      }
      
      if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
      }
      
      if (chartLoading) chartLoading.style.display = "none";
      if (chartEmpty) chartEmpty.style.display = "none";
      if (chartCanvas) chartCanvas.style.display = "block";
      
      attendanceChartInstance = new Chart(chartCtx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Jumlah Peserta",
              data: values,
              backgroundColor: gradient,
              borderColor: isDark ? "#38bdf8" : "#0f2547",
              borderWidth: 1.5,
              borderRadius: 10,
              borderSkipped: false,
              maxBarThickness: 54,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          scales: {
            x: {
              ticks: { 
                color: c.textSecondary,
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 11
                }
              },
              grid: { 
                color: c.border,
                display: false
              },
            },
            y: {
              beginAtZero: true,
              ticks: { 
                color: c.textSecondary,
                stepSize: 10,
                font: {
                  size: 11
                }
              },
              grid: { 
                color: c.border,
                drawBorder: false
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              titleColor: c.textPrimary,
              bodyColor: c.textPrimary,
              backgroundColor: c.cardBg,
              borderColor: c.border,
              borderWidth: 1,
              padding: 12,
              titleFont: {
                size: 13,
                weight: "bold"
              },
              bodyFont: {
                size: 12
              },
              callbacks: {
                title: function(context) {
                  const index = context[0].dataIndex;
                  return fullLabels[index] || labels[index];
                },
                label: function(context) {
                  return `Peserta: ${context.parsed.y} orang`;
                }
              }
            },
          },
        },
      });
    } catch (error) {
      console.error("Error loading chart:", error);
      if (chartLoading) chartLoading.style.display = "none";
      if (chartEmpty) chartEmpty.style.display = "block";
    }
  }

  // Card Collapse Functionality
  document.querySelectorAll(".card-header.collapsible").forEach(header => {
    header.addEventListener("click", function() {
      const targetId = this.getAttribute("data-target");
      const targetBody = document.getElementById(targetId);
      if (targetBody) {
        this.classList.toggle("collapsed");
        targetBody.classList.toggle("collapsed");
      }
    });
  });

  // Set Active Menu Item
  function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href !== '#' && (href === currentPage || href.includes(currentPage))) {
        link.classList.add('active');
      }
    });
    
    const hasActive = document.querySelector('.sidebar-nav .nav-link.active');
    if (!hasActive && (currentPage === '' || currentPage.includes('dashboard'))) {
      const dashboardLink = document.querySelector('.sidebar-nav .nav-link[href*="dashboard"]');
      if (dashboardLink) {
        dashboardLink.classList.add('active');
      }
    }
  }

  // Dashboard Content View Pagination (Static 100vh without Scrolling)
  function initDashboardPagination() {
    const panes = Array.from(document.querySelectorAll('.dashboard-view-pane'));
    if (!panes.length) return;

    const prevBtn = document.getElementById('dashPrevBtn');
    const nextBtn = document.getElementById('dashNextBtn');
    const pageBtns = Array.from(document.querySelectorAll('#dashboardViewPager [data-dash-page]'));
    const titleEl = document.getElementById('dashboard-pane-title');
    const badgeEl = document.getElementById('dashboard-page-badge');
    const titles = {
      1: 'Menu Pintasan & Modul Administrasi — Modul Utama',
      2: 'Menu Pintasan & Modul Administrasi — Dokumen & Sistem'
    };

    let currentDashPage = 1;
    const totalDashPages = panes.length;

    function showDashPage(pageNum) {
      currentDashPage = Math.max(1, Math.min(totalDashPages, pageNum));
      panes.forEach(pane => {
        const p = parseInt(pane.getAttribute('data-dash-pane'), 10);
        pane.classList.toggle('active', p === currentDashPage);
      });
      pageBtns.forEach(btn => {
        const p = parseInt(btn.getAttribute('data-dash-page'), 10);
        btn.classList.toggle('active', p === currentDashPage);
      });
      if (prevBtn) prevBtn.disabled = currentDashPage <= 1;
      if (nextBtn) nextBtn.disabled = currentDashPage >= totalDashPages;
      if (titleEl && titles[currentDashPage]) {
        titleEl.textContent = titles[currentDashPage];
      }
      if (badgeEl) {
        badgeEl.textContent = `Halaman ${currentDashPage} / ${totalDashPages}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentDashPage > 1) showDashPage(currentDashPage - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentDashPage < totalDashPages) showDashPage(currentDashPage + 1);
      });
    }

    pageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(btn.getAttribute('data-dash-page'), 10);
        if (target) showDashPage(target);
      });
    });

    showDashPage(1);
  }

  // Load All Data
  async function loadAllData() {
    await loadStats();
  }

  // Year Filter Event Listener
  if ($yearFilter) {
    $yearFilter.addEventListener("change", (e) => {
      const val = e.target.value;
      selectedYear = val === "all" ? "all" : parseInt(val, 10);
      loadAllData();
    });
  }

    // Initialize
    (async () => {
      updateThemeIcon();
      setActiveMenuItem();
      initDashboardPagination();
      await populateYearFilter();
      
      // Set copyright year
      const copyrightYear = document.getElementById("copyright-year");
      if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
      }

      // Set current date badge in hero
      const currentDateDisplay = document.getElementById("current-date-display");
      if (currentDateDisplay) {
        const formattedDate = new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        currentDateDisplay.textContent = `Panel Kendali • ${formattedDate}`;
      }
    })();

  }

})();
