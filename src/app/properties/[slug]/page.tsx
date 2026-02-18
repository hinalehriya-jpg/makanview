import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { PropertyGallery } from "@/components/PropertyGallery";
import { formatAed } from "@/lib/utils";
import { SITE, whatsappLink } from "@/lib/site";
import { PropertyEnquiryForm } from "@/components/PropertyEnquiryForm";
import { cached, CACHE_KEYS, TTL } from "@/lib/cache";
import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;

// Pre-render all property pages at build time for instant loading
export async function generateStaticParams() {
  try {
    const properties = await prisma.property.findMany({
      select: { slug: true },
      where: { status: "AVAILABLE" },
    });
    return properties.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

const FALLBACK_IMAGE = "/demo/property-2.svg";

const LISTING_LABELS: Record<string, string> = {
  READY: "Ready",
  NEAR_HANDOVER: "Near Handover",
  OFF_PLAN: "Off-plan",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} | ${SITE.name}`,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await cached(CACHE_KEYS.propertyDetail(slug), TTL.SHORT, () =>
    prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    })
  );

  if (!property) return notFound();

  const wa = whatsappLink(
    `Hello Makanview Properties — I'd like to enquire about: ${property.title}`
  );
  const hero = property.images[0]?.url ?? FALLBACK_IMAGE;
  const allImages = property.images.length
    ? property.images
    : [{ url: hero, id: "fallback", sortOrder: 0, mediaType: "image" as const }];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <section className="border-b border-black/5 bg-zinc-50">
        <Container className="py-4">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-zinc-900 transition">
              Properties
            </Link>
            <span>/</span>
            <span className="font-medium text-zinc-700 truncate max-w-[200px]">
              {property.title}
            </span>
          </nav>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        {/* Title Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              {property.featured && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                  Featured
                </span>
              )}
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-black/5">
                {LISTING_LABELS[property.listingType] || property.listingType}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  property.status === "AVAILABLE"
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : property.status === "SOLD"
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : "bg-blue-50 text-blue-700 ring-blue-200"
                }`}
              >
                {property.status}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">{property.location}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Price
            </div>
            <div className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
              {formatAed(property.priceAed)}
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <PropertyGallery media={allImages} title={property.title} />

        {/* Content Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Type
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {property.propertyType}
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Bedrooms
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {property.bedrooms ?? "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Bathrooms
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {property.bathrooms ?? "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Area
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {property.areaSqft ? `${property.areaSqft.toLocaleString()} sqft` : "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Listing
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {LISTING_LABELS[property.listingType] || property.listingType}
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-zinc-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Status
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  {property.status}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Description</h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700">
                {property.description}
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Location</h2>
              <p className="mt-1 text-sm text-zinc-500">{property.location}</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
                <iframe
                  title="Property location"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    property.location
                  )}&output=embed`}
                />
              </div>
            </div>
          </div>

          {/* Right: Enquiry Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Quick CTA */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-900">
                  Interested in this property?
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Get in touch with our team for viewings, pricing details, and
                  more.
              </p>
              <div className="mt-5 grid gap-3">
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                  >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .612.616l4.528-1.469A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.712-6.27-1.928l-.438-.3-2.685.87.893-2.636-.328-.467A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    WhatsApp
                  </a>
                ) : null}
                  <a
                    href={`tel:${SITE.whatsappNumber}`}
                    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                >
                    Call Us
                  </a>
                </div>
              </div>

              {/* Enquiry Form */}
              <PropertyEnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
