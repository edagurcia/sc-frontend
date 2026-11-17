"use client";

import { useState } from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { useSuperAdminMetrics } from "@/hooks/useSuperAdminMetrics";
import { SuperAdminMetrics } from "./SuperAdminMetrics";
import { CommunitiesList } from "./CommunitiesList";
import { CommunitiesOverviewMap } from "./CommunitiesOverviewMap";
import { CommunityResidentsModal } from "./CommunityResidentsModal";
import { CommunityResponse } from "@/schemas/community-schema";

export const SuperAdminDashboard = () => {
  const { data: metrics, isLoading, error } = useSuperAdminMetrics();

  // Estados para controlar el modal de residentes
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunityResponse | null>(null);
  const [isResidentsModalOpen, setIsResidentsModalOpen] = useState(false);

  if (error || (!isLoading && !metrics)) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>
          {error?.message || "Error al cargar la información del panel global."}
        </span>
      </div>
    );
  }

  const communities = metrics?.communities ?? [];

  return (
    <div className="space-y-6 pb-8">
      {/* Cabecera / Título */}
      <div className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
        <ShieldAlert className="h-4 w-4 text-blue-600" />
        <span>Panel Global del Sistema (Super Admin)</span>
      </div>

      {/* KPIs Globales */}
      <SuperAdminMetrics
        metrics={
          metrics ?? {
            kpis: {
              communities: { total: 0, active: 0, inactive: 0 },
              users: { total: 0, active: 0, inactive: 0 },
            },
            communities: [],
          }
        }
      />

      {/* 1. Mapa General de Cobertura (Todos los polígonos) */}
      <CommunitiesOverviewMap communities={communities} />

      {/* 2. Tabla de Comunidades */}
      <CommunitiesList
        communities={communities}
        isLoading={isLoading}
        // Eliminamos la edición de la tabla principal y la redirigimos o reemplazamos por Ver Residentes
        onViewResidents={(community) => {
          setSelectedCommunity(community);
          setIsResidentsModalOpen(true);
        }}
        onToggleStatus={(community) => console.log("Toggle:", community.name)}
        onViewMap={(community) => console.log("Ver Mapa:", community.name)}
      />

      {/* 3. Modal de Directorio de Residentes por Comunidad */}
      <CommunityResidentsModal
        community={selectedCommunity}
        open={isResidentsModalOpen}
        onOpenChange={setIsResidentsModalOpen}
      />
    </div>
  );
};
