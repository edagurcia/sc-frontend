"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  ShieldAlert,
  Info,
  Megaphone,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "payment" | "security" | "announcement" | "info" | string;
  isRead: boolean;
  createdAt: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif123-e89b-12d3-a456-426614174000",
    userId: "usr12345-e89b-12d3-a456-426614174888",
    title: "Nuevo cargo generado",
    message:
      "Se ha generado la cuota de mantenimiento para el periodo Noviembre 2026.",
    type: "payment",
    isRead: false,
    createdAt: "2026-11-06T00:00:00.000Z",
  },
  {
    id: "notif124-e89b-12d3-a456-426614174001",
    userId: "usr12345-e89b-12d3-a456-426614174888",
    title: "Dispositivo registrado",
    message: "Su tarjeta RFID (RFID-88990011) ha sido vinculada correctamente.",
    type: "security",
    isRead: false,
    createdAt: "2026-11-05T14:30:00.000Z",
  },
  {
    id: "notif125-e89b-12d3-a456-426614174002",
    userId: "usr12345-e89b-12d3-a456-426614174888",
    title: "Mantenimiento general",
    message:
      "Este domingo se realizará mantenimiento en el portón principal de acceso.",
    type: "announcement",
    isRead: true,
    createdAt: "2026-11-04T09:15:00.000Z",
  },
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case "security":
        return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case "announcement":
        return <Megaphone className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBadgeConfig = (type: string) => {
    switch (type) {
      case "payment":
        return {
          label: "Pago",
          variant: "default" as const,
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };
      case "security":
        return {
          label: "Seguridad",
          variant: "default" as const,
          className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        };
      case "announcement":
        return {
          label: "Aviso",
          variant: "default" as const,
          className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        };
      default:
        return {
          label: "General",
          variant: "secondary" as const,
          className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        };
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse pointer-events-none">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0 rounded-2xl border border-border/60 shadow-xl bg-card overflow-hidden z-50"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              Notificaciones
            </h4>
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="text-[10px] h-5 px-1.5 bg-primary/10 text-primary border-primary/20"
              >
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground p-0 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar leídas
            </Button>
          )}
        </div>

        <div className="flex flex-col max-h-95 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground p-4">
              <Bell className="h-7 w-7 opacity-30 mb-2" />
              <p className="text-xs font-medium">
                No tienes notificaciones pendientes
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const badge = getBadgeConfig(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/50 ${
                    notif.isRead ? "bg-card opacity-75" : "bg-muted/20"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-background border border-border shrink-0 mt-0.5 shadow-2xs">
                    {getIconByType(notif.type)}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString("es-HN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={badge.variant}
                        className={`text-[9px] px-1.5 py-0 h-4 border ${badge.className}`}
                      >
                        {badge.label}
                      </Badge>
                      {!notif.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        title="Marcar como leída"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    {notif.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={(e) => handleDelete(notif.id, e)}
                        title="Eliminar notificación leída"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
