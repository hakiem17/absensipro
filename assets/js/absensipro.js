/* assets/js/absensipro.js — v4: seed event + storage rapi (no duplicate) */
(function (w) {
  const LS_KEY = "absensipro_v4";

  const initial = {
    events: [
      {
        id: "evt-rc-sept",
        title: "Rapat Koordinasi Bulanan September",
        datetime: "2025-09-05T13:00:00+08:00",
        location: "Ruang Rapat Utama",
        status: "active",
      },
      {
        id: "evt-sos-ppn",
        title: "Sosialisasi Peraturan Menteri PPN",
        datetime: "2025-08-30T09:00:00+08:00",
        location: "Aula Bappeda",
        status: "done",
      },
    ],
    attendees: {}, // { [eventId]: Attendee[] }
    auth: { isLoggedIn: false, email: "" },
  };

  function readRaw() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function normalize(s) {
    return {
      events:
        Array.isArray(s.events) && s.events.length
          ? s.events
          : initial.events.slice(),
      attendees:
        s.attendees && typeof s.attendees === "object" ? s.attendees : {},
      auth: Object.assign({}, initial.auth, s.auth || {}),
    };
  }
  function load() {
    const norm = normalize(readRaw());
    save(norm); // jaga bentuk tetap rapi + seed jika kosong
    return norm;
  }
  function save(state) {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  const S = {
    // helpers
    getQuery(k) {
      return new URLSearchParams(location.search).get(k);
    },
    uid(p = "id") {
      return `${p}-${Math.random().toString(36).slice(2, 9)}`;
    },
    fmtDT(iso) {
      try {
        return new Date(iso).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      } catch {
        return iso;
      }
    },

    // auth (dummy)
    login(email) {
      const s = load();
      s.auth = { isLoggedIn: true, email };
      save(s);
    },
    requireLogin(redirect = "login.html") {
      if (!load().auth.isLoggedIn) location.href = redirect;
    },

    // events
    listEvents() {
      return load()
        .events.slice()
        .sort((a, b) => (a.datetime > b.datetime ? -1 : 1));
    },
    getEvent(id) {
      return load().events.find((e) => e.id === id) || null;
    },

    // attendees
    listAttendees(eventId) {
      const s = load();
      return (s.attendees[eventId] || [])
        .slice()
        .sort((a, b) => (a.ts > b.ts ? -1 : 1));
    },
    addAttendee(eventId, attendee) {
      const s = load();
      const curr = s.attendees[eventId] || [];
      s.attendees[eventId] = [...curr, attendee];
      save(s);
    },

    // maintenance
    resetAll() {
      localStorage.removeItem(LS_KEY);
      return load();
    },
    seedIfEmpty() {
      const raw = readRaw();
      if (!Array.isArray(raw.events) || raw.events.length === 0)
        save(normalize(raw));
    },
  };

  w.AbsensiPro = S;
})(window);
