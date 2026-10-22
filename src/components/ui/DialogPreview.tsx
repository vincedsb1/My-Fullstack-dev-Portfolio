"use client";

import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
export default function DialogPreview() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) throw new Error("UI preview: controlled render failure");
  return (
    <div className="mt-10">
      <Button onClick={() => setOpen(true)}>Dialog</Button>
      <Button variant="secondary" onClick={() => setFailed(true)}>
        Simuler une erreur
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog"
        closeLabel="Close"
      >
        <p>Native dialog</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </div>
  );
}
