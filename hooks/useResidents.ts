"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getResidentsAction,
  Resident,
} from "@/actions/residents/getResidentsAction";

export function useResidents(communityId?: string) {
  return useQuery<Resident[], Error>({
    queryKey: ["residents", communityId],
    queryFn: async () => {
      const res = await getResidentsAction(communityId);
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "Error al obtener el listado de residentes",
        );
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
