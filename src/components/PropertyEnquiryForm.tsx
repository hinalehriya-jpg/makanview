"use client";

import { useState } from "react";

export function PropertyEnquiryForm({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      message: `Property enquiry: ${propertyTitle}\n\n${fd.get("message") || ""}`,
      propertyId,
      source: "Property Enquiry",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <div className="text-sm font-semibold text-green-800">
          Enquiry Sent!
        </div>
        <p className="mt-2 text-sm text-green-700">
          Thank you for your interest. Our team will get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500/30 transition";

  return (
    <div className="rounded-2xl border border-black/10 bg-zinc-50 p-6">
      <h3 className="text-sm font-bold text-zinc-900">Send an Enquiry</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Fill in your details and we&apos;ll respond quickly.
      </p>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          name="name"
          required
          placeholder="Your name *"
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className={inputClass}
        />
        <input
          name="phone"
          placeholder="Phone number"
          className={inputClass}
        />
        <textarea
          name="message"
          rows={3}
          placeholder="Your message (optional)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-400 transition disabled:opacity-60"
        >
          {sending ? "Sending…" : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}

