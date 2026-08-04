"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { DiagnosticFlow } from "@/app/(ui)/components/diagnostic-flow";
import { analytics } from "@/app/(common-lib)/analytics";

const DiagnosticContext = createContext<{ openDiagnostic: () => void }>({
  openDiagnostic: () => {},
});

export function useDiagnostic() {
  return useContext(DiagnosticContext);
}

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    analytics.init();
  }, []);

  function openDiagnostic() {
    analytics.diagnosticOpen();
    setOpen(true);
  }

  return (
    <DiagnosticContext.Provider value={{ openDiagnostic }}>
      {children}
      <DiagnosticFlow open={open} onClose={() => setOpen(false)} />
    </DiagnosticContext.Provider>
  );
}
