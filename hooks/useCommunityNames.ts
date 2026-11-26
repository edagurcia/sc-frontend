"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getCommunityByIdAction } from "@/actions/community/getCommunityByIdAction";

export function useCommunityNames(communityIds: string[]) {
  const uniqueIds = useMemo(
    () => Array.from(new Set(communityIds.filter(Boolean))),
    [communityIds],
  );

  const queries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ["community", id],
      queryFn: async () => {
        const res = await getCommunityByIdAction(id);
        if (!res.success || !res.data) {
          throw new Error(res.error || "Error al cargar comunidad");
        }
        return res.data;
      },
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    })),
  });

  const communityMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    queries.forEach((query, index) => {
      const id = uniqueIds[index];
      if (query.data?.name) {
        map[id] = query.data.name;
      }
    });
    return map;
  }, [queries, uniqueIds]);

  const isLoadingCommunities = queries.some((q) => q.isLoading);

  return { communityMap, isLoadingCommunities };
}
