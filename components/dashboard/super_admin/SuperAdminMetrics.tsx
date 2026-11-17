"use client";

import { Building2, Users, ShieldCheck, Activity, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminMetricsResponse } from "@/schemas/community-schema";

interface SuperAdminMetricsProps {
  metrics: SuperAdminMetricsResponse;
}

export const SuperAdminMetrics = ({ metrics }: SuperAdminMetricsProps) => {
  const { kpis, communities } = metrics;

  // Cálculos derivados para enriquecer los KPIs administrativos
  const totalResidentsGlobal = communities.reduce(
    (acc, comm) => acc + (comm.residentsCount ?? 0),
    0,
  );

  const activeCommunitiesPercentage =
    kpis.communities.total > 0
      ? Math.round((kpis.communities.active / kpis.communities.total) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner Ejecutivo Superior */}
      <Card className="border-border/60 bg-linear-to-r from-card via-card to-muted/20 shadow-xs">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground tracking-tight">
                Administración Global de Plataforma
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monitoreo general de{" "}
                <span className="font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
                  {kpis.communities.total} comunidades registradas
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Comunidades */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Comunidades
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {kpis.communities.total}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {kpis.communities.active} activas
                </span>
                {kpis.communities.inactive > 0 && (
                  <span className="font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                    {kpis.communities.inactive} inactivas
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuarios del Sistema */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Usuarios SaaS
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {kpis.users.total}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {kpis.users.active} activos
                </span>
                {kpis.users.inactive > 0 && (
                  <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {kpis.users.inactive} inactivos
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residentes Totales en la Red */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Residentes Globales
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Home className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {totalResidentsGlobal}
              </span>
              <span className="text-xs text-muted-foreground">
                propiedades registradas
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Operatividad de Comunidades */}
        <Card className="border-border/60 shadow-xs hover:border-border/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tasa Operativa
            </CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {activeCommunitiesPercentage}%
              </span>
              <span className="text-xs text-muted-foreground">
                comunidades activas
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
