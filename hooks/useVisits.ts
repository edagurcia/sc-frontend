import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVisitorsAction,
  createVisitorAction,
  updateVisitorAction,
  toggleVisitorStatusAction,
} from "@/actions/visits";
import { VisitFormValues } from "@/schemas/visit-schema";

export const VISITS_QUERY_KEY = ["resident-visits"];

export const useVisits = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: VISITS_QUERY_KEY,
    queryFn: async () => {
      const res = await getVisitorsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar las visitas");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: async (values: VisitFormValues) => {
      const res = await createVisitorAction(values);
      if (!res.success) {
        throw new Error(res.error || "Error al registrar la visita");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<VisitFormValues>;
    }) => {
      const res = await updateVisitorAction(id, values);
      if (!res.success) {
        throw new Error(res.error || "Error al actualizar la visita");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITS_QUERY_KEY });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await toggleVisitorStatusAction(id, isActive);
      if (!res.success) {
        throw new Error(res.error || "Error al cambiar estado del acceso");
      }
      return res.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITS_QUERY_KEY });
    },
  });

  return {
    ...query,
    visits: query.data ?? [],
    createVisit: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateVisit: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
  };
};
