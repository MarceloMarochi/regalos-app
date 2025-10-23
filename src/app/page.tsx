import { AddPersonDialog } from "@/components/AddPersonDialog";
import { AddGiftDialog } from "@/components/AddGiftDialog";
import { ManagePeopleDialog } from "@/components/ManagePeopleDialog";
import { YearMonthCarousel } from "@/components/YearMonthCarousel";
import { getBaseUrl } from "@/lib/baseUrl";

export const revalidate = 0;                 // ⛔ ISR
export const dynamic = "force-dynamic";      // ⛔ SSG/estático

export default async function Home() {
  const base = getBaseUrl();

  let gifts: any[] = [];
  try {
    const res = await fetch(`${base}/api/gifts`, {
      cache: "no-store",
      next: { tags: ["gifts"] },             // opcional, para revalidateTag
    });
    if (res.ok) gifts = await res.json();
  } catch {
    gifts = [];
  }

  return (
    <main className="p-4">
      <div className="flex justify-center gap-3 mb-4">
        <AddPersonDialog />
        <AddGiftDialog />
        <ManagePeopleDialog />
      </div>
      <YearMonthCarousel gifts={gifts} />
    </main>
  );
}
