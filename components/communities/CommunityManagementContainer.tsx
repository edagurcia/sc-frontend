"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunitiesList } from "./CommunitiesList";
import { Modal } from "@/components/Modal";
import { useCommunities, useCommunityDetail } from "@/hooks/useCommunities";
import {
  CommunityResponse,
  CreateCommunityInput,
  UpdateCommunityInput,
} from "@/schemas/community-schema";
import { CommunityForm } from "./CommunityForm";
// Nota: Puedes crear o adaptar tu propio CommunityForm para los inputs y el mapa del polígono
// import { CommunityForm } from "./CommunityForm";

type ModalMode = "create" | "edit" | "toggle";

export const CommunityManagementContainer = () => {
  const {
    communities,
    isLoading,
    error,
    createCommunity,
    isCreating,
    updateCommunity,
    isUpdating,
    toggleStatus,
  } = useCommunities();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCommunityForToggle, setSelectedCommunityForToggle] =
    useState<CommunityResponse | null>(null);

  // Consulta individual para la edición
  const { data: communityToEdit, isLoading: isLoadingDetail } =
    useCommunityDetail(modalMode === "edit" ? selectedId : null);

  // 1. Crear
  const handleCreate = async (values: CreateCommunityInput) => {
    try {
      await createCommunity(values);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Actualizar
  const handleUpdate = async (values: UpdateCommunityInput) => {
    if (!selectedId) return;
    try {
      await updateCommunity({ id: selectedId, values });
      setIsOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Cambiar estado (Activar / Inactiva)
  const handleConfirmToggle = async () => {
    if (!selectedCommunityForToggle) return;
    try {
      await toggleStatus(selectedCommunityForToggle.id);
      setIsOpen(false);
      setSelectedCommunityForToggle(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Aperturas de modales
  const openCreateModal = () => {
    setSelectedId(null);
    setSelectedCommunityForToggle(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openEditModal = (community: CommunityResponse) => {
    setSelectedId(community.id);
    setModalMode("edit");
    setIsOpen(true);
  };

  const openToggleModal = (community: CommunityResponse) => {
    setSelectedCommunityForToggle(community);
    setModalMode("toggle");
    setIsOpen(true);
  };

  const getModalTitle = () => {
    if (modalMode === "create") return "Registrar Nueva Comunidad";
    if (modalMode === "edit") return "Modificando Datos de la Comunidad";
    return "Cambio de Estado de la Comunidad";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Ingresa la información general, ubicación y polígono de la comunidad.";
    if (modalMode === "edit")
      return "Actualiza la configuración o el polígono del mapa.";
    return `¿Estás seguro de ${
      selectedCommunityForToggle?.isActive ? "desactivar" : "activar"
    } a ${selectedCommunityForToggle?.name}?`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="cursor-pointer gap-2">
          <Plus className="h-4 w-4" /> Nueva Comunidad
        </Button>
      </div>

      <CommunitiesList
        communities={communities}
        isLoading={isLoading}
        error={error}
        onEdit={openEditModal}
        onToggleStatus={openToggleModal}
        entityKey="super-admin-communities-table"
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedId(null);
          setSelectedCommunityForToggle(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "toggle" ? "max-w-md" : "max-w-4xl"}
      >
        {modalMode === "create" && (
          <CommunityForm
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
            <CommunityForm
              initialData={communityToEdit}
              onSubmit={handleUpdate}
              onCancel={() => setIsOpen(false)}
            />
          ))}

        {modalMode === "toggle" && selectedCommunityForToggle && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Esta acción afectará el acceso global de los usuarios y residentes
              vinculados a esta comunidad.
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
                  selectedCommunityForToggle.isActive
                    ? "destructive"
                    : "default"
                }
                onClick={handleConfirmToggle}
                className="cursor-pointer"
              >
                Sí,{" "}
                {selectedCommunityForToggle.isActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
