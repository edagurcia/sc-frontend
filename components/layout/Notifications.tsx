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
  UserCheck,
  Loader2,
  Users,
  User,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    isLoading,
    markAsRead,
    isMarkingRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
    isDeleting,
  } = useNotifications();

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case "visit":
        return <UserCheck className="h-4 w-4 text-sky-500" />;
      case "alert":
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
      case "visit":
        return {
          label: "Visita",
          variant: "default" as const,
          className: "bg-sky-500/10 text-sky-600 border-sky-500/20",
        };
      case "alert":
      case "security":
        return {
          label: "Alerta",
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
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white animate-pulse pointer-events-none">
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
              disabled={isMarkingAllRead}
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground p-0 cursor-pointer"
            >
              {isMarkingAllRead ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Marcar leídas
            </Button>
          )}
        </div>

        <div className="flex flex-col max-h-95 overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="flex items-center justify-center h-36">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground p-4">
              <Bell className="h-7 w-7 opacity-30 mb-2" />
              <p className="text-xs font-medium">
                No tienes notificaciones pendientes
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const badge = getBadgeConfig(notif.type);
              const isCommunityWide = notif.userId === null;

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
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge
                        variant={badge.variant}
                        className={`text-[9px] px-1.5 py-0 h-4 border ${badge.className}`}
                      >
                        {badge.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 h-4 gap-1 text-muted-foreground"
                      >
                        {isCommunityWide ? (
                          <>
                            <Users className="h-2.5 w-2.5" /> Comunidad
                          </>
                        ) : (
                          <>
                            <User className="h-2.5 w-2.5" /> Personal
                          </>
                        )}
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
                        disabled={isMarkingRead}
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
                        disabled={isDeleting}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={(e) => handleDelete(notif.id, e)}
                        title={
                          isCommunityWide
                            ? "Ocultar de mi bandeja"
                            : "Eliminar notificación leída"
                        }
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
