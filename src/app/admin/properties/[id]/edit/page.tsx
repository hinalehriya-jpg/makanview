"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";

interface PropertyImage {
  id: string;
  url: string;
  sortOrder: number;
}

interface PropertyData {
  id: string;
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

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Property not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-zinc-500">
        Loading property…
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="py-20 text-center text-sm text-red-600">
        {error || "Property not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Edit Property
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{property.title}</p>
      </div>
      <PropertyForm mode="edit" initial={property} />
    </div>
  );
}







