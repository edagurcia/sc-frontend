"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCommunityMapAction,
  CommunityMapResponse,
} from "@/actions/dashboard/getCommunityMapAction";

export function useCommunityMap() {
  return useQuery<CommunityMapResponse, Error>({
    queryKey: ["community-map"],
    queryFn: async () => {
      const res = await getCommunityMapAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar el mapa de la comunidad");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
