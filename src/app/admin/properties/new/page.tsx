"use client";

import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Add New Property
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the details below. The property will appear on the website
          immediately.
        </p>
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}





