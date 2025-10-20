"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MonthCarousel } from "./MonthCarousel";

type Gift = any;

export function YearMonthCarousel({ gifts }: { gifts: Gift[] }) {
  // Agrupar por año y mes
  const data = useMemo(() => {
    const byYear: Record<number, Record<number, Gift[]>> = {};
    for (const g of gifts) {
      if (!byYear[g.year]) byYear[g.year] = {};
      if (!byYear[g.year][g.month]) byYear[g.year][g.month] = [];
      byYear[g.year][g.month].push(g);
    }
    return byYear;
  }, [gifts]);

  const years = useMemo(
    () => Object.keys(data).map(Number).sort((a, b) => b - a), // años desc
    [data]
  );

  const [yearIdx, setYearIdx] = useState(
    Math.max(0, years.findIndex((y) => y === new Date().getFullYear()))
  );
  const year = years.length ? years[yearIdx] : new Date().getFullYear();

  const nextYear = () => setYearIdx((i) => (i + 1) % years.length);
  const prevYear = () => setYearIdx((i) => (i - 1 + years.length) % years.length);

  return (
    <div className="w-full">
      {/* Barra de navegación por AÑO */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Button variant="outline" disabled={!years.length} onClick={prevYear}>◀</Button>
        <h1 className="text-2xl font-bold w-40 text-center">
          {years.length ? year : new Date().getFullYear()}
        </h1>
        <Button variant="outline" disabled={!years.length} onClick={nextYear}>▶</Button>
      </div>

      {/* Carrusel de MESES para el año seleccionado */}
      <MonthCarousel giftsByMonth={data[year] ?? {}} />
    </div>
  );
}
