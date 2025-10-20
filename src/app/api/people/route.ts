import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreatePersonSchema } from "@/lib/validators";

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(people);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreatePersonSchema.parse(body);

    const person = await prisma.person.create({ data });
    return NextResponse.json(person, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    if (err?.code === "P2002") {
      // unique constraint
      return NextResponse.json({ error: "Esa persona ya existe" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
