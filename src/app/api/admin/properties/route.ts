import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clearCache } from "@/lib/cache";

export const runtime = "nodejs";

// GET all properties for admin
export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { leads: true } },
    },
  });
  return NextResponse.json(properties);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

const CreateBody = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  location: z.string().min(1),
  priceAed: z.number().nullable().optional(),
  propertyType: z.string().min(1),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  areaSqft: z.number().nullable().optional(),
  description: z.string().min(1),
  status: z.enum(["AVAILABLE", "SOLD", "RENTED"]).default("AVAILABLE"),
  listingType: z.enum(["READY", "NEAR_HANDOVER", "OFF_PLAN"]).default("READY"),
  featured: z.boolean().default(false),
});

// CREATE a new property
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  let slug = data.slug ? slugify(data.slug) : slugify(data.title);

  // Ensure unique slug
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const property = await prisma.property.create({
    data: {
      title: data.title,
      slug,
      location: data.location,
      priceAed: data.priceAed ?? null,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      areaSqft: data.areaSqft ?? null,
      description: data.description,
      status: data.status,
      listingType: data.listingType,
      featured: data.featured,
    },
    include: { images: true },
  });

  // Clear cache so public pages reflect the change
  clearCache();

  return NextResponse.json(property, { status: 201 });
}

