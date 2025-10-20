"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddGiftDialog() {
  const [people, setPeople] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [total, setTotal] = useState(0);
  const [payTo, setPayTo] = useState("");
  const [contribs, setContribs] = useState<{ id: string; amount: number }[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/people")
        .then((r) => r.json())
        .then((data) => {
          setPeople(data);
          setContribs(data.map((p: any) => ({ id: p.id, amount: 0 })));
        });
    }
  }, [open]);

  const handleChangeAmount = (id: string, value: string) => {
    setContribs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount: Number(value) || 0 } : c))
    );
  };

  const createGift = async () => {
    const contributions = contribs.map((c) => ({
      personId: c.id,
      shouldPay: c.amount,
    }));

    await fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        month,
        year,
        totalAmount: total,
        payToId: payTo,
        contributions,
      }),
    });

    // Reiniciar formulario
    setTitle("");
    setTotal(0);
    setPayTo("");
    setContribs(contribs.map((c) => ({ ...c, amount: 0 })));
    setOpen(false);
  };

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Agregar regalo</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md w-[90vw] space-y-4">
        <h3 className="font-semibold text-lg">Nuevo regalo</h3>

        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label>Mes</Label>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Año</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label>Total ($)</Label>
          <Input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Transferir a</Label>
          <Select value={payTo} onValueChange={setPayTo}>
            <SelectTrigger><SelectValue placeholder="Seleccionar persona" /></SelectTrigger>
            <SelectContent>
              {people.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 border p-2 rounded-md">
          <Label>Aportes</Label>
          {people.map((p) => (
            <div key={p.id} className="flex justify-between items-center gap-2">
              <span className="w-1/2">{p.name}</span>
              <Input
                type="number"
                className="w-1/2"
                placeholder="Monto"
                value={
                  contribs.find((c) => c.id === p.id)?.amount || ""
                }
                onChange={(e) => handleChangeAmount(p.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Button className="w-full" onClick={createGift}>
          Guardar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
