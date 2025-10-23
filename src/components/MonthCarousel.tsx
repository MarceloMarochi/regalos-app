"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiftCard } from "./GiftCard";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

type Gift = any;
type GiftsByMonth = Record<number, Gift[]>; // 👈 claves 1..12

export function MonthCarousel({
  giftsByMonth,
  initialMonth1to12 = new Date().getMonth() + 1, // 1..12
}: {
  giftsByMonth: GiftsByMonth;
  initialMonth1to12?: number; // 1..12
}) {
  // trabajamos internamente en 0..11
  const [index, setIndex] = useState(() => {
    const m = Number(initialMonth1to12);
    return Math.min(11, Math.max(0, (isNaN(m) ? 1 : m) - 1));
  });

  const next = () => setIndex((i) => (i + 1) % 12);
  const prev = () => setIndex((i) => (i - 1 + 12) % 12);

  // Tomamos del mapa 1..12
  const gifts = useMemo(() => giftsByMonth[index + 1] ?? [], [giftsByMonth, index]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="flex gap-2 mb-3 items-center">
        <Button variant="outline" onClick={prev}>◀</Button>
        <h2 className="text-xl font-bold w-40 text-center">{MONTHS[index]}</h2>
        <Button variant="outline" onClick={next}>▶</Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mx-auto px-2 overflow-x-hidden"
        >
          {gifts.length > 0 ? (
            gifts.map((g: Gift) => <GiftCard key={g.id} gift={g} />)
          ) : (
            <p className="text-gray-500 text-center col-span-2">No hay regalos este mes.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
