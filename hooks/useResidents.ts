"use client";

import { useQuery } from "@tanstack/react-query";
import { getResidentsAction } from "@/actions/residents/getResidentsAction";
import { Resident } from "@/schemas";

interface UseResidentsOptions {
  communityId?: string;
  onlyDebtors?: boolean;
  period?: string;
}

export function useResidents({
  communityId,
  onlyDebtors = false,
  period,
}: UseResidentsOptions = {}) {
  return useQuery<Resident[], Error>({
    queryKey: ["residents", { communityId, onlyDebtors, period }],
    queryFn: async () => {
      const res = await getResidentsAction(communityId, onlyDebtors, period);
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "Error al obtener el listado de residentes",
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
