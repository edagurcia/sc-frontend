"use client";

import {
  Users,
  DollarSign,
  Percent,
  Download,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface MetricsProps {
  metrics: {
    period: string;
    totalResidents: number;
    activeResidents: number;
    totalCollectedAmount: number | string;
    totalExpectedAmount: number | string;
    collectionPercentage: number | string;
    paidResidentsCount: number;
    pendingResidentsCount: number;
  };
  isPending: boolean;
  onDownloadReport: () => void;
}

export const Metrics = ({
  metrics,
  isPending,
  onDownloadReport,
}: MetricsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-linear-to-r from-card via-card to-muted/20 shadow-xs">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground tracking-tight">
                Resumen de Recaudación
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Período fiscal actual:{" "}
                <span className="font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
                  {metrics.period}
                </span>
              </p>
            </div>
          </div>

          <Button
            onClick={onDownloadReport}
            disabled={isPending}
            size="sm"
            className="gap-2 font-semibold shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Exportar Reporte PDF</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Residentes
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {metrics.totalResidents}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {metrics.activeResidents} activos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recaudado */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recaudado
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-foreground truncate">
                {formatCurrency(metrics.totalCollectedAmount)}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                de {formatCurrency(metrics.totalExpectedAmount)} esperados
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Efectividad */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Efectividad
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {metrics.collectionPercentage}%
              </span>
              <span className="text-xs text-muted-foreground">
                meta alcanzada
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Estado Al Día */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Estado de Al Día
            </CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2.5 text-xs pt-1">
              <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                <span className="text-sm font-bold">
                  {metrics.paidResidentsCount}
                </span>{" "}
                Pagados
              </div>
              <div className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                <span className="text-sm font-bold">
                  {metrics.pendingResidentsCount}
                </span>{" "}
                Pendientes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
