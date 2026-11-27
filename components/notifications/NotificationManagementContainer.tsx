"use client";

import { useState } from "react";
import { Plus, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsList } from "./NotificationsList";
import { NotificationForm } from "./NotificationForm";
import { Modal } from "@/components/Modal";
import {
  NotificationResponse,
  NotificationFormValues,
} from "@/schemas/notification-schema";
import { useNotifications } from "@/hooks/useNotifications";

type ModalMode = "create" | "delete";

export const NotificationManagementContainer = () => {
  const {
    notifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
    isDeleting,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedNotificationForDelete, setSelectedNotificationForDelete] =
    useState<NotificationResponse | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCreate = async (values: NotificationFormValues) => {
    try {
      await sendNotification(values);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notification: NotificationResponse) => {
    try {
      await markAsRead(notification.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedNotificationForDelete) return;
    try {
      await deleteNotification(selectedNotificationForDelete.id);
      setIsOpen(false);
      setSelectedNotificationForDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setSelectedNotificationForDelete(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openDeleteModal = (notification: NotificationResponse) => {
    setSelectedNotificationForDelete(notification);
    setModalMode("delete");
    setIsOpen(true);
  };

  const getModalTitle = () => {
    if (modalMode === "create") return "Enviar Nueva Notificación";
    return "Eliminar Notificación";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Envía un aviso instantáneo a toda la comunidad o a un usuario específico.";
    return `¿Estás seguro de eliminar la notificación "${selectedNotificationForDelete?.title}"?`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllRead}
            className="cursor-pointer"
          >
            {isMarkingAllRead ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-1.5" />
            )}
            Marcar todas como leídas
          </Button>
        )}

        <Button onClick={openCreateModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Notificación
        </Button>
      </div>

      <NotificationsList
        onMarkAsRead={handleMarkAsRead}
        onDelete={openDeleteModal}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedNotificationForDelete(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "delete" ? "max-w-md" : "max-w-xl"}
      >
        {modalMode === "create" && (
          <NotificationForm
            onSubmit={handleCreate}
            onCancel={() => setIsOpen(false)}
          />
        )}

        {modalMode === "delete" && selectedNotificationForDelete && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {selectedNotificationForDelete.userId === null
                ? "Este es un aviso comunitario. Se ocultará de tu bandeja personal sin afectar a los demás residentes."
                : "Esta acción eliminará permanentemente la notificación y no se puede deshacer."}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Sí, Eliminar"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
