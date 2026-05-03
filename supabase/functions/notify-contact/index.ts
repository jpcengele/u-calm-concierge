// Edge Function: notify-contact
// Triggered by a Supabase Database Webhook on INSERT into contact_inquiries.
// Sends an email notification to jp@u-calm.com via Resend so J-P sees new inquiries
// in his Gmail inbox immediately.
//
// Environment secrets required (set in Supabase → Project Settings → Edge Functions → Secrets):
//   RESEND_API_KEY  — the `re_...` key from the u-calm Resend account, "u-calm-concierge" key

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = "jp@u-calm.com";
// Until u-calm.com is verified as a sending domain in Resend, use the default
// onboarding@resend.dev sender. Reply-To is set to the inquirer so J-P can reply
// directly from Gmail and reach the original submitter.
const FROM_EMAIL = "U-CALM Concierge <onboarding@resend.dev>";

interface InquiryRecord {
  id?: string;
  name: string;
  email: string;
  message?: string;
  created_at?: string;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: InquiryRecord;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!RESEND_API_KEY) {
    return new Response("RESEND_API_KEY not configured", { status: 500 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const record = payload?.record;
  if (!record || !record.email || !record.name) {
    return new Response("Missing required fields in record", { status: 400 });
  }

  const submittedAt = record.created_at
    ? new Date(record.created_at).toLocaleString("en-GB", { timeZone: "Europe/Zurich" })
    : new Date().toLocaleString("en-GB", { timeZone: "Europe/Zurich" });

  const html = `
    <h2 style="font-family: Georgia, serif; color: #1a4d4d;">New U-CALM contact inquiry</h2>
    <table style="font-family: Arial, sans-serif; border-collapse: collapse;">
      <tr><td style="padding: 8px 16px 8px 0;"><strong>Name:</strong></td><td>${escapeHtml(record.name)}</td></tr>
      <tr><td style="padding: 8px 16px 8px 0;"><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(record.email)}">${escapeHtml(record.email)}</a></td></tr>
      <tr><td style="padding: 8px 16px 8px 0;"><strong>Submitted:</strong></td><td>${submittedAt} (Europe/Zurich)</td></tr>
    </table>
    <h3 style="font-family: Arial, sans-serif; color: #1a4d4d; margin-top: 24px;">Message</h3>
    <p style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(record.message || "(no message provided)")}</p>
    <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;">
    <p style="font-family: Arial, sans-serif; color: #888; font-size: 12px;">
      Submitted via u-calm.com contact form. Reply directly to this email to respond to the inquirer.<br>
      Inquiry ID: ${escapeHtml(record.id || "unknown")}
    </p>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: record.email,
      subject: `New U-CALM inquiry — ${record.name}`,
      html,
    }),
  });

  if (!resendRes.ok) {
    const errorText = await resendRes.text();
    console.error("Resend API error:", resendRes.status, errorText);
    return new Response(`Resend error: ${errorText}`, { status: 502 });
  }

  const result = await resendRes.json();
  return new Response(JSON.stringify({ success: true, resend_id: result.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
