"use client";

import { useState } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  mediaType?: string;
  sortOrder: number;
}

export function PropertyGallery({
  media,
  title,
}: {
  media: MediaItem[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMedia = media[selectedIndex];
  const hasMultipleMedia = media.length > 1;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-8">
      {/* Main Display */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-black/10 bg-zinc-100 sm:aspect-[16/8] group">
        {selectedMedia?.mediaType === "video" ? (
          <video
            key={selectedMedia.url}
            src={selectedMedia.url}
            className="absolute inset-0 h-full w-full object-contain bg-black"
            controls
            playsInline
          />
        ) : (
          <Image
            src={selectedMedia?.url || "/demo/property-2.svg"}
            alt={title}
            fill
            className="object-contain"
            priority={selectedIndex === 0}
          />
        )}

        {/* Navigation Arrows - Only show if multiple media */}
        {hasMultipleMedia && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white"
              aria-label="Previous"
            >
              <svg className="h-5 w-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white"
              aria-label="Next"
            >
              <svg className="h-5 w-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - Only show if multiple media */}
      {hasMultipleMedia && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {media.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl border bg-zinc-100 transition ${
                selectedIndex === idx
                  ? "border-amber-500 ring-2 ring-amber-500/30"
                  : "border-black/10 hover:border-amber-400"
              }`}
            >
              {item.mediaType === "video" ? (
                <>
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              ) : (
                <Image
                  src={item.url}
                  alt={`${title} image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
