"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power, Trash2 } from "lucide-react";
import { Resident } from "@/actions/residents/getResidentsAction";

interface Props {
  resident: Resident;
  onEdit: (resident: Resident) => void;
  onToggleStatus: (resident: Resident) => void;
  onDelete: (resident: Resident) => void;
}

export const AdminCrudActions = ({
  resident,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10"
        onClick={() => onEdit(resident)}
        title="Editar residente"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 ${resident.isActive ? "text-amber-600 hover:bg-amber-500/10" : "text-emerald-600 hover:bg-emerald-500/10"}`}
        onClick={() => onToggleStatus(resident)}
        title={resident.isActive ? "Desactivar" : "Activar"}
      >
        <Power className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
        onClick={() => onDelete(resident)}
        title="Eliminar residente"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
