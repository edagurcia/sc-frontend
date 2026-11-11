"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, DollarSign, Percent, ShieldAlert } from "lucide-react";
import {
  getDashboardMetricsAction,
  DashboardMetricsResponse,
} from "@/actions/dashboard";

export const SuperAdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardMetricsAction().then((res) => {
      if (res.success && res.data) {
        setMetrics(res.data);
      } else {
        setError(res.error || "Error al cargar métricas globales");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-sm p-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
        <ShieldAlert className="h-4 w-4 text-blue-600" />
        <span>Panel Global del Sistema (Super Admin)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-muted-foreground">
              Total Residentes Globales
            </p>
            <p className="text-2xl font-bold">{metrics?.totalResidents}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm text-muted-foreground">Recaudación General</p>
            <p className="text-xl font-bold">
              ${metrics?.totalCollectedAmount}{" "}
              <span className="text-xs text-muted-foreground">
                / ${metrics?.totalExpectedAmount}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <Percent className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm text-muted-foreground">Eficiencia de Cobro</p>
            <p className="text-2xl font-bold">
              {metrics?.collectionPercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
