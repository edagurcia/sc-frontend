"use client";

import { useEffect, useState } from "react";
import { Loader2, Home, CreditCard, Calendar } from "lucide-react";
import {
  getResidentDashboardAction,
  ResidentDashboardResponse,
} from "@/actions/dashboard";

export const ResidentDashboard = () => {
  const [data, setData] = useState<ResidentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getResidentDashboardAction().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Error al cargar estado de cuenta");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-muted-foreground">Casa / Dirección</p>
            <p className="text-lg font-bold">#{data?.resident.houseNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm text-muted-foreground">Cuota Mensual</p>
            <p className="text-xl font-bold">${data?.resident.monthlyFee}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-2xs">
          <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm text-muted-foreground">Año Fiscal</p>
            <p className="text-xl font-bold">{data?.year}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
