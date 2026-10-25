"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { analytics } from "@/app/(common-lib)/analytics";

const DiagnosticFlow = dynamic(
  () =>
    import("@/app/(ui)/components/diagnostic-flow").then(
      (m) => m.DiagnosticFlow
    ),
  { ssr: false }
);

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
      {open && <DiagnosticFlow open={open} onClose={() => setOpen(false)} />}
    </DiagnosticContext.Provider>
  );
}
