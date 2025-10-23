"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MonthCarousel } from "./MonthCarousel";

type Gift = {
  id: string;
  title: string;
  month: number;   // 1..12
  year: number;
  // ...
};

export function YearMonthCarousel({ gifts }: { gifts: Gift[] }) {
  const currentYear = new Date().getFullYear();
  const currentMonth1to12 = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);

  // ✅ Mapa con claves 1..12 garantizadas
  const giftsByMonth = useMemo(() => {
    const map: Record<number, Gift[]> = {};
    for (let m = 1; m <= 12; m++) map[m] = [];
    for (const g of gifts) {
      if (g.year === year && g.month >= 1 && g.month <= 12) {
        map[g.month].push(g);
      }
    }
    // DEBUG opcional:
    console.log("Año seleccionado", year, "Octubre:", map[10]);
    return map;
  }, [gifts, year]);

  return (
    <section className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setYear(y => y - 1)}>◀</Button>
        <div className="text-2xl font-bold">{year}</div>
        <Button variant="outline" onClick={() => setYear(y => y + 1)}>▶</Button>
      </div>

      <MonthCarousel
        giftsByMonth={giftsByMonth}                 // 👈 1..12
        initialMonth1to12={currentMonth1to12}       // 👈 mes actual 1..12
      />
    </section>
  );
}
