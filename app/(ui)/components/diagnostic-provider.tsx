"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { DiagnosticFlow } from "@/app/(ui)/components/diagnostic-flow";

const DiagnosticContext = createContext<{ openDiagnostic: () => void }>({
  openDiagnostic: () => {},
});

export function useDiagnostic() {
  return useContext(DiagnosticContext);
}

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DiagnosticContext.Provider value={{ openDiagnostic: () => setOpen(true) }}>
      {children}
      <DiagnosticFlow open={open} onClose={() => setOpen(false)} />
    </DiagnosticContext.Provider>
  );
}
