import nodemailer from "nodemailer";

/**
 * Send an email notification. Fails silently in development
 * if SMTP env vars are not configured.
 */
async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null; // SMTP not configured — skip sending
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

interface LeadEmailData {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  propertyTitle?: string | null;
  source: string; // "Contact Page" | "Property Enquiry"
}

/**
 * Send a lead notification email to the admin.
 * Does NOT throw — failures are logged but won't break the user-facing flow.
 */
export async function sendLeadNotification(lead: LeadEmailData) {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log("[Email] SMTP not configured — skipping lead notification");
      return;
    }

    const adminEmail =
      process.env.LEAD_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (!adminEmail) return;

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    const lines = [
      `<h2 style="margin:0 0 16px; color:#18181b;">New Lead — ${lead.source}</h2>`,
      `<table style="border-collapse:collapse; width:100%; font-size:14px;">`,
      row("Name", lead.name),
      lead.email ? row("Email", `<a href="mailto:${lead.email}">${lead.email}</a>`) : "",
      lead.phone ? row("Phone", `<a href="tel:${lead.phone}">${lead.phone}</a>`) : "",
      lead.propertyTitle ? row("Property", lead.propertyTitle) : "",
      lead.message ? row("Message", lead.message.replace(/\n/g, "<br/>")) : "",
      `</table>`,
      `<p style="margin-top:20px; font-size:12px; color:#71717a;">This is an automated notification from Makanview Properties website.</p>`,
    ];

    await transporter.sendMail({
      from: `"Makanview Properties" <${fromEmail}>`,
      to: adminEmail,
      subject: `New Lead: ${lead.name}${lead.propertyTitle ? ` — ${lead.propertyTitle}` : ""}`,
      html: lines.join("\n"),
    });

    console.log(`[Email] Lead notification sent for: ${lead.name}`);
  } catch (err) {
    console.error("[Email] Failed to send lead notification:", err);
    // Don't throw — email failure should not block the lead submission
  }
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px; border-bottom:1px solid #e4e4e7; font-weight:600; color:#3f3f46; width:120px; vertical-align:top;">${label}</td>
    <td style="padding:8px 12px; border-bottom:1px solid #e4e4e7; color:#18181b;">${value}</td>
  </tr>`;
}





