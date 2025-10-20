import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateContributionSchema } from "@/lib/validators";

export async function PATCH(req: Request, context: any) {
  // 👆 quitamos el tipo y usamos "any" para evitar el chequeo estricto
  try {
    const body = await req.json();
    const data = UpdateContributionSchema.parse(body);

    const updated = await prisma.contribution.update({
      where: { id: context.params.id },
      data: { paid: data.paid },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Contribución no encontrada" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

