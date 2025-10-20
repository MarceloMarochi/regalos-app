import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateContributionSchema } from "@/lib/validators";

export async function PATCH(req: Request) {
  try {
    // 🧠 Obtener el id desde la URL (Next 15 ya no pasa `context.params`)
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // obtiene el último segmento de la ruta

    if (!id) {
      return NextResponse.json({ error: "ID faltante en la URL" }, { status: 400 });
    }

    const body = await req.json();
    const data = UpdateContributionSchema.parse(body);

    const updated = await prisma.contribution.update({
      where: { id },
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
