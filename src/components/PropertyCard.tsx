"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatAed } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const FALLBACK_IMAGE = "/demo/property-1.svg";

const LISTING_LABELS: Record<string, string> = {
  READY: "Ready",
  NEAR_HANDOVER: "Near Handover",
  OFF_PLAN: "Off-plan",
};

const LISTING_COLORS: Record<string, string> = {
  READY: "bg-green-50 text-green-700 ring-green-200",
  NEAR_HANDOVER: "bg-amber-50 text-amber-700 ring-amber-200",
  OFF_PLAN: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function PropertyCard({
  property,
}: {
  property: {
    title: string;
    slug: string;
    location: string;
    priceAed: number | null;
    propertyType: string;
    bedrooms: number | null;
    bathrooms: number | null;
    areaSqft: number | null;
    featured: boolean;
    listingType?: string;
    status?: string;
    images?: { url: string; mediaType?: string }[];
  };
}) {
  const media = property.images && property.images.length > 0 
    ? property.images 
    : [{ url: FALLBACK_IMAGE, mediaType: "image" }];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.mediaType === "video";
  
  const wa = whatsappLink(
    `Hello Makanview Properties — I'd like to enquire about: ${property.title}`
  );

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/properties/${property.slug}`}>
        <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
          {isVideo ? (
            <>
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.02]"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                Video
              </div>
            </>
          ) : (
            <Image
              src={currentMedia.url}
              alt={property.title}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
            />
          )}
          
          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white z-10"
                aria-label="Previous"
              >
                <svg className="h-4 w-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white z-10"
                aria-label="Next"
              >
                <svg className="h-4 w-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Counter */}
              <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                {currentIndex + 1} / {media.length}
              </div>
            </>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {property.featured && (
              <span className="rounded-full bg-amber-200/90 px-3 py-1 text-xs font-semibold text-zinc-900 ring-1 ring-black/10">
                Featured
              </span>
            )}
            {property.listingType && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  LISTING_COLORS[property.listingType] ||
                  "bg-zinc-100 text-zinc-700 ring-zinc-200"
                }`}
              >
                {LISTING_LABELS[property.listingType] || property.listingType}
              </span>
            )}
          </div>
          {property.status && property.status !== "AVAILABLE" && (
            <div className="absolute right-3 top-3">
              <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
                {property.status}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/properties/${property.slug}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight text-zinc-900 group-hover:text-amber-700 transition">
                {property.title}
              </div>
              <div className="mt-1 text-xs text-zinc-500">{property.location}</div>
            </div>
            <div className="text-sm font-semibold text-zinc-900">
              {formatAed(property.priceAed)}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-black/5">
              {property.propertyType}
            </span>
            {property.bedrooms != null && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-black/5">
                {property.bedrooms} Bed
              </span>
            )}
            {property.bathrooms != null && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-black/5">
                {property.bathrooms} Bath
              </span>
            )}
            {property.areaSqft != null && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-black/5">
                {property.areaSqft} sqft
              </span>
            )}
          </div>
        </Link>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 rounded-xl border border-black/10 bg-white py-2 text-center text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition"
          >
            View Details
          </Link>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-zinc-900 py-2 text-center text-xs font-semibold text-white hover:bg-zinc-800 transition"
            >
              WhatsApp
            </a>
          ) : (
            <Link
              href="/contact"
              className="flex-1 rounded-xl bg-zinc-900 py-2 text-center text-xs font-semibold text-white hover:bg-zinc-800 transition"
            >
              Enquire
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
