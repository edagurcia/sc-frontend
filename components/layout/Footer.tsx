"use client";

import { useState, useEffect } from "react";

export const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card p-1 shadow-sm">
              <img
                src="/logo.png"
                alt="Logo SmartCommunity"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent dark:from-blue-400 dark:to-indigo-300">
              SmartCommunity
            </span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} SmartCommunity. Todos los derechos reservados.
            Administración de Recaudaciones y Garitas.
          </p>

          <div className="flex gap-6 text-xs text-muted-foreground">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Términos
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Privacidad
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
