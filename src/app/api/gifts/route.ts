import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateGiftSchema } from "@/lib/validators";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";            // Prisma necesita Node, no Edge
export const dynamic = "force-dynamic";     // evita cache automático

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const where: any = {};
  if (month) where.month = Number(month);
  if (year) where.year = Number(year);

  const gifts = await prisma.gift.findMany({
    where,
    orderBy: [{ year: "desc" }, { month: "desc" }, { title: "asc" }],
    include: {
      payTo: true,
      contribs: {
        include: { person: true },
        orderBy: { person: { name: "asc" } },
      },
    },
  });

  const shaped = gifts.map((g) => ({
    ...g,
    contribs: g.contribs.map((c) => ({
      ...c,
      due: c.shouldPay - c.paid,
    })),
  }));

  return NextResponse.json(shaped, {
    headers: { "Cache-Control": "no-store" }, // 👈
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateGiftSchema.parse(body);

    const gift = await prisma.gift.create({
      data: {
        title: data.title,
        month: data.month, // 1..12
        year: data.year,
        totalAmount: data.totalAmount,
        payToId: data.payToId,
        notes: data.notes,
        contribs: {
          create: data.contributions.map((c) => ({
            personId: c.personId,
            shouldPay: c.shouldPay,
            paid: 0,
          })),
        },
      },
      include: {
        payTo: true,
        contribs: { include: { person: true } },
      },
    });

    // 🔁 invalidar páginas/APIs que usan estos datos
    revalidatePath("/");        // home
    revalidateTag("gifts");     // si la página usa next: { tags: ["gifts"] }

    return NextResponse.json(gift, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
