import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunitiesAction,
  getCommunityByIdAction,
  createCommunityAction,
  updateCommunityAction,
  toggleCommunityStatusAction,
} from "@/actions/community";
import {
  CreateCommunityInput,
  UpdateCommunityInput,
} from "@/schemas/community-schema";

export const COMMUNITIES_QUERY_KEY = ["communities"];

export const useCommunities = () => {
  const queryClient = useQueryClient();

  // 1. Query para listar todas las comunidades
  const communitiesQuery = useQuery({
    queryKey: COMMUNITIES_QUERY_KEY,
    queryFn: async () => {
      const res = await getCommunitiesAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar las comunidades");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // 2. Mutación para crear comunidad
  const createMutation = useMutation({
    mutationFn: async (values: CreateCommunityInput) => {
      const res = await createCommunityAction(values);
      if (!res.success)
        throw new Error(res.error || "Error al crear la comunidad");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["super-admin-metrics"] });
    },
  });

  // 3. Mutación para actualizar comunidad
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: UpdateCommunityInput;
    }) => {
      const res = await updateCommunityAction(id, values);
      if (!res.success)
        throw new Error(res.error || "Error al actualizar la comunidad");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["super-admin-metrics"] });
    },
  });

  // 4. Mutación para alternar estatus (Activa / Inactiva)
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleCommunityStatusAction(id);
      if (!res.success) throw new Error(res.error || "Error al cambiar estado");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["super-admin-metrics"] });
    },
  });

  return {
    ...communitiesQuery,
    communities: communitiesQuery.data ?? [],
    createCommunity: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCommunity: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
  };
};

// Hook auxiliar para consultar una comunidad individual (útil para edición)
export const useCommunityDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["community", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getCommunityByIdAction(id);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener la comunidad");
      }
      return res.data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};
