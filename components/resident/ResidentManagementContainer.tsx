"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResidentList } from "./ResidentsList";
import { Modal } from "@/components/Modal";
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
import { ResidentForm } from "./ResidentForm";
import { ResidentUserAccessForm } from "./ResidentUserAccessForm";
import { ResidentDevicesForm } from "./ResidentDevicesForm";

type ModalMode = "create" | "edit" | "toggle" | "user" | "devices";

export const ResidentManagementContainer = () => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedResidentForToggle, setSelectedResidentForToggle] =
    useState<Resident | null>(null);
  const [selectedResidentForUser, setSelectedResidentForUser] =
    useState<Resident | null>(null);
  const [selectedResidentDevices, setSelectedResidentDevices] =
    useState<Resident | null>(null);

  // Query individual para obtener los datos frescos del residente al editar
  const { data: residentDetailResponse, isLoading: isLoadingDetail } = useQuery(
    {
      queryKey: ["resident", selectedId],
      queryFn: () => getResidentByIdAction(selectedId!),
      enabled: modalMode === "edit" && !!selectedId,
      staleTime: 0,
    },
  );

  const residentToEdit = residentDetailResponse?.success
    ? residentDetailResponse.data
    : null;

  // 1. Crear residente
  const handleCreate = async (values: ResidentFormValues) => {
    const result = await createResidentAction(values);
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: ["residents"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["residents"],
        exact: false,
      });
      setIsOpen(false);
    } else {
      console.error(result.error);
    }
  };

  // 2. Actualizar residente
  const handleUpdate = async (values: UpdateResidentFormValues) => {
    if (!selectedId) return;
    const result = await updateResidentAction(selectedId, values);
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: ["residents"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["residents"],
        exact: false,
      });
      setIsOpen(false);
      setSelectedId(null);
    } else {
      console.error(result.error);
    }
  };

  // 3. Cambiar estado
  const handleConfirmToggle = async () => {
    if (!selectedResidentForToggle) return;
    const newStatus = !selectedResidentForToggle.isActive;
    const result = await toggleResidentStatusAction(
      selectedResidentForToggle.id,
      newStatus,
    );
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: ["residents"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["residents"],
        exact: false,
      });
      setIsOpen(false);
      setSelectedResidentForToggle(null);
    } else {
      console.error(result.error);
    }
  };

  // 4. Crear o Gestionar usuario vinculado por correo
  const handleSaveUserPassword = async (
    resident: Resident,
    newPassword: string,
  ) => {
    const result = await manageResidentUserAction(resident, newPassword);

    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: ["residents"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["residents"],
        exact: false,
      });
      setIsOpen(false);
      setSelectedResidentForUser(null);
    } else {
      console.error(result.error);
    }
  };

  // 5. Gestionar dispositivos vinculado al residente
  const handleSaveDevices = async (resident: Resident) => {
    setSelectedResidentDevices(resident);
    await queryClient.invalidateQueries({
      queryKey: ["residents"],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: ["residents"],
      exact: false,
    });
  };

  // Aperturas de modal
  const openCreateModal = () => {
    setSelectedId(null);
    setSelectedResidentForToggle(null);
    setSelectedResidentForUser(null);
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

  const getModalTitle = () => {
    if (modalMode === "create") return "Registrar Nuevo Residente";
    if (modalMode === "edit") return "Modificando datos de residente";
    if (modalMode === "user") return "Gestión de Usuario Asociado";
    if (modalMode === "toggle") return "Cambio de estado del usuario";
    if (modalMode === "devices") return "Dispositivos de acceso a la comunidad";
    return "Confirmar Cambio de Estado";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Ingresa la información de la propiedad y el residente.";
    if (modalMode === "edit") return "Actualiza los campos necesarios.";
    if (modalMode === "devices")
      return "Administra los dispositivos de seguridad del residente.";
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
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedId(null);
          setSelectedResidentForToggle(null);
          setSelectedResidentForUser(null);
          setSelectedResidentDevices(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "toggle" ? "max-w-md" : "max-w-2xl"}
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
      </Modal>
    </div>
  );
};
