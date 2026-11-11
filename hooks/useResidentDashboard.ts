"use client";

import { useQuery } from "@tanstack/react-query";
import { getResidentDashboardAction } from "@/actions/dashboard";

export function useResidentDashboard() {
  return useQuery({
    queryKey: ["resident-dashboard"],
    queryFn: async () => {
      const res = await getResidentDashboardAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener el estado de cuenta");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
