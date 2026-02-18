"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatAed } from "@/lib/utils";

interface PropertyImage {
  id: string;
  url: string;
  sortOrder: number;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  priceAed: number | null;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  status: string;
  listingType: string;
  featured: boolean;
  images: PropertyImage[];
  _count: { leads: number };
  createdAt: string;
  updatedAt: string;
}

const LISTING_LABELS: Record<string, string> = {
  READY: "Ready",
  NEAR_HANDOVER: "Near Handover",
  OFF_PLAN: "Off-plan",
};

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
    }
  }

  const totalProperties = properties.length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const totalLeads = properties.reduce((sum, p) => sum + p._count.leads, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
            </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your property listings
            </p>
          </div>
          <Link
          href="/admin/properties/new"
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
          >
          + Add Property
          </Link>
        </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total Properties
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">
            {totalProperties}
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Featured
                </div>
          <div className="mt-2 text-3xl font-bold text-amber-600">
            {featuredCount}
                </div>
              </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total Leads
              </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">
            {totalLeads}
          </div>
          </div>
        </div>

      {/* Properties Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Leads</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-zinc-500">
                    No properties yet.{" "}
                    <Link href="/admin/properties/new" className="font-medium text-amber-600 hover:underline">
                      Add your first property
                    </Link>
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          <Image
                            src={p.images[0]?.url || "/demo/property-1.svg"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">{p.title}</div>
                          <div className="text-xs text-zinc-400">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{p.location}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {formatAed(p.priceAed)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {LISTING_LABELS[p.listingType] || p.listingType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.status === "AVAILABLE"
                            ? "bg-green-50 text-green-700"
                            : p.status === "SOLD"
                            ? "bg-red-50 text-red-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(p.id, p.featured)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                          p.featured
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        }`}
                      >
                        {p.featured ? "★ Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-600">
                      {p._count.leads}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/properties/${p.id}/edit`}
                          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
