import { Container } from "@/components/Container";
import { SITE, whatsappLink } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE.name}`,
  description:
    "Get in touch with Makanview Properties for property buying, selling, and investment enquiries in Dubai.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;
  const justSent = params.sent === "1";
  const wa = whatsappLink("Hello Makanview Properties — I'd like to enquire.");

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-black/5 bg-zinc-50 py-12 sm:py-16">
      <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Get In Touch
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Contact Us
        </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Send us your requirement and we&apos;ll respond quickly. Our team
              is available to assist you with any real estate needs.
            </p>
              </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          {justSent && (
            <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
              <div className="text-sm font-semibold text-green-800">
                Thank you! Your enquiry has been submitted.
              </div>
              <p className="mt-1 text-sm text-green-700">
                Our team will get back to you as soon as possible.
              </p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
          </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:col-span-1">
              {/* WhatsApp */}
              <div className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="text-sm font-bold text-zinc-900">WhatsApp</div>
                <p className="mt-2 text-sm text-zinc-600">
                  For faster response, message us directly on WhatsApp.
              </p>
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white hover:bg-green-600 transition"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .612.616l4.528-1.469A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.712-6.27-1.928l-.438-.3-2.685.87.893-2.636-.328-.467A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Click to Chat
                </a>
              ) : (
                  <div className="mt-4 text-xs text-zinc-400">
                    WhatsApp CTA will appear when configured.
                </div>
              )}
            </div>

              {/* Contact Info */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm">
                <div className="font-bold text-zinc-900">Email</div>
                <a
                  className="mt-2 block text-zinc-600 hover:text-amber-700 transition"
                  href={`mailto:${SITE.email}`}
                >
                {SITE.email}
              </a>

                <div className="mt-6 font-bold text-zinc-900">Office Address</div>
                <div className="mt-2 text-zinc-600">{SITE.addressLine1}</div>
                <div className="text-zinc-600">{SITE.addressLine2}</div>
            </div>
          </aside>
        </div>

          {/* Google Map */}
          <div className="mt-12">
            <h2 className="text-lg font-bold text-zinc-900">Our Office</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {SITE.addressLine1}, {SITE.addressLine2}
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
              <iframe
                title="Office location"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${SITE.addressLine1}, ${SITE.addressLine2}`
                )}&output=embed`}
              />
            </div>
          </div>
      </Container>
      </section>
    </div>
  );
}
