"use client";

import { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldAlert,
  UserCheck,
  Info,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NotificationResponse } from "@/schemas/notification-schema";

interface NotificationRowProps {
  notification: NotificationResponse;
  actions?: ReactNode;
}

export const NotificationRow = ({
  notification,
  actions,
}: NotificationRowProps) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "payment":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          >
            <CreditCard className="h-3 w-3" /> Pago
          </Badge>
        );
      case "visit":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] bg-sky-500/10 text-sky-600 border-sky-500/20"
          >
            <UserCheck className="h-3 w-3" /> Visita
          </Badge>
        );
      case "alert":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
          >
            <ShieldAlert className="h-3 w-3" /> Alerta
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20"
          >
            <Info className="h-3 w-3" /> Sistema
          </Badge>
        );
    }
  };

  return (
    <TableRow className={notification.isRead ? "opacity-75" : ""}>
      <TableCell>
        <div className="flex items-center gap-2">
          {getTypeBadge(notification.type)}
          <span className="font-medium text-foreground line-clamp-1">
            {notification.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
          {notification.message}
        </p>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(notification.createdAt).toLocaleDateString("es-HN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={notification.isRead ? "secondary" : "default"}
          className="gap-1 text-[10px]"
        >
          {notification.isRead ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Leída
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" /> Pendiente
            </>
          )}
        </Badge>
      </TableCell>
      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
