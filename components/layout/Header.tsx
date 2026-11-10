"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, LayoutDashboard } from "lucide-react";
import { Navbar } from "./Navbar";
import { useAuthStore } from "@/stores/auth-store";

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showLoginButton = !isAuthenticated && pathname !== "/auth/login";
  const showDashboardButton =
    isAuthenticated && !pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Oficial & Branding */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative flex h-18 w-18 items-center justify-center rounded-xl border border-border/60 bg-card p-1.5 shadow-sm transition-transform group-hover:scale-105">
            <img
              src="/logo.png"
              alt="Logo SmartCommunity"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
              SmartCommunity
            </span>
            <span className="-mt-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              GESTIÓN • COBROS • SEGURIDAD
            </span>
          </div>
        </Link>

        {/* Actions Header: Selector de tema, Botón Dashboard y Botón Login */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-xl border border-border bg-card p-2.5 text-foreground shadow-sm transition-all duration-200 hover:bg-accent"
            title="Cambiar tema Light / Dark"
            aria-label="Toggle tema"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated && <Navbar />}

          {showDashboardButton && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          {showLoginButton && (
            <Link
              href="/auth/login"
              className="cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
