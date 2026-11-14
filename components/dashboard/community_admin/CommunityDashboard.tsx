"use client";

import { useTransition } from "react";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle } from "lucide-react";
import { ResidentList } from "@/components/resident/ResidentsList";
import { useDashboardMetrics, useCommunityMap } from "@/hooks";
import { getPeriodReportHtmlAction } from "@/actions/dashboard/";
import { Metrics } from "./Metrics"; // <-- Importamos el nuevo componente

const CommunityMap = dynamic(
  () =>
    import("@/components/dashboard/community_admin/CommunityMap").then(
      (mod) => mod.CommunityMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground shadow-2xs">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Cargando mapa de la comunidad...</span>
      </div>
    ),
  },
);

export const CommunityDashboard = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const {
    data: mapData,
    isLoading: isLoadingMap,
    error: mapError,
  } = useCommunityMap();

  const [isPending, startTransition] = useTransition();

  const handleDownloadReport = () => {
    if (!metrics?.period) return;

    startTransition(async () => {
      const res = await getPeriodReportHtmlAction(metrics.period);
      if (res.success && res.html) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(res.html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 250);
        }
      } else {
        alert(res.error || "No se pudo generar el reporte");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 min-h-75">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>
          {error?.message || "Error al cargar la información del panel."}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Componente de Métricas Extraído */}
      <Metrics
        metrics={metrics}
        isPending={isPending}
        onDownloadReport={handleDownloadReport}
      />

      <div className="rounded-xl border border-border/60 bg-card p-5 shadow-2xs space-y-2">
        <ResidentList onlyDebtors={true} period={metrics.period} />
      </div>

      {isLoadingMap ? (
        <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground shadow-2xs">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando mapa de la comunidad...</span>
        </div>
      ) : mapError ? (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            {mapError.message || "Error al cargar el mapa de la comunidad."}
          </span>
        </div>
      ) : mapData ? (
        <CommunityMap data={mapData} />
      ) : null}
    </div>
  );
};
