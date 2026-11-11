"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardMetricsAction } from "@/actions/dashboard";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await getDashboardMetricsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener las métricas");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
}
