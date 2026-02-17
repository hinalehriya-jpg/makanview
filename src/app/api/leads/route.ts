import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Rate limit: max 5 lead submissions per IP per 15 minutes
const RATE_LIMIT = { maxRequests: 5, windowMs: 15 * 60 * 1000 };

const Body = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  interest: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(5000).optional().or(z.literal("")),
  propertyId: z.string().max(100).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  // Rate limit check
  const ip = getClientIp(req);
  const limit = checkRateLimit(`leads:${ip}`, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Supports both JSON and form posts
  const contentType = req.headers.get("content-type") || "";
  const data =
    contentType.includes("application/json")
      ? await req.json().catch(() => ({}))
      : Object.fromEntries(await req.formData().then((fd) => fd.entries()));

  const parsed = Body.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const message =
    [parsed.data.interest, parsed.data.message].filter(Boolean).join("\n").trim() || null;

  // Resolve property title for the email
  let propertyTitle: string | null = null;
  if (parsed.data.propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: parsed.data.propertyId },
      select: { title: true },
    });
    propertyTitle = property?.title ?? null;
  }

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message,
      source: parsed.data.source || (parsed.data.propertyId ? "Property Enquiry" : "Contact Page"),
      propertyId: parsed.data.propertyId || null,
    },
  });

  // Send email notification (fire-and-forget — doesn't block the response)
  sendLeadNotification({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    propertyTitle,
    source: lead.source || "Website",
  });

  // Simple UX: redirect back to contact page on form submissions
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL("/contact?sent=1", req.url), { status: 303 });
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    }
  );
}
