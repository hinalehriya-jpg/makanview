import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET all leads for admin
export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, slug: true } },
    },
  });
  return NextResponse.json(leads);
}

// DELETE a lead
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await prisma.lead.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}







