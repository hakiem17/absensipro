// File: assets/js/absensipro.js
(function () {
  // pastikan config & SDK sudah ada
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error("Supabase config belum ada (cek assets/js/config.js).");
    return;
  }
  if (!window.supabase || typeof supabase.createClient !== "function") {
    console.error("Supabase SDK belum termuat.");
    return;
  }

  const sb = supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
  console.log("[AbsensiPro] absensipro.js LOADED");

  // util
  function fmtDT(z) {
    try {
      return new Date(z).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return z;
    }
  }

  async function uploadSignatureFromDataURL(dataUrl, fileNamePrefix = "ttd") {
    if (!dataUrl) return null;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.split("/")[1] || "png";
    const name = `${fileNamePrefix}-${Date.now()}.${ext}`;
    const { data, error } = await sb.storage
      .from("signatures")
      .upload(name, blob, {
        contentType: blob.type,
        upsert: false,
      });
    if (error) throw error;
    const { data: pub } = sb.storage.from("signatures").getPublicUrl(data.path);
    return pub.publicUrl;
  }

  // API yang dipakai halaman
  const API = {
    fmtDT,

    async seedIfEmpty() {
      const { data, error } = await sb.from("events").select("id").limit(1);
      if (error) {
        console.warn(error);
        return;
      }
      if (!data || data.length === 0) {
        await sb.from("events").insert({
          id: "11111111-1111-1111-1111-111111111111",
          title: "Rakor Diseminasi Data 2025",
          datetime: new Date().toISOString(),
          location: "Ruang Rapat Diskominfo HST",
          status: "active",
        });
      }
    },

    async listEvents() {
      const { data, error } = await sb
        .from("events")
        .select("id, title, datetime, location, status")
        .order("datetime", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getEvent(id) {
      const { data, error } = await sb
        .from("events")
        .select("id, title, datetime, location, status")
        .eq("id", id)
        .single();
      if (error) return null;
      return data;
    },

    async listAttendees(eventId) {
      const { data, error } = await sb
        .from("attendees")
        .select("id, name, instansi, jabatan, email, phone, ts, signature_url")
        .eq("event_id", eventId)
        .order("ts", { ascending: true });
      if (error) throw error;
      return (data || []).map((a) => ({
        id: a.id,
        name: a.name,
        instansi: a.instansi,
        jabatan: a.jabatan,
        email: a.email,
        phone: a.phone,
        ts: a.ts,
        signatureDataUrl: a.signature_url || null,
      }));
    },

    async addAttendee(eventId, payload) {
      let signature_url = null;
      if (payload.signatureDataUrl?.startsWith("data:")) {
        signature_url = await uploadSignatureFromDataURL(
          payload.signatureDataUrl,
          `ev-${eventId}`
        );
      } else if (payload.signatureDataUrl) {
        signature_url = payload.signatureDataUrl;
      }
      const { error } = await sb.from("attendees").insert({
        event_id: eventId,
        name: payload.name,
        instansi: payload.instansi || "",
        jabatan: payload.jabatan || "",
        email: payload.email || "",
        phone: payload.phone || "",
        signature_url,
      });
      if (error) throw error;
      return { ok: true };
    },

    // === NEW: Realtime insert listener ===
    // Kembalikan fungsi untuk unsubscribe
    onAttendeeInserted(eventId, cb) {
      const ch = sb
        .channel(`attendees-ins-${eventId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "attendees",
            filter: `event_id=eq.${eventId}`,
          },
          (payload) => cb(payload.new)
        )
        .subscribe();
      return () => sb.removeChannel(ch);
    },
  };

  // expose
  window.AbsensiPro = API;
})();
