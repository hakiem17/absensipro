<!-- File: assets/js/sb.js -->
<script>
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error("Supabase config belum terpasang (cek assets/js/config.js)");
  }
  // client global: window.sb
  window.sb = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  // tes cepat di console
  (async () => {
    const { count, error } = await sb
      .from("events")
      .select("id", { count: "exact", head: true });
    if (error) console.error("Supabase test error:", error.message);
    else console.log("Events (aktif+nonaktif) count:", count);
  })();
</script>
