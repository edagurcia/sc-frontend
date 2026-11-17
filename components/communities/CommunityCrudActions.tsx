"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power } from "lucide-react";
import { CommunityResponse } from "@/schemas/community-schema";

interface Props {
  community: CommunityResponse;
  onEdit: (community: CommunityResponse) => void;
  onToggleStatus: (community: CommunityResponse) => void;
}

export const CommunityCrudActions = ({
  community,
  onEdit,
  onToggleStatus,
}: Props) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10"
        onClick={() => onEdit(community)}
        title="Editar comunidad y polígono"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 ${
          community.isActive
            ? "text-amber-600 hover:bg-amber-500/10"
            : "text-emerald-600 hover:bg-emerald-500/10"
        }`}
        onClick={() => onToggleStatus(community)}
        title={
          community.isActive ? "Desactivar comunidad" : "Activar comunidad"
        }
      >
        <Power className="h-4 w-4" />
      </Button>
    </div>
  );
};
