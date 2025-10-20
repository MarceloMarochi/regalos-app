import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/gifts/:id
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }  // ✅ tipado inline compatible con Next 15
) {
  try {
    const id = context.params.id;

    // borro contribuciones primero para evitar FK
    await prisma.contribution.deleteMany({ where: { giftId: id } });
    await prisma.gift.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo eliminar el regalo" },
      { status: 500 }
    );
  }
}
