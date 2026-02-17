import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deleteFile, isManagedUpload } from "@/lib/storage";
import { clearCache } from "@/lib/cache";

export const runtime = "nodejs";

// GET single property
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { leads: true } },
    },
  });
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(property);
}

const UpdateBody = z.object({
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  priceAed: z.number().nullable().optional(),
  propertyType: z.string().min(1).optional(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  areaSqft: z.number().nullable().optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RENTED"]).optional(),
  listingType: z.enum(["READY", "NEAR_HANDOVER", "OFF_PLAN"]).optional(),
  featured: z.boolean().optional(),
});

// UPDATE property
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = UpdateBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const property = await prisma.property.update({
    where: { id },
    data: parsed.data,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  // Clear cache so public pages reflect the change
  clearCache();

  return NextResponse.json(property);
}

// DELETE property (and its images from storage)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Remove uploaded files from storage (S3 or disk)
  for (const img of existing.images) {
    if (isManagedUpload(img.url)) {
      await deleteFile(img.url);
    }
  }

  await prisma.property.delete({ where: { id } });

  // Clear cache so public pages reflect the change
  clearCache();

  return NextResponse.json({ ok: true });
}
