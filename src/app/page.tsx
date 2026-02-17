import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { PropertyCard } from "@/components/PropertyCard";
import { SITE, whatsappLink } from "@/lib/site";
import { cached, CACHE_KEYS, TTL } from "@/lib/cache";
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Banknote,
  Landmark,
  HandCoins,
  Handshake,
  Award,
  Users,
  Globe,
} from "lucide-react";

// ISR: regenerate page every 60 seconds (serves stale page while revalidating)
export const revalidate = 60;

export default async function Home() {
  const properties = await cached(CACHE_KEYS.FEATURED_PROPERTIES, TTL.MEDIUM, async () => {
    try {
      const featured = await prisma.property.findMany({
        where: { featured: true },
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      });

      if (featured.length > 0) return featured;

      return prisma.property.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      });
    } catch {
      return [];
    }
  });

  const wa = whatsappLink(
    "Hello Makanview Properties — I'd like to enquire."
  );
  const heroImage = "/qwerty.jpg";

  return (
    <div className="bg-white">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden border-b border-black/10 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.15),rgba(255,255,255,0)_55%)]" />
        <Container className="relative py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
                Dubai&apos;s Premium Real Estate
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                Premium Ready &amp; Near-Handover Properties
                <span className="text-amber-600"> in Dubai</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600">
                Curated opportunities for investors &amp; end users. {SITE.name}{" "}
                delivers a premium, professional experience for buying, selling,
                and investing in Dubai&apos;s finest real estate.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .612.616l4.528-1.469A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.712-6.27-1.928l-.438-.3-2.685.87.893-2.636-.328-.467A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    WhatsApp Enquiry
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
                  >
                    Contact Us
                  </Link>
                )}
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                >
                  Browse Properties
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10 bg-zinc-100 shadow-lg">
                <Image
                  src={heroImage}
                  alt="Dubai luxury real estate"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-amber-700">
                    Dubai • Premium Listings
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">
                    Explore verified opportunities in Business Bay, Downtown &amp;
                    more
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-40 w-40 rounded-full bg-amber-200/40 blur-2xl lg:block" />
              <div className="pointer-events-none absolute -top-8 -right-10 hidden h-48 w-48 rounded-full bg-zinc-900/10 blur-2xl lg:block" />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── BRAND VALUE PROPOSITION ─── */}
      <section className="border-b border-black/5 bg-zinc-50 py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 border border-black/5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Dubai Market Expertise
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Deep knowledge of Dubai&apos;s most sought-after communities,
                  developments, and investment zones.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 border border-black/5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Transparent Process
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Clear communication, honest guidance, and no hidden costs
                  throughout your journey.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 border border-black/5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Handshake className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  End-to-End Support
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  From first enquiry to final handover — we support you at every
                  step.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── READY & NEAR-HANDOVER FOCUS ─── */}
      <section className="border-b border-black/5 bg-white py-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Immediate Possession Available
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Ready &amp; Near-Handover
                <br />
                Properties in Dubai
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600">
                Move in today or within months. Our curated selection of ready
                apartments across Business Bay, Downtown, Dubai Marina, JVC, and
                more — ensuring immediate possession and instant rental income.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Business Bay",
                  "Downtown Dubai",
                  "Dubai Marina",
                  "JVC",
                  "Palm Jumeirah",
                  "Dubai Hills",
                ].map((loc) => (
                  <span
                    key={loc}
                    className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 ring-1 ring-black/5"
                  >
                    {loc}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/properties"
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  View Ready Properties
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6">
                <div className="text-3xl font-bold text-amber-600">100+</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">
                  Ready Apartments
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6">
                <div className="text-3xl font-bold text-amber-600">50+</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">
                  Near Handover
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6">
                <div className="text-3xl font-bold text-amber-600">7%+</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">
                  Avg. Rental Yield
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6">
                <div className="text-3xl font-bold text-amber-600">20+</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">
                  Prime Locations
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SERVICES OVERVIEW ─── */}
      <section className="border-b border-black/5 bg-zinc-50 py-16">
        <Container>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              What We Offer
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              Our Services
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600">
              Comprehensive real estate solutions tailored for Dubai&apos;s premium market.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Property Buying",
                desc: "Ready & near-handover apartments in premium Dubai locations. Curated listings, viewings, negotiation & closing support.",
              },
              {
                icon: TrendingUp,
                title: "Off-plan Investments",
                desc: "High-growth projects with flexible payment plans. Access to top developers and early-stage investment opportunities.",
              },
              {
                icon: Banknote,
                title: "Free Mortgage Consultancy",
                desc: "Home loan assistance, bank coordination, and cost-free guidance to find the best financing options.",
              },
              {
                icon: Landmark,
                title: "Property Consultancy",
                desc: "Investment advisory, market insights, portfolio planning, and strategic guidance for optimal returns.",
              },
              {
                icon: HandCoins,
                title: "Property Selling",
                desc: "Professional marketing, qualified lead management, and deal closing support to maximize your returns.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-black/5 bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition group-hover:bg-amber-100">
                  <service.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-zinc-900">
                  {service.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
            >
              View All Services
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── FEATURED PROPERTIES (Dynamic) ─── */}
      <section className="bg-white py-16">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Handpicked For You
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                Featured Properties
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Updated automatically from our curated portfolio.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 sm:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                  property={{
                  title: p.title,
                  slug: p.slug,
                  location: p.location,
                  priceAed: p.priceAed,
                  propertyType: p.propertyType,
                  bedrooms: p.bedrooms,
                  bathrooms: p.bathrooms,
                  areaSqft: p.areaSqft,
                  featured: p.featured,
                  listingType: p.listingType,
                  status: p.status,
                  images: p.images,
                }}
              />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-zinc-50 p-12 text-center text-sm text-zinc-500">
              No properties yet. Add properties from the admin panel.
            </div>
          )}
        </Container>
      </section>

      {/* ─── WHY INVEST IN DUBAI (Preview) ─── */}
      <section className="border-t border-black/5 bg-zinc-900 py-16 text-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Investment Opportunity
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why Invest in Dubai?
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400">
                Dubai offers one of the world&apos;s most attractive real estate
                investment environments — high rental yields, zero property tax,
                and a transparent regulatory framework.
              </p>
              <div className="mt-8">
                <Link
                  href="/why-invest"
                  className="inline-flex items-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-amber-400 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "7-10%", label: "Average Rental Yield" },
                { value: "0%", label: "Property Tax" },
                { value: "RERA", label: "Transparent Regulation" },
                { value: "10yr", label: "Golden Visa Eligible" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="text-2xl font-bold text-amber-400">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── TRUST INDICATORS ─── */}
      <section className="border-t border-black/5 bg-white py-16">
        <Container>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              Built on Trust &amp; Expertise
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Award className="h-6 w-6" />
              </div>
              <div className="mt-4 text-sm font-semibold text-zinc-900">
                Professional Approach
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Every client receives personalized attention with a focus on
                delivering results, not just promises.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Users className="h-6 w-6" />
              </div>
              <div className="mt-4 text-sm font-semibold text-zinc-900">
                Dubai Market Expertise
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                In-depth knowledge of Dubai&apos;s ever-evolving real estate
                landscape, communities, and opportunities.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="mt-4 text-sm font-semibold text-zinc-900">
                Investor-First Mindset
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Your investment goals drive our recommendations — transparent,
                data-backed, and tailored to your needs.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
