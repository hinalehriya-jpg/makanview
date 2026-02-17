import Link from "next/link";
import { Container } from "@/components/Container";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  const wa = whatsappLink("Hello Makanview Properties — I'd like to enquire.");

  return (
    <footer className="border-t border-black/10 bg-zinc-900 text-zinc-400">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              {SITE.name}
            </div>
            <p className="mt-3 text-sm leading-6">{SITE.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Quick Links
            </div>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
              <Link href="/services" className="hover:text-white transition">
                Services
              </Link>
              <Link href="/properties" className="hover:text-white transition">
                Properties
              </Link>
              <Link href="/why-invest" className="hover:text-white transition">
                Why Invest in Dubai
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </nav>
          </div>

          {/* Office */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Office
            </div>
            <div className="mt-4 text-sm leading-6">
              <div>{SITE.addressLine1}</div>
              <div>{SITE.addressLine2}</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Contact
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <a
                className="block hover:text-white transition"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .612.616l4.528-1.469A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.712-6.27-1.928l-.438-.3-2.685.87.893-2.636-.328-.467A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </div>
          <div>Dubai, UAE</div>
        </div>
      </Container>
    </footer>
  );
}
