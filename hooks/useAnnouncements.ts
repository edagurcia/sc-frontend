import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnnouncementsAction,
  getDashboardAnnouncementsAction,
  createAnnouncementAction,
  updateAnnouncementAction,
  toggleAnnouncementStatusAction,
} from "@/actions/announcements";
import { AnnouncementFormValues } from "@/schemas/announcement-schema";

export const ANNOUNCEMENTS_QUERY_KEY = ["announcements"];
export const DASHBOARD_ANNOUNCEMENTS_KEY = ["dashboard-announcements"];

export const useAnnouncements = (options?: {
  limit?: number;
  dashboardOnly?: boolean;
}) => {
  const queryClient = useQueryClient();
  const limit = options?.limit ?? 3;
  const isDashboard = options?.dashboardOnly ?? false;

  // 1. Query dinámico según el contexto (Dashboard vs CRUD Admin)
  const query = useQuery({
    queryKey: isDashboard
      ? [...DASHBOARD_ANNOUNCEMENTS_KEY, limit]
      : ANNOUNCEMENTS_QUERY_KEY,
    queryFn: async () => {
      const res = isDashboard
        ? await getDashboardAnnouncementsAction(limit)
        : await getAnnouncementsAction();

      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar los anuncios");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // 2. Mutación para crear anuncio
  const createMutation = useMutation({
    mutationFn: async (values: AnnouncementFormValues) => {
      const res = await createAnnouncementAction(values);
      if (!res.success)
        throw new Error(res.error || "Error al crear el anuncio");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_ANNOUNCEMENTS_KEY });
    },
  });

  // 3. Mutación para actualizar anuncio
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<AnnouncementFormValues>;
    }) => {
      const res = await updateAnnouncementAction(id, values);
      if (!res.success)
        throw new Error(res.error || "Error al actualizar el anuncio");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_ANNOUNCEMENTS_KEY });
    },
  });

  // 4. Mutación para alternar estatus (Activo / Inactivo)
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await toggleAnnouncementStatusAction(id, isActive);
      if (!res.success) throw new Error(res.error || "Error al cambiar estado");
      return res.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_ANNOUNCEMENTS_KEY });
    },
  });

  return {
    ...query,
    announcements: query.data ?? [],
    createAnnouncement: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAnnouncement: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
  };
};
