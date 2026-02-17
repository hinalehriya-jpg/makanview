import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile, isManagedUpload } from "@/lib/storage";

export const runtime = "nodejs";

// DELETE a single image
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;

  const image = await prisma.propertyImage.findFirst({
    where: { id: imageId, propertyId: id },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Remove file from storage (S3 or disk) — only for managed uploads
  if (isManagedUpload(image.url)) {
    await deleteFile(image.url);
  }

  await prisma.propertyImage.delete({ where: { id: imageId } });
  return NextResponse.json({ ok: true });
}
