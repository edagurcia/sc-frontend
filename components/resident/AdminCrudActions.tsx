"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power, Shield, MapPin, User } from "lucide-react";
import { Resident } from "@/schemas";

interface Props {
  resident: Resident;
  allowUserCreation?: boolean;
  onEdit: (resident: Resident) => void;
  onToggleStatus: (resident: Resident) => void;
  onManageDevices?: (resident: Resident) => void;
  onEditLocation?: (resident: Resident) => void;
  onManageUser?: (resident: Resident) => void;
}

export const AdminCrudActions = ({
  resident,
  allowUserCreation = true,
  onEdit,
  onToggleStatus,
  onManageDevices,
  onEditLocation,
  onManageUser,
}: Props) => {
  // Verifica si ya cuenta con georreferenciación activa
  const hasLocation =
    resident.latitude !== null &&
    resident.latitude !== undefined &&
    resident.longitude !== null &&
    resident.longitude !== undefined;

  // Verifica si el residente tiene un usuario vinculado
  const hasUser = Boolean(resident.user?.id || resident.userId);

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Botón para generar / editar usuario */}
      {allowUserCreation && (
        <Button
          size="sm"
          variant="ghost"
          className={`h-8 w-8 p-0 transition-colors ${
            hasUser
              ? "text-primary hover:bg-primary/10"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => onManageUser?.(resident)}
          title={
            hasUser
              ? `Usuario vinculado (${resident.user?.email || resident.email})`
              : "Sin usuario (Clic para crear o vincular)"
          }
        >
          <User className="h-4 w-4" />
        </Button>
      )}

      {/* Botón para gestionar dispositivos de seguridad */}
      {onManageDevices && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-500/10"
          onClick={() => onManageDevices(resident)}
          title="Ver y gestionar dispositivos de seguridad"
        >
          <Shield className="h-4 w-4" />
        </Button>
      )}

      {/* Botón de georreferenciación (Verde si tiene geo, Rojo si no tiene) */}
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

      {/* Botón para editar residente */}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10"
        onClick={() => onEdit(resident)}
        title="Editar residente"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Botón para activar/desactivar */}
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
