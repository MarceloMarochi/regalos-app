import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// DELETE /api/people/:id
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const referencedAsPayTo = await prisma.gift.count({ where: { payToId: params.id } });
    if (referencedAsPayTo > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar: es destinatario (payTo) de uno o más regalos. Cambiá el 'transferir a' o eliminá esos regalos primero." },
        { status: 409 }
      );
    }

    // borro aportes del usuario
    await prisma.contribution.deleteMany({ where: { personId: params.id } });
    await prisma.person.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "No se pudo eliminar la persona" }, { status: 500 });
  }
}
