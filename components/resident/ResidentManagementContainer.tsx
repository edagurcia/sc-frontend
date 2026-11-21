"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResidentList } from "./ResidentsList";
import { Modal } from "@/components/Modal";
import { useAuthStore } from "@/stores";
import {
  Resident,
  ResidentFormValues,
  UpdateResidentFormValues,
} from "@/schemas";
import { getResidentByIdAction } from "@/actions/residents/getResidentByIdAction";
import { createResidentAction } from "@/actions/residents/createResidentAction";
import { updateResidentAction } from "@/actions/residents/updateResidentAction";
import { toggleResidentStatusAction } from "@/actions/residents/toggleResidentStatusAction";
import { manageResidentUserAction } from "@/actions/residents/manageResidentUserAction";
import { updateResidentLocationAction } from "@/actions/residents/updateResidentLocationAction";
import { ResidentForm } from "./ResidentForm";
import { ResidentUserAccessForm } from "./ResidentUserAccessForm";
import { ResidentDevicesForm } from "./ResidentDevicesForm";
import { ResidentLocationForm } from "./ResidentLocationForm";

type ModalMode = "create" | "edit" | "toggle" | "user" | "devices" | "location";

export const ResidentManagementContainer = () => {
  const queryClient = useQueryClient();
  const community = useAuthStore((state) => state.community);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedResidentForToggle, setSelectedResidentForToggle] =
    useState<Resident | null>(null);
  const [selectedResidentForUser, setSelectedResidentForUser] =
    useState<Resident | null>(null);
  const [selectedResidentDevices, setSelectedResidentDevices] =
    useState<Resident | null>(null);
  const [selectedResidentForLocation, setSelectedResidentForLocation] =
    useState<Resident | null>(null);

  const { data: residentDetailResponse, isLoading: isLoadingDetail } = useQuery(
    {
      queryKey: ["resident", selectedId],
      queryFn: () => getResidentByIdAction(selectedId!),
      enabled: modalMode === "edit" && !!selectedId,
      staleTime: 0,
    },
  );

  const residentToEdit = residentDetailResponse?.success
    ? (residentDetailResponse.data?.resident ?? null)
    : null;

  const refreshResidents = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["residents"],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: ["residents"],
      exact: false,
    });
  };

  const handleCreate = async (values: ResidentFormValues) => {
    const result = await createResidentAction(values);
    if (result.success) {
      await refreshResidents();
      setIsOpen(false);
    } else {
      console.error(result.error);
    }
  };

  const handleUpdate = async (values: UpdateResidentFormValues) => {
    if (!selectedId) return;
    const result = await updateResidentAction(selectedId, values);
    if (result.success) {
      await refreshResidents();
      setIsOpen(false);
      setSelectedId(null);
    } else {
      console.error(result.error);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedResidentForToggle) return;
    const newStatus = !selectedResidentForToggle.isActive;
    const result = await toggleResidentStatusAction(
      selectedResidentForToggle.id,
      newStatus,
    );
    if (result.success) {
      await refreshResidents();
      setIsOpen(false);
      setSelectedResidentForToggle(null);
    } else {
      console.error(result.error);
    }
  };

  const handleSaveUserPassword = async (
    resident: Resident,
    newPassword: string,
  ) => {
    const result = await manageResidentUserAction(resident, newPassword);

    if (result.success) {
      await refreshResidents();
      setIsOpen(false);
      setSelectedResidentForUser(null);
    } else {
      console.error(result.error);
    }
  };

  const handleSaveDevices = async (resident: Resident) => {
    setSelectedResidentDevices(resident);
    await refreshResidents();
  };

  const handleSaveLocation = async (
    latitude: number | null,
    longitude: number | null,
  ) => {
    if (!selectedResidentForLocation) return;

    const result = await updateResidentLocationAction(
      selectedResidentForLocation.id,
      latitude,
      longitude,
    );

    if (!result.success) {
      toast.error(result.error || "No se pudo actualizar la ubicación");
      return;
    }

    toast.success(
      result.message || "Ubicación geográfica actualizada correctamente",
    );
    await refreshResidents();
    setIsOpen(false);
    setSelectedResidentForLocation(null);
  };

  const openCreateModal = () => {
    setSelectedId(null);
    setSelectedResidentForToggle(null);
    setSelectedResidentForUser(null);
    setSelectedResidentForLocation(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openEditModal = (resident: Resident) => {
    setSelectedId(resident.id);
    setModalMode("edit");
    setIsOpen(true);
  };

  const openToggleModal = (resident: Resident) => {
    setSelectedResidentForToggle(resident);
    setModalMode("toggle");
    setIsOpen(true);
  };

  const openUserModal = (resident: Resident) => {
    setSelectedResidentForUser(resident);
    setModalMode("user");
    setIsOpen(true);
  };

  const openDevicesModal = (resident: Resident) => {
    setSelectedResidentDevices(resident);
    setModalMode("devices");
    setIsOpen(true);
  };

  const openLocationModal = (resident: Resident) => {
    setSelectedResidentForLocation(resident);
    setModalMode("location");
    setIsOpen(true);
  };

  const getModalTitle = () => {
    if (modalMode === "create") return "Registrar Nuevo Residente";
    if (modalMode === "edit") return "Modificando datos de residente";
    if (modalMode === "user") return "Gestión de Usuario Asociado";
    if (modalMode === "toggle") return "Cambio de estado del usuario";
    if (modalMode === "devices") return "Dispositivos de acceso a la comunidad";
    if (modalMode === "location") return "Ubicación geográfica de propiedad";
    return "Confirmar Cambio de Estado";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Ingresa la información de la propiedad y el residente.";
    if (modalMode === "edit") return "Actualiza los campos necesarios.";
    if (modalMode === "devices")
      return "Administra los dispositivos de seguridad del residente.";
    if (modalMode === "location")
      return "Selecciona dentro del polígono comunitario la posición de la vivienda.";
    if (modalMode === "user")
      return `Administrar cuenta de usuario para ${selectedResidentForUser?.fullName} (${selectedResidentForUser?.email || "Sin correo"})`;
    return `¿Estás seguro de cambiar el estado de ${selectedResidentForToggle?.fullName}?`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="cursor-pointer">
          <Plus /> Nuevo Residente
        </Button>
      </div>

      <ResidentList
        variant="admin"
        entityKey="admin-residents"
        onEdit={openEditModal}
        onToggleStatus={openToggleModal}
        onManageUser={openUserModal}
        onManageDevices={openDevicesModal}
        onEditLocation={openLocationModal}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedId(null);
          setSelectedResidentForToggle(null);
          setSelectedResidentForUser(null);
          setSelectedResidentDevices(null);
          setSelectedResidentForLocation(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={
          modalMode === "location"
            ? "max-w-4xl"
            : modalMode === "toggle"
              ? "max-w-md"
              : "max-w-2xl"
        }
      >
        {modalMode === "create" && (
          <ResidentForm
            onSubmit={handleCreate}
            onCancel={() => setIsOpen(false)}
          />
        )}

        {modalMode === "edit" &&
          (isLoadingDetail ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResidentForm
              initialData={residentToEdit}
              onSubmit={handleUpdate}
              onCancel={() => setIsOpen(false)}
            />
          ))}

        {modalMode === "toggle" && selectedResidentForToggle && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Esta acción cambiará el acceso y la visibilidad del residente.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant={
                  selectedResidentForToggle.isActive ? "destructive" : "default"
                }
                onClick={handleConfirmToggle}
                className="cursor-pointer"
              >
                Sí,{" "}
                {selectedResidentForToggle.isActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        )}

        {modalMode === "user" && selectedResidentForUser && (
          <ResidentUserAccessForm
            resident={selectedResidentForUser}
            onSavePassword={handleSaveUserPassword}
            onCancel={() => setIsOpen(false)}
          />
        )}

        {modalMode === "devices" && selectedResidentDevices && (
          <ResidentDevicesForm
            resident={selectedResidentDevices}
            onSuccess={handleSaveDevices}
            onCancel={() => {
              setIsOpen(false);
              setSelectedResidentDevices(null);
            }}
          />
        )}

        {modalMode === "location" && selectedResidentForLocation && (
          <ResidentLocationForm
            resident={selectedResidentForLocation}
            polygonJson={community?.polygon}
            communityName={community?.name}
            onSave={handleSaveLocation}
            onCancel={() => {
              setIsOpen(false);
              setSelectedResidentForLocation(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
