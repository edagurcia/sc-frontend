"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getResidentDashboardAction,
  ResidentDashboardResponse,
} from "@/actions/residents/getResidentDashboardAction";

export function useResidentDashboard() {
  return useQuery<ResidentDashboardResponse, Error>({
    queryKey: ["resident-dashboard"],
    queryFn: async () => {
      const res = await getResidentDashboardAction();
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "Error al cargar el dashboard del residente",
        );
      }
      return res.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
