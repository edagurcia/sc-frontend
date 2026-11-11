"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Navbar } from "./Navbar";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "./ThemeToggle";
import { CommunityInfo } from "./CommunityInfo";

export const Header = () => {
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const showLoginButton = !isAuthenticated && pathname !== "/auth/login";
  const showDashboardButton =
    isAuthenticated && !pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
      <div className="relative mx-auto flex h-auto min-h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-border/60 bg-card p-1.5 shadow-sm transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo SmartCommunity"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-lg sm:text-xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
                SmartCommunity
              </span>
              <span className="-mt-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                GESTIÓN • COBROS • SEGURIDAD
              </span>
            </div>
          </Link>

          <CommunityInfo />
        </div>

        <div className="flex items-center gap-3 z-10">
          <ThemeToggle />

          {isAuthenticated && <Navbar />}

          {showDashboardButton && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {showLoginButton && (
            <Link
              href="/auth/login"
              className="cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
