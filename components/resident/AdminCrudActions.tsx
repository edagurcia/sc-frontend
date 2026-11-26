"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power, MapPin, User, Cpu, KeyRound } from "lucide-react";
import { Resident } from "@/schemas";

interface Props {
  resident: Resident;
  allowUserCreation?: boolean;
  onEdit: (resident: Resident) => void;
  onToggleStatus: (resident: Resident) => void;
  onManageDevices?: (resident: Resident) => void;
  onEditLocation?: (resident: Resident) => void;
  onManageUser?: (resident: Resident) => void;
  onResetPassword?: (resident: Resident) => void;
}

export const AdminCrudActions = ({
  resident,
  allowUserCreation = true,
  onEdit,
  onToggleStatus,
  onManageDevices,
  onEditLocation,
  onManageUser,
  onResetPassword,
}: Props) => {
  const hasLocation =
    resident.latitude !== null &&
    resident.latitude !== undefined &&
    resident.longitude !== null &&
    resident.longitude !== undefined;

  const hasUser = Boolean(resident.user?.id || resident.userId);

  const handleManageUser = () => {
    if (hasUser) return;
    onManageUser?.(resident);
  };

  const handleResetPassword = () => {
    if (!hasUser) return;
    if (onResetPassword) {
      onResetPassword(resident);
    } else {
      console.log("[TEMP] Reset password desde botonera:", {
        residentId: resident.id,
        userId: resident.user?.id ?? resident.userId,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {allowUserCreation && !hasUser && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          onClick={handleManageUser}
          title="Sin usuario (Clic para crear o vincular)"
        >
          <User className="h-4 w-4" />
        </Button>
      )}

      {allowUserCreation && hasUser && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
          onClick={handleResetPassword}
          title="Restablecer contraseña de usuario"
        >
          <KeyRound className="h-4 w-4" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-green-600 hover:bg-indigo-500/10"
        onClick={() => onManageDevices?.(resident)}
        title="Ver y gestionar dispositivos de seguridad"
      >
        <Cpu className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 transition-colors ${
          hasLocation
            ? "text-emerald-600 hover:bg-emerald-500/10"
            : "text-rose-600 hover:bg-rose-500/10"
        }`}
        onClick={() => onEditLocation?.(resident)}
        title={
          hasLocation
            ? "Ubicación asignada (Verde: Actualizar en el mapa)"
            : "Sin ubicación (Rojo: Asignar en el mapa)"
        }
      >
        <MapPin className="h-4 w-4" />
      </Button>

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
        className={`h-8 w-8 p-0 ${
          resident.isActive
            ? "text-amber-600 hover:bg-amber-500/10"
            : "text-emerald-600 hover:bg-emerald-500/10"
        }`}
        onClick={() => onToggleStatus(resident)}
        title={resident.isActive ? "Desactivar residente" : "Activar residente"}
      >
        <Power className="h-4 w-4" />
      </Button>
    </div>
  );
};
