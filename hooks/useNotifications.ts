import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteNotificationAction,
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  sendNotificationAction,
} from "@/actions/notifications";
import { NotificationFormValues } from "@/schemas/notification-schema";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await getNotificationsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al cargar las notificaciones");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const sendMutation = useMutation({
    mutationFn: async (values: NotificationFormValues) => {
      const res = await sendNotificationAction(values);
      if (!res.success)
        throw new Error(res.error || "Error al enviar notificación");
      return res.message;
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success(msg || "Notificación enviada con éxito");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await markNotificationAsReadAction(id);
      if (!res.success)
        throw new Error(res.error || "Error al marcar como leída");
      return res.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await markAllNotificationsAsReadAction();
      if (!res.success)
        throw new Error(res.error || "Error al marcar todas como leídas");
      return res.message;
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success(msg || "Todas las notificaciones marcadas como leídas");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNotificationAction(id);
      if (!res.success)
        throw new Error(res.error || "Error al eliminar notificación");
      return res.message;
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success(msg || "Notificación eliminada");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    ...notificationsQuery,
    notifications: notificationsQuery.data ?? [],
    sendNotification: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingAllRead: markAllAsReadMutation.isPending,
    deleteNotification: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
