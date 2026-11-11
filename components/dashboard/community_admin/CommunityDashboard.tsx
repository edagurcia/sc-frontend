"use client";

import { useTransition } from "react";
import {
  Users,
  DollarSign,
  Percent,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { getPeriodReportHtmlAction } from "@/actions/dashboard/";

export const CommunityDashboard = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-border/60 bg-linear-to-r from-card to-muted/30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Resumen de Recaudación
            </h3>
            <p className="text-xs text-muted-foreground">
              Período actual:{" "}
              <span className="font-medium text-foreground">
                {metrics.period}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Exportar Reporte PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Residentes
            </span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {metrics.totalResidents}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              ({metrics.activeResidents} activos)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Recaudado
            </span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              L. {metrics.totalCollectedAmount}
            </span>
            <span className="text-[11px] text-muted-foreground">
              de ${metrics.totalExpectedAmount} esperados
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Efectividad
            </span>
            <Percent className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {metrics.collectionPercentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              meta alcanzada
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Estado de Al día
            </span>
            <CheckCircle2 className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="text-lg">{metrics.paidResidentsCount}</span>{" "}
              Pagados
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1 font-semibold text-amber-600">
              <span className="text-lg">{metrics.pendingResidentsCount}</span>{" "}
              Pendientes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
