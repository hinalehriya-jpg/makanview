import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { PropertyCard } from "@/components/PropertyCard";
import { whatsappLink } from "@/lib/site";
import { cached, CACHE_KEYS, TTL } from "@/lib/cache";
import type { Metadata } from "next";

// ISR: regenerate every 30 seconds
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Properties | Makanview Properties",
  description:
    "Browse premium properties in Dubai — apartments, villas, penthouses. Ready, near handover, and off-plan options available.",
};

const LISTING_FILTERS = [
  { label: "All", value: "" },
  { label: "Ready", value: "READY" },
  { label: "Near Handover", value: "NEAR_HANDOVER" },
  { label: "Off-plan", value: "OFF_PLAN" },
];

const STATUS_FILTERS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Sold", value: "SOLD" },
  { label: "Rented", value: "RENTED" },
];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const listingFilter = params.listing || "";
  const statusFilter = params.status || "AVAILABLE";
  const typeFilter = params.type || "";

  const where: Record<string, unknown> = {};
  if (listingFilter && ["READY", "NEAR_HANDOVER", "OFF_PLAN"].includes(listingFilter)) {
    where.listingType = listingFilter;
  }
  if (statusFilter && ["AVAILABLE", "SOLD", "RENTED"].includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (typeFilter) {
    where.propertyType = typeFilter;
  }

  const cacheKey = CACHE_KEYS.propertiesListing(`${listingFilter}:${statusFilter}:${typeFilter}`);

  const properties = await cached(cacheKey, TTL.SHORT, async () => {
    try {
      return await prisma.property.findMany({
        where,
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        take: 60,
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      });
    } catch {
      return [];
    }
  });

  // Get unique property types for filter (cached longer — rarely changes)
  const propertyTypes = await cached(CACHE_KEYS.ALL_PROPERTY_TYPES, TTL.LONG, async () => {
    try {
      const allTypes = await prisma.property.findMany({
        select: { propertyType: true },
        distinct: ["propertyType"],
      });
      return allTypes.map((t) => t.propertyType);
    } catch {
      return [];
    }
  });

  const wa = whatsappLink(
    "Hello Makanview Properties — I'm looking for properties in Dubai."
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-black/5 bg-zinc-50 py-12">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Browse Listings
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Properties in Dubai
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                {properties.length} propert{properties.length === 1 ? "y" : "ies"} found
              </p>
            </div>
            <div className="flex gap-2">
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  WhatsApp
                </a>
              ) : null}
              <Link
                href="/contact"
                className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Enquire
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-6">
            {/* Listing Type Filter */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Listing Type
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LISTING_FILTERS.map((f) => (
                  <Link
                    key={f.value}
                    href={`/properties?listing=${f.value}&status=${statusFilter}&type=${typeFilter}`}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      listingFilter === f.value
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-700 ring-1 ring-black/10 hover:bg-zinc-100"
                    }`}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Status
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((f) => (
                  <Link
                    key={f.value}
                    href={`/properties?listing=${listingFilter}&status=${f.value}&type=${typeFilter}`}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      statusFilter === f.value
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-700 ring-1 ring-black/10 hover:bg-zinc-100"
                    }`}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Property Type Filter */}
            {propertyTypes.length > 1 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Type
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href={`/properties?listing=${listingFilter}&status=${statusFilter}&type=`}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      !typeFilter
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-700 ring-1 ring-black/10 hover:bg-zinc-100"
                    }`}
                  >
                    All
                  </Link>
                  {propertyTypes.map((t) => (
                    <Link
                      key={t}
                      href={`/properties?listing=${listingFilter}&status=${statusFilter}&type=${t}`}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                        typeFilter === t
                          ? "bg-zinc-900 text-white"
                          : "bg-white text-zinc-700 ring-1 ring-black/10 hover:bg-zinc-100"
                      }`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Property Grid */}
      <section className="py-12">
        <Container>
          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 bg-zinc-50 p-16 text-center">
              <div className="text-sm text-zinc-500">
                No properties match your filters.{" "}
                <Link
                  href="/properties"
                  className="font-medium text-amber-600 hover:underline"
                >
                  Clear all filters
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
