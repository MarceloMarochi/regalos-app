import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// DELETE /api/gifts/:id
export async function DELETE(_req: Request, { params }: Params) {
  try {
    // borro contribuciones primero para evitar FK
    await prisma.contribution.deleteMany({ where: { giftId: params.id } });
    await prisma.gift.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "No se pudo eliminar el regalo" }, { status: 500 });
  }
}
