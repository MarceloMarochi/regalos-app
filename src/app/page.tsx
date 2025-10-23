import { AddPersonDialog } from "@/components/AddPersonDialog";
import { AddGiftDialog } from "@/components/AddGiftDialog";
import { ManagePeopleDialog } from "@/components/ManagePeopleDialog";
import { YearMonthCarousel } from "@/components/YearMonthCarousel";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  // Traemos directo de DB para evitar problemas de baseUrl/caché
  const gifts = await prisma.gift.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }, { title: "asc" }],
    include: {
      payTo: true,
      contribs: { include: { person: true }, orderBy: { person: { name: "asc" } } },
    },
  });

  // mismo shape que usás en el API
  const shaped = gifts.map((g) => ({
    ...g,
    contribs: g.contribs.map((c) => ({
      ...c,
      due: c.shouldPay - c.paid,
    })),
  }));

  return (
    <main className="p-4">
      <div className="flex justify-center gap-3 mb-4">
        <AddPersonDialog />
        <AddGiftDialog />
        <ManagePeopleDialog />
      </div>
      <YearMonthCarousel gifts={shaped} />
    </main>
  );
}
