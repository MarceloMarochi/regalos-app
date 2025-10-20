"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Person = { id: string; name: string; alias?: string };

export function ManagePeopleDialog() {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/people");
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const remove = async (id: string) => {
    setError(null);
    if (!confirm("¿Eliminar esta persona?")) return;
    const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload?.error ?? "No se pudo eliminar");
    } else {
      await load();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Administrar personas</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md w-[90vw] space-y-4">
        <h3 className="font-semibold text-lg">Personas</h3>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {people.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <div>
                <div className="font-medium">{p.name}</div>
                {p.alias && <div className="text-xs text-muted-foreground">{p.alias}</div>}
              </div>
              <Button variant="destructive" onClick={() => remove(p.id)}>Eliminar</Button>
            </div>
          ))}
          {people.length === 0 && <p className="text-sm text-muted-foreground">No hay personas cargadas.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
