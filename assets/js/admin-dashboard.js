// Admin Dashboard JavaScript
// File: assets/js/admin-dashboard.js

(function() {
  'use strict';

  // Initialize theme from localStorage
  (function initTheme() {
    const theme = localStorage.getItem("theme") || "dark";
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
    const sb = supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

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

  // Theme Management
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

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Update theme
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update icons
    updateThemeIcon();
    
    // Trigger custom event untuk komponen lain yang perlu update
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    
    // Rerender chart dengan warna tema baru
    if (attendanceChartInstance) {
      attendanceChartInstance.destroy();
      attendanceChartInstance = null;
    }
    loadChart();
  }

  // Sidebar Management
  function toggleSidebar() {
    sidebar?.classList.toggle("show");
    sidebarOverlay?.classList.toggle("show");
    document.body.style.overflow = sidebar?.classList.contains("show") ? "hidden" : "";
  }

  function hideSidebar() {
    sidebar?.classList.remove("show");
    sidebarOverlay?.classList.remove("show");
    document.body.style.overflow = "";
  }

  // Event Listeners
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", hideSidebar);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (themeToggleHeader) {
    themeToggleHeader.addEventListener("click", toggleTheme);
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => AdminAuth.logout());
  }

  // Close sidebar when clicking nav links (mobile)
  sidebar?.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        hideSidebar();
      }
    });
  });

  // Close sidebar on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar?.classList.contains("show")) {
      hideSidebar();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      hideSidebar();
    }
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

    $yearFilter.innerHTML = "";
    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === currentYear || (years.length > 0 && year === years[0])) {
        option.selected = true;
        selectedYear = year;
      }
      $yearFilter.appendChild(option);
    });

    loadAllData();
  }

  // Stats Loading
  async function loadStats() {
    try {
      const { yearStart, yearEnd } = getYearFilter();
      
      const eventsQuery = sb
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("datetime", yearStart)
        .lte("datetime", yearEnd);

      const [ev, done, act] = await Promise.all([
        eventsQuery,
        eventsQuery.eq("status", "done"),
        eventsQuery.neq("status", "done")
      ]);

      const { data: eventsInYear } = await sb
        .from("events")
        .select("id")
        .gte("datetime", yearStart)
        .lte("datetime", yearEnd);

      const eventIds = eventsInYear?.map(e => e.id) || [];
      let at = { count: 0 };
      if (eventIds.length > 0) {
        at = await sb
          .from("attendees")
          .select("*", { count: "exact", head: true })
          .in("event_id", eventIds);
      }
      
      const updateValue = (el, value) => {
        if (!el) return;
        el.textContent = "";
        const num = safeNum(value?.count || value);
        el.textContent = num.toLocaleString("id-ID");
        el.classList.add("fade-in");
      };
      
      updateValue($statEvents, ev);
      updateValue($statDone, done);
      updateValue($statActive, act);
      updateValue($statAtt, at);
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
        .limit(5);
      
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
            <div class="empty-state" style="padding: 2rem 1rem;">
              <div class="empty-state-icon">
                <i class="bi bi-calendar-x"></i>
              </div>
              <div class="empty-state-title">Tidak ada acara</div>
              <div class="empty-state-text">Belum ada acara yang akan datang</div>
            </div>
          `;
        }
        return;
      }
      
      if (!$upcoming) return;

      $upcoming.innerHTML = "";
      data.forEach((ev, index) => {
        const a = document.createElement("a");
        a.className = "list-group-item list-group-item-action fade-in";
        a.style.animationDelay = `${index * 0.1}s`;
        a.href = `admin-daftar-hadir.html?event=${encodeURIComponent(ev.id)}`;
        a.innerHTML = `
          <div class="d-flex align-items-start">
            <i class="bi bi-calendar-event me-2 mt-1 text-primary"></i>
            <div class="flex-grow-1">
              <div class="fw-semibold">${ev.title}</div>
              <small class="text-secondary">
                <i class="bi bi-clock me-1"></i>${fmtDateShort(ev.datetime)}
                ${ev.location ? `<br/><i class="bi bi-geo-alt me-1"></i>${ev.location}` : ""}
              </small>
            </div>
            <i class="bi bi-chevron-right text-secondary"></i>
          </div>
        `;
        $upcoming.appendChild(a);
      });
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
      
      const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.4)");
      
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
              borderColor: "#3b82f6",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
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
      if (href && (href === currentPage || href.includes(currentPage))) {
        link.classList.add('active');
      }
    });
    
    const hasActive = document.querySelector('.sidebar-nav .nav-link.active');
    if (!hasActive && currentPage.includes('dashboard')) {
      const dashboardLink = document.querySelector('.sidebar-nav .nav-link[href*="dashboard"]');
      if (dashboardLink) {
        dashboardLink.classList.add('active');
      }
    }
  }

  // Load All Data
  async function loadAllData() {
    await Promise.all([loadStats(), loadUpcoming(), loadChart()]);
  }

  // Year Filter Event Listener
  if ($yearFilter) {
    $yearFilter.addEventListener("change", (e) => {
      selectedYear = parseInt(e.target.value);
      loadAllData();
    });
  }

    // Initialize
    (async () => {
      updateThemeIcon();
      await populateYearFilter();
      setActiveMenuItem();
      
      // Set copyright year
      const copyrightYear = document.getElementById("copyright-year");
      if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
      }
    })();

  }

})();
