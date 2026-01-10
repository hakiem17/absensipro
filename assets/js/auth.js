// assets/js/auth.js — PURE JS (tanpa <script>)

(function initSupabase() {
  if (!window.sb) {
    if (
      window.supabase?.createClient &&
      window.SUPABASE_URL &&
      window.SUPABASE_ANON_KEY
    ) {
      window.sb = supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );
    } else {
      console.error(
        "Supabase belum siap: pastikan supabase-js & config.js sudah dimuat lebih dulu."
      );
    }
  }
})();

window.AdminAuth = {
  async emailFromUsername(username) {
    const { data, error } = await sb.rpc("admin_email_for_username", {
      p_username: username,
    });
    if (error) throw error;
    return data || null;
  },

  async login(username, password) {
    const email = await this.emailFromUsername(username);
    if (!email) throw new Error("Username tidak ditemukan.");
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async requireAdmin(redirect = "login.html") {
    const { data: userData } = await sb.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) {
      location.href = redirect;
      return false;
    }
    const { data: ok } = await sb.rpc("is_admin", { uid });
    if (!ok) {
      await sb.auth.signOut();
      location.href = redirect;
      return false;
    }
    return true;
  },

  async checkIsAdmin() {
    try {
      const { data: userData } = await sb.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) {
        return false;
      }
      const { data: ok } = await sb.rpc("is_admin", { uid });
      return ok === true;
    } catch (err) {
      console.error("Error checking admin status:", err);
      return false;
    }
  },

  async logout(to = "login.html") {
    await sb.auth.signOut();
    location.href = to;
  },
};
