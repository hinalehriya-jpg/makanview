import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES = 20; // max files per upload batch
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// UPLOAD images for a property
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files. Maximum ${MAX_FILES} per upload.` },
      { status: 400 }
    );
  }

  const currentMax = await prisma.propertyImage.aggregate({
    where: { propertyId: id },
    _max: { sortOrder: true },
  });
  let sortOrder = (currentMax._max.sortOrder ?? -1) + 1;

  const created = [];
  const skipped = [];

  for (const file of files) {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      skipped.push({ name: file.name, reason: "Unsupported file type" });
      continue;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      skipped.push({ name: file.name, reason: "File too large (max 10 MB)" });
      continue;
    }

    // Validate file is not empty
    if (file.size === 0) {
      skipped.push({ name: file.name, reason: "Empty file" });
      continue;
    }

    try {
      // Upload to S3 (production) or disk (dev) via storage abstraction
      const result = await uploadFile(id, file);

      const image = await prisma.propertyImage.create({
        data: {
          propertyId: id,
          url: result.url,
          sortOrder: sortOrder++,
        },
      });
      created.push(image);
    } catch (err) {
      console.error(`[Upload] Failed to save ${file.name}:`, err);
      skipped.push({ name: file.name, reason: "Failed to save" });
    }
  }

  return NextResponse.json(
    { created, skipped, total: created.length },
    { status: 201 }
  );
}
