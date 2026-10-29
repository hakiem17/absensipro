// Supabase Edge Function: kirim notifikasi WhatsApp via Fonnte API
// Deploy: supabase functions deploy send-wa
// Set token: supabase secrets set FONNTE_TOKEN=your_fonnte_token

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FONNTE_API = "https://api.fonnte.com/send";

interface WaPayload {
  target: string;      // nomor HP format 62xxxxxxxxxx
  eventTitle: string;
  name?: string;
  linkDaftarAbsensi?: string;  // URL untuk melihat daftar hadir (opsional)
}

function buildMessage(p: WaPayload): string {
  const nama = p.name || "Bapak/Ibu";
  const acara = p.eventTitle || "Acara";
  let msg =
    `*Konfirmasi Absensi Kehadiran*\n\n` +
    `${nama}, terima kasih telah melakukan absensi kehadiran pada acara *${acara}*.\n\n` +
    `Data kehadiran Anda telah berhasil direkam dan tersimpan dalam sistem.\n\n`;

  if (p.linkDaftarAbsensi && p.linkDaftarAbsensi.trim()) {
    msg += `Untuk melihat daftar hadir peserta, silakan mengakses tautan berikut:\n` +
      `👉 ${p.linkDaftarAbsensi.trim()}\n\n`;
  }

  msg += `_Dinas Komunikasi, Informatika, Statistik, dan Persandian Kabupaten Hulu Sungai Tengah_`;
  return msg;
}

Deno.serve(async (req: Request) => {
  console.log("send-wa invoked:", req.method, new Date().toISOString());

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...corsHeaders, "Access-Control-Max-Age": "86400" } });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  console.log("send-wa POST received, parsing body...");

  const token = Deno.env.get("FONNTE_TOKEN");
  if (!token) {
    console.error("FONNTE_TOKEN not set");
    return new Response(
      JSON.stringify({ error: "WhatsApp notifikasi belum dikonfigurasi" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  let body: WaPayload;
  try {
    body = await req.json();
  } catch (e) {
    console.error("send-wa parse error:", e);
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const target = (body.target || "").toString().replace(/\D/g, "");
  console.log("send-wa target:", target ? target.slice(0, 4) + "****" + target.slice(-3) : "empty");
  if (!target || target.length < 10) {
    return new Response(JSON.stringify({ error: "Nomor HP tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const eventTitle = (body.eventTitle || "Acara").toString().trim();
  const name = body.name ? (body.name as string).trim() : undefined;
  const linkDaftarAbsensi = body.linkDaftarAbsensi ? (body.linkDaftarAbsensi as string).trim() : undefined;
  const message = buildMessage({ target: body.target, eventTitle, name, linkDaftarAbsensi });

  // Fonnte: target harus string. Kalau sudah 62xxx pakai countryCode 0 agar tidak diduplikasi.
  const targetStr = String(body.target).trim();
  const form = new FormData();
  form.set("target", targetStr);
  form.set("message", message);
  form.set("countryCode", targetStr.startsWith("62") ? "0" : "62");

  try {
    const res = await fetch(FONNTE_API, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: form,
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log("Fonnte response:", res.status, data);

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Fonnte API error", detail: data }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
    const fonnteOk = obj && (obj.status === true || obj.Status === true);
    if (!fonnteOk) {
      return new Response(
        JSON.stringify({ success: false, error: "Fonnte menolak pengiriman", detail: data }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const out = JSON.stringify({ success: true, data });
    return new Response(out, {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("send-wa error:", e);
    return new Response(
      JSON.stringify({ error: "Gagal mengirim WhatsApp", detail: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
