"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function GiftCard({ gift }: { gift: any }) {
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!confirm(`¿Eliminar "${gift.title}"?`)) return;
    setDeleting(true);
    await fetch(`/api/gifts/${gift.id}`, { method: "DELETE" });
    // refrescar la página/route
    window.location.reload();
  };

  return (
    <Card className="shadow-md relative w-full text-sm sm:text-base">
        <button
            onClick={remove}
            disabled={deleting}
            title="Eliminar regalo"
            className="absolute right-2 top-2 p-1 rounded hover:bg-red-50 active:scale-95 transition"
        >
            <Trash2 className="h-4 w-4 text-red-500" />
        </button>

        <CardHeader className="pb-2">
            <h3 className="font-semibold text-lg truncate">{gift.title}</h3>
        </CardHeader>

        <CardContent className="space-y-2">
            <ul className="text-sm space-y-1">
            {gift.contribs.map((c: any) => (
                <li key={c.id} className="flex justify-between">
                <span>{c.person.name}</span>
                <span className={c.due > 0 ? "text-red-600" : "text-green-600"}>
                    ${c.shouldPay}
                </span>
                </li>
            ))}
            </ul>
            <Button className="w-full mt-2" variant="secondary">
            Transferir a {gift.payTo.name}
            </Button>
        </CardContent>
        </Card>

  );
}

