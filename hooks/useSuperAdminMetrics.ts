import { useQuery } from "@tanstack/react-query";
import { getSuperAdminMetricsAction } from "@/actions/dashboard/getSuperAdminMetricsAction";

export const useSuperAdminMetrics = () => {
  return useQuery({
    queryKey: ["super-admin-metrics"],
    queryFn: async () => {
      const res = await getSuperAdminMetricsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar las métricas globales");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
