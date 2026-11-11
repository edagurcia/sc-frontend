"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Building2, MapPin } from "lucide-react";

export const CommunityInfo = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const community = useAuthStore((state) => state.community);

  if (!isAuthenticated || !community) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2">
      <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-background/80 dark:bg-card/60 backdrop-blur-md border border-border/60 shadow-xs transition-all hover:border-primary/40">
        {/* Icono de comunidad con contenedor sutil */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-3.5 w-3.5" />
        </div>

        {/* Textos de información */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground tracking-tight truncate max-w-45 sm:max-w-xs">
              {community.name}
            </span>
            <span
              className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
              title="Comunidad activa"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-normal">
            <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
            <span className="truncate max-w-37.5 lg:max-w-50">
              {community.municipality}, {community.department}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
