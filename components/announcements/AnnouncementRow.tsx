"use client";

import { ReactNode } from "react";
import { Megaphone, Pin, CheckCircle2, XCircle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AnnouncementResponse } from "@/schemas/announcement-schema";

interface AnnouncementRowProps {
  announcement: AnnouncementResponse;
  actions?: ReactNode;
}

export const AnnouncementRow = ({
  announcement,
  actions,
}: AnnouncementRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {announcement.isPinned && (
            <Badge
              variant="default"
              className="gap-1 text-[10px] px-1.5 py-0.5 shrink-0"
            >
              <Pin className="h-3 w-3 fill-current" />
              Fijado
            </Badge>
          )}
          <span className="font-medium text-foreground line-clamp-1">
            {announcement.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
          {announcement.content}
        </p>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(announcement.createdAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={announcement.isActive ? "default" : "secondary"}
          className="gap-1 text-[10px]"
        >
          {announcement.isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Activo
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" /> Inactivo
            </>
          )}
        </Badge>
      </TableCell>
      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
