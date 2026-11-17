"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CreditCard,
  QrCode,
  Tag,
  Plus,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  X,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { Resident, SecurityDevice } from "@/schemas";
import {
  addResidentDeviceAction,
  updateResidentDeviceStatusAction,
} from "@/actions/residents/adminResidentDeviceActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const addDeviceSchema = z.object({
  type: z.enum(["card", "qr", "tag"]),
  serial: z.string().min(2, "El número de serie es obligatorio"),
});

type AddDeviceFormValues = z.infer<typeof addDeviceSchema>;

interface ResidentDevicesFormProps {
  resident: Resident;
  onSuccess?: (updatedResident: Resident) => void;
  onCancel: () => void;
}

const DEVICE_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  card: { label: "Tarjeta RFID", icon: <CreditCard className="h-4 w-4" /> },
  tag: { label: "Tag Vehicular", icon: <Tag className="h-4 w-4" /> },
  qr: { label: "Código QR", icon: <QrCode className="h-4 w-4" /> },
};

const DEVICE_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  active: {
    label: "Activo",
    variant: "default",
    icon: <ShieldCheck className="h-3.5 w-3.5 mr-1" />,
  },
  inactive: {
    label: "Inactivo",
    variant: "secondary",
    icon: <ShieldOff className="h-3.5 w-3.5 mr-1" />,
  },
  damaged: {
    label: "Dañado",
    variant: "destructive",
    icon: <ShieldAlert className="h-3.5 w-3.5 mr-1" />,
  },
  lost: {
    label: "Extraviado",
    variant: "outline",
    icon: <ShieldX className="h-3.5 w-3.5 mr-1" />,
  },
};

export const ResidentDevicesForm = ({
  resident,
  onSuccess,
  onCancel,
}: ResidentDevicesFormProps) => {
  const [devices, setDevices] = useState<SecurityDevice[]>(
    resident.securityDevices ?? [],
  );
  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddDeviceFormValues>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      type: "card",
      serial: "",
    },
  });

  const handleFormSubmit: SubmitHandler<AddDeviceFormValues> = async (data) => {
    const res = await addResidentDeviceAction(resident.id, data);

    if (!res.success || !res.data) {
      toast.error(res.error || "No se pudo registrar el dispositivo");
      return;
    }

    toast.success(res.message || "Dispositivo agregado correctamente");
    setDevices(res.data.securityDevices ?? []);
    reset({ type: data.type, serial: "" });
    onSuccess?.(res.data);
  };

  const handleStatusChange = async (
    deviceId: string,
    newStatus: "active" | "inactive" | "lost" | "damaged",
  ) => {
    setUpdatingDeviceId(deviceId);
    const res = await updateResidentDeviceStatusAction(
      resident.id,
      deviceId,
      newStatus,
    );
    setUpdatingDeviceId(null);

    if (!res.success || !res.data) {
      toast.error(res.error || "No se pudo actualizar el estado");
      return;
    }

    toast.success(res.message || "Estado actualizado");
    setDevices(res.data.securityDevices ?? []);
    onSuccess?.(res.data);
  };

  return (
    <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">
      <header className="rounded-lg border border-border/60 bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">{resident.fullName}</h2>
        </div>
        <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {resident.phone || "Sin teléfono"}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {resident.email || "Sin correo"}
          </span>
        </div>
      </header>

      {/* Formulario de Registro */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end p-4 border border-border/60 rounded-lg bg-muted/20"
      >
        <div className="flex flex-col gap-1.5 sm:col-span-4">
          <Label htmlFor="type">Tipo de Dispositivo *</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Tarjeta RFID</SelectItem>
                  <SelectItem value="tag">Tag Vehicular</SelectItem>
                  <SelectItem value="qr">Código QR</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <span className="text-xs text-destructive">
              {errors.type.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-5">
          <Label htmlFor="serial">Número de Serie / Código *</Label>
          <Input
            id="serial"
            placeholder="Ej. RFID-00984"
            {...register("serial")}
          />
          {errors.serial && (
            <span className="text-xs text-destructive">
              {errors.serial.message}
            </span>
          )}
        </div>

        <div className="sm:col-span-3">
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Listado de Dispositivos */}
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">
          Dispositivos asignados ({devices.length})
        </Label>

        {devices.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border/60 rounded-lg text-sm text-muted-foreground">
            Este residente aún no tiene dispositivos de seguridad registrados.
          </div>
        ) : (
          <div className="divide-y divide-border/60 border border-border/60 rounded-lg">
            {devices.map((device) => {
              const typeInfo = DEVICE_TYPE_CONFIG[device.type] || {
                label: device.type,
                icon: <CreditCard className="h-4 w-4" />,
              };
              const statusInfo = DEVICE_STATUS_CONFIG[device.status] || {
                label: device.status,
                variant: "outline" as const,
                icon: null,
              };
              const isUpdating = updatingDeviceId === device.id;

              return (
                <div
                  key={device.id || device.serial}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      {typeInfo.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {device.serial}
                        </span>
                        <Badge variant={statusInfo.variant} className="text-xs">
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {typeInfo.label} • Emitido:{" "}
                        {new Date(device.issuedAt).toLocaleDateString("es-HN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUpdating && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    <Select
                      disabled={isUpdating || !device.id}
                      value={device.status}
                      onValueChange={(val) =>
                        device.id &&
                        handleStatusChange(
                          device.id,
                          val as "active" | "inactive" | "lost" | "damaged",
                        )
                      }
                    >
                      <SelectTrigger className="w-35 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="damaged">Dañado</SelectItem>
                        <SelectItem value="lost">Extraviado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pie del Modal */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cerrar
        </Button>
      </div>
    </div>
  );
};
