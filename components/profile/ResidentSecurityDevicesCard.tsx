"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Cpu,
  CreditCard,
  Loader2,
  Plus,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  Tag,
} from "lucide-react";
import { useMyProfile, useMySecurityDevices } from "@/hooks/useMyProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  serial: z.string().trim().min(2, "El número de serie es obligatorio"),
});

type AddDeviceFormValues = z.infer<typeof addDeviceSchema>;

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

export const ResidentSecurityDevicesCard = () => {
  const { data: resident, isLoading } = useMyProfile();
  const { addDevice, isAddingDevice, reportDevice } = useMySecurityDevices();
  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);

  const devices = resident?.securityDevices ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<AddDeviceFormValues>({
    resolver: zodResolver(addDeviceSchema),
    mode: "onChange",
    defaultValues: {
      type: "card",
      serial: "",
    },
  });

  const handleFormSubmit: SubmitHandler<AddDeviceFormValues> = async (data) => {
    try {
      const res = await addDevice(data);
      toast.success(
        res.message || "Dispositivo de seguridad registrado correctamente",
      );
      reset({ type: data.type, serial: "" });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el dispositivo",
      );
    }
  };

  const handleReportStatus = async (
    deviceId: string,
    newStatus: "lost" | "damaged",
  ) => {
    setUpdatingDeviceId(deviceId);
    try {
      const res = await reportDevice({ deviceId, status: newStatus });
      toast.success(res.message || "Estado del dispositivo actualizado");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado del dispositivo",
      );
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  return (
    <Card className="bg-card border-border/60 shadow-2xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Cpu className="h-4 w-4 text-teal-600" />
          Dispositivos de Seguridad
        </CardTitle>
        <CardDescription className="text-xs">
          Registra tus credenciales de acceso o repórtalas en caso de extravío o
          daño
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-3 p-3.5 rounded-lg border border-border/60 bg-muted/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="device-type" className="text-xs">
                Tipo de Dispositivo *
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="device-type" className="w-full h-9">
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
                <span className="text-[11px] text-destructive">
                  {errors.type.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="device-serial" className="text-xs">
                Número de Serie / Código *
              </Label>
              <Input
                id="device-serial"
                placeholder="Ej. RFID-00984"
                className="h-9"
                {...register("serial")}
              />
              {errors.serial && (
                <span className="text-[11px] text-destructive">
                  {errors.serial.message}
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={isAddingDevice || !isValid}
            className="w-full sm:w-auto sm:self-end cursor-pointer"
          >
            {isAddingDevice ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Agregar Dispositivo
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Mis dispositivos ({devices.length})
          </span>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-6 px-4 border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground">
              Aún no tienes dispositivos de acceso registrados.
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
                const isLockedByStatus =
                  device.status !== "active" && device.status !== "inactive";

                return (
                  <div
                    key={device.id || device.serial}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-md bg-muted shrink-0 mt-0.5">
                        {typeInfo.icon}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-xs font-mono">
                            {device.serial}
                          </span>
                          <Badge
                            variant={statusInfo.variant}
                            className="text-[11px] h-5"
                          >
                            {statusInfo.icon}
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {typeInfo.label} •{" "}
                          {new Date(device.issuedAt).toLocaleDateString(
                            "es-HN",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {isUpdating && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      )}

                      {isLockedByStatus ? (
                        <span className="text-[11px] text-muted-foreground italic">
                          Reportado ({statusInfo.label.toLowerCase()})
                        </span>
                      ) : (
                        <Select
                          disabled={isUpdating || !device.id}
                          value=""
                          onValueChange={(val) =>
                            device.id &&
                            handleReportStatus(
                              device.id,
                              val as "lost" | "damaged",
                            )
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Reportar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lost">Extraviado</SelectItem>
                            <SelectItem value="damaged">Dañado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
