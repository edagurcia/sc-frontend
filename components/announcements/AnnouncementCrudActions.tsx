"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power, Pin } from "lucide-react";
import { AnnouncementResponse } from "@/schemas/announcement-schema";

interface Props {
  announcement: AnnouncementResponse;
  onEdit: (announcement: AnnouncementResponse) => void;
  onToggleStatus: (announcement: AnnouncementResponse) => void;
}

export const AnnouncementCrudActions = ({
  announcement,
  onEdit,
  onToggleStatus,
}: Props) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {/* Botón para editar */}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10"
        onClick={() => onEdit(announcement)}
        title="Editar anuncio"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Botón para activar/desactivar */}
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 ${
          announcement.isActive
            ? "text-amber-600 hover:bg-amber-500/10"
            : "text-emerald-600 hover:bg-emerald-500/10"
        }`}
        onClick={() => onToggleStatus(announcement)}
        title={announcement.isActive ? "Desactivar anuncio" : "Activar anuncio"}
      >
        <Power className="h-4 w-4" />
      </Button>
    </div>
  );
};
