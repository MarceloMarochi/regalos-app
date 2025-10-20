"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddPersonDialog() {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");

  const create = async () => {
    await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, alias }),
    });
    setName(""); setAlias("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar persona</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md w-[90vw] space-y-4">
        <Label>Nombre</Label>
        <Input value={name} onChange={e => setName(e.target.value)} />
        <Label>Alias (opcional)</Label>
        <Input value={alias} onChange={e => setAlias(e.target.value)} />
        <Button onClick={create}>Guardar</Button>
      </DialogContent>
    </Dialog>
  );
}
