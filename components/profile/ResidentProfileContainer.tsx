"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  IdCard,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getMyProfileAction } from "@/actions/residents/getMyProfileAction";
import { updateMyResidentProfileAct } from "@/actions/residents/updateMyProfileAction";
import { Resident, UpdateMyProfileFormValues } from "@/schemas/resident-schema";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResidentProfileForm } from "./ResidentProfileForm";
import { ResidentChangePasswordModal } from "./ResidentChangePasswordModal";

export const ResidentProfileContainer = () => {
  const [resident, setResident] = useState<Resident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    const res = await getMyProfileAction();
    if (res.success && res.data) {
      setResident(res.data);
    } else {
      setError(res.error || "No se pudo cargar el perfil");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (values: UpdateMyProfileFormValues) => {
    const res = await updateMyResidentProfileAct(values);
    if (res.success) {
      toast.success(res.message || "Perfil actualizado exitosamente");
      await loadProfile();
    } else {
      toast.error(res.error || "No se pudo actualizar el perfil");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{error || "Perfil no encontrado"}</span>
      </div>
    );
  }

  const devicesCount = resident.securityDevices?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {resident.fullName}
            </h2>
            <Badge variant={resident.isActive ? "default" : "outline"}>
              {resident.isActive ? "Activo" : "Inactivo"}
            </Badge>
            {devicesCount > 0 && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                {devicesCount} dispositivo(s)
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {resident.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <IdCard className="h-3.5 w-3.5" />
              DNI: {resident.dni}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsPasswordModalOpen(true)}
          className="gap-2 shrink-0 cursor-pointer"
        >
          <KeyRound className="h-4 w-4 text-amber-500" />
          Cambiar Contraseña
        </Button>
      </div>

      <ResidentProfileForm resident={resident} onSubmit={handleUpdateProfile} />

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Cambiar Contraseña"
        subtitle={`Cuenta: ${resident.email}`}
        className="max-w-md"
      >
        <ResidentChangePasswordModal
          onCancel={() => setIsPasswordModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
