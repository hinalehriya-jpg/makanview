"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PropertyImage {
  id: string;
  url: string;
  sortOrder: number;
}

interface PropertyData {
  id?: string;
  title: string;
  location: string;
  priceAed: number | null;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  description: string;
  status: string;
  listingType: string;
  featured: boolean;
  images: PropertyImage[];
}

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Studio",
  "Duplex",
  "Office",
  "Land",
  "Other",
];

export function PropertyForm({
  initial,
  mode,
}: {
  initial?: PropertyData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<PropertyImage[]>(
    initial?.images || []
  );

  const [form, setForm] = useState({
    title: initial?.title || "",
    location: initial?.location || "",
    priceAed: initial?.priceAed ?? "",
    propertyType: initial?.propertyType || "Apartment",
    bedrooms: initial?.bedrooms ?? "",
    bathrooms: initial?.bathrooms ?? "",
    areaSqft: initial?.areaSqft ?? "",
    description: initial?.description || "",
    status: initial?.status || "AVAILABLE",
    listingType: initial?.listingType || "READY",
    featured: initial?.featured || false,
  });

  function updateField(key: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title: form.title,
      location: form.location,
      priceAed: form.priceAed ? Number(form.priceAed) : null,
      propertyType: form.propertyType,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      areaSqft: form.areaSqft ? Number(form.areaSqft) : null,
      description: form.description,
      status: form.status,
      listingType: form.listingType,
      featured: form.featured,
    };

    try {
      const url =
        mode === "edit"
          ? `/api/admin/properties/${initial?.id}`
          : "/api/admin/properties";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      const result = await res.json();

      // If creating, upload queued images
      if (mode === "create" && pendingFiles.length > 0) {
        await uploadFiles(result.id, pendingFiles);
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  async function uploadFiles(propertyId: string, files: File[]) {
    const fd = new FormData();
    for (const file of files) {
      fd.append("images", file);
    }
    const res = await fetch(
      `/api/admin/properties/${propertyId}/images`,
      { method: "POST", body: fd }
    );
    if (res.ok) {
      const data = await res.json();
      // API returns { created: [...], skipped: [...], total: N }
      const newImages = data.created || data;
      setImages((prev) => [...prev, ...newImages]);
      if (data.skipped?.length > 0) {
        const msgs = data.skipped.map((s: { name: string; reason: string }) => `${s.name}: ${s.reason}`);
        alert(`Some files were skipped:\n${msgs.join("\n")}`);
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (mode === "edit" && initial?.id) {
      setUploading(true);
      uploadFiles(initial.id, files).finally(() => setUploading(false));
    } else {
      // Queue files for upload after creation
      setPendingFiles((prev) => [...prev, ...files]);
      const previews = files.map((f) => URL.createObjectURL(f));
      setPendingPreviews((prev) => [...prev, ...previews]);
    }
    e.target.value = "";
  }

  async function handleDeleteImage(imageId: string) {
    if (!initial?.id) return;
    const res = await fetch(
      `/api/admin/properties/${initial.id}/images/${imageId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500/30 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          Property Details
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Title *</span>
            <input
              required
              className={inputClass}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Luxury 2BR in Business Bay"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Location *
            </span>
            <input
              required
              className={inputClass}
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Business Bay, Dubai"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Price (AED)
            </span>
            <input
              type="number"
              className={inputClass}
              value={form.priceAed}
              onChange={(e) => updateField("priceAed", e.target.value)}
              placeholder="Leave empty for 'Price on request'"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Property Type *
            </span>
            <select
              required
              className={inputClass}
              value={form.propertyType}
              onChange={(e) => updateField("propertyType", e.target.value)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Listing Type
            </span>
            <select
              className={inputClass}
              value={form.listingType}
              onChange={(e) => updateField("listingType", e.target.value)}
            >
              <option value="READY">Ready</option>
              <option value="NEAR_HANDOVER">Near Handover</option>
              <option value="OFF_PLAN">Off-plan</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Bedrooms</span>
            <input
              type="number"
              className={inputClass}
              value={form.bedrooms}
              onChange={(e) => updateField("bedrooms", e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Bathrooms
            </span>
            <input
              type="number"
              className={inputClass}
              value={form.bathrooms}
              onChange={(e) => updateField("bathrooms", e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Area (sqft)
            </span>
            <input
              type="number"
              className={inputClass}
              value={form.areaSqft}
              onChange={(e) => updateField("areaSqft", e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Status</span>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">
              Description *
            </span>
            <textarea
              required
              rows={5}
              className={inputClass}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Detailed property description…"
            />
          </label>
          <label className="flex items-center gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-black/10 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-zinc-700">
              Mark as Featured (appears on homepage)
            </span>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Images</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Upload high-quality images (JPEG, PNG, WebP). Max 10 MB each.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-black/10 bg-zinc-100"
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute right-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
          {pendingPreviews.map((src, idx) => (
            <div
              key={`pending-${idx}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-amber-400 bg-amber-50"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute bottom-2 left-2 rounded bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
                Pending
              </div>
            </div>
          ))}
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/10 bg-zinc-50 text-zinc-500 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700">
            <span className="text-2xl">+</span>
            <span className="mt-1 text-xs font-medium">
              {uploading ? "Uploading…" : "Add Images"}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : mode === "create"
            ? "Create Property"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

