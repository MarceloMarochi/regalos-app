import { AddPersonDialog } from "@/components/AddPersonDialog";
import { AddGiftDialog } from "@/components/AddGiftDialog";
import { ManagePeopleDialog } from "@/components/ManagePeopleDialog";
import { YearMonthCarousel } from "@/components/YearMonthCarousel"; // 👈 nuevo componente

export default async function Home() {
  // Trae todos los regalos (sin cachear)
  const res = await fetch("http://localhost:3000/api/gifts", { cache: "no-store" });
  const gifts = await res.json();

  return (
    <main className="p-4">
      {/* 🔹 Barra superior con los tres botones */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4 items-center">
        <AddPersonDialog />
        <AddGiftDialog />
        <ManagePeopleDialog />
      </div>


      {/* 🔹 Carrusel de AÑOS, que dentro muestra el de MESES */}
      <YearMonthCarousel gifts={gifts} />
    </main>
  );
}
