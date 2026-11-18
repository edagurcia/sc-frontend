"use client";

import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { NotificationResponse } from "@/schemas/notification-schema";

interface Props {
  notification: NotificationResponse;
  onMarkAsRead: (notification: NotificationResponse) => void;
  onDelete: (notification: NotificationResponse) => void;
}

export const NotificationCrudActions = ({
  notification,
  onMarkAsRead,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {!notification.isRead && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
          onClick={() => onMarkAsRead(notification)}
          title="Marcar como leída"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
        onClick={() => onDelete(notification)}
        title="Eliminar notificación"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
