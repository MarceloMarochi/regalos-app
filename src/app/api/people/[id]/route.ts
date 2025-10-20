import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/people/:id
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }  // ✅ tipado inline compatible con Next 15
) {
  try {
    const id = context.params.id;

    // verificar si la persona es payTo de algún regalo
    const referencedAsPayTo = await prisma.gift.count({ where: { payToId: id } });
    if (referencedAsPayTo > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar: es destinatario (payTo) de uno o más regalos. " +
            "Cambiá el 'transferir a' o eliminá esos regalos primero.",
        },
        { status: 409 }
      );
    }

    // borrar aportes del usuario
    await prisma.contribution.deleteMany({ where: { personId: id } });
    await prisma.person.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo eliminar la persona" },
      { status: 500 }
    );
  }
}
