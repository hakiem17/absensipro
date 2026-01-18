// Admin Common JavaScript
// File: assets/js/admin-common.js
// Sidebar dan Header functionality untuk semua halaman admin

(function() {
  'use strict';

  // Initialize theme from localStorage
  (function initTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  })();

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // DOM Elements
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleHeader = document.getElementById("theme-toggle-header");
    const btnLogout = document.getElementById("btn-logout");

    // State
    let attendanceChartInstance = null;

    // Theme Management
    function updateThemeIcon() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const icon = themeToggle?.querySelector("i");
      const iconHeader = themeToggleHeader?.querySelector("i");
      
      // Update sidebar icon: sun untuk dark mode (untuk switch ke light), moon untuk light mode (untuk switch ke dark)
      if (icon) {
        icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
      }
      
      // Update header icon: sama seperti sidebar
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
      
      // Rerender chart jika ada
      if (attendanceChartInstance && typeof window.loadChart === 'function') {
        attendanceChartInstance.destroy();
        attendanceChartInstance = null;
        window.loadChart();
      }
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
      btnLogout.addEventListener("click", () => {
        if (typeof AdminAuth !== 'undefined') {
          AdminAuth.logout();
        }
      });
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

    // Set Active Menu Item
    function setActiveMenuItem() {
      const currentPage = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
      const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && (href === currentPage || currentPage.includes(href.replace('.html', '')))) {
          link.classList.add('active');
        }
      });
    }

    // Initialize
    updateThemeIcon();
    setActiveMenuItem();
    
    // Set copyright year
    const copyrightYear = document.getElementById("copyright-year");
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear();
    }
  }

})();
