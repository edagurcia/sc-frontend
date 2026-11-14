"use client";

import { Button } from "@/components/ui/button";
import { Edit, Power, DollarSign, Shield, MapPin } from "lucide-react";
import { Resident } from "@/schemas";

interface Props {
  resident: Resident;
  onEdit: (resident: Resident) => void;
  onToggleStatus: (resident: Resident) => void;
  onPay?: (resident: Resident) => void;
  onManageDevices?: (resident: Resident) => void;
  onEditLocation?: (resident: Resident) => void;
}

export const AdminCrudActions = ({
  resident,
  onEdit,
  onToggleStatus,
  onPay,
  onManageDevices,
  onEditLocation,
}: Props) => {
  // Verifica si ya cuenta con georreferenciación activa
  const hasLocation =
    resident.latitude !== null &&
    resident.latitude !== undefined &&
    resident.longitude !== null &&
    resident.longitude !== undefined;

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Botón para generar / registrar pago mensual */}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10"
        onClick={() => onPay?.(resident)}
        title="Generar o registrar pago mensual"
      >
        <DollarSign className="h-4 w-4" />
      </Button>

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
