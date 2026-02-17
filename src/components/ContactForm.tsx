"use client";

import { useState } from "react";

export function ContactForm() {
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
      interest: fd.get("interest") as string,
      message: fd.get("message") as string,
      source: "Contact Page",
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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-lg font-semibold text-green-800">
          Thank You!
        </div>
        <p className="mt-2 text-sm text-green-700">
          Your enquiry has been submitted. Our team will get back to you shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 rounded-xl border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition"
        >
          Send Another
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500/30 transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
    >
      <h2 className="text-lg font-bold text-zinc-900">Send Us a Message</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Fill in your details and we&apos;ll get back to you.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Name *</span>
          <input
            name="name"
            required
            className={inputClass}
            placeholder="Your full name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Phone</span>
          <input
            name="phone"
            className={inputClass}
            placeholder="+971 XX XXX XXXX"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <input
            name="email"
            type="email"
            className={inputClass}
            placeholder="your@email.com"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">
            Interested In
          </span>
          <select name="interest" className={inputClass} defaultValue="Buying">
            <option>Buying</option>
            <option>Selling</option>
            <option>Rentals</option>
            <option>Off-plan Investment</option>
            <option>Mortgage Consultancy</option>
            <option>Property Consultancy</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-zinc-700">Message</span>
        <textarea
          name="message"
          rows={5}
          className={inputClass}
          placeholder="Tell us about your requirements…"
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-5 w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition disabled:opacity-60 sm:w-auto"
      >
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}

