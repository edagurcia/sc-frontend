"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementsList } from "./AnnouncementsList";
import { AnnouncementForm } from "./AnnouncementForm";
import { Modal } from "@/components/Modal";
import {
  AnnouncementResponse,
  AnnouncementFormValues,
} from "@/schemas/announcement-schema";
import { getAnnouncementByIdAction } from "@/actions/announcements";
import { useAnnouncements } from "@/hooks/useAnnouncements";

type ModalMode = "create" | "edit" | "toggle";

export const AnnouncementManagementContainer = () => {
  const queryClient = useQueryClient();
  const { createAnnouncement, updateAnnouncement, toggleStatus } =
    useAnnouncements();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAnnouncementForToggle, setSelectedAnnouncementForToggle] =
    useState<AnnouncementResponse | null>(null);

  const { data: detailResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["announcement", selectedId],
    queryFn: () => getAnnouncementByIdAction(selectedId!),
    enabled: modalMode === "edit" && !!selectedId,
    staleTime: 0,
  });

  const announcementToEdit = detailResponse?.success
    ? detailResponse.data
    : null;

  const handleCreate = async (values: AnnouncementFormValues) => {
    try {
      await createAnnouncement(values);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (values: AnnouncementFormValues) => {
    if (!selectedId) return;
    try {
      await updateAnnouncement({ id: selectedId, values });
      setIsOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedAnnouncementForToggle) return;
    const newStatus = !selectedAnnouncementForToggle.isActive;
    try {
      await toggleStatus({
        id: selectedAnnouncementForToggle.id,
        isActive: newStatus,
      });
      setIsOpen(false);
      setSelectedAnnouncementForToggle(null);
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setSelectedId(null);
    setSelectedAnnouncementForToggle(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openEditModal = (announcement: AnnouncementResponse) => {
    setSelectedId(announcement.id);
    setModalMode("edit");
    setIsOpen(true);
  };

  const openToggleModal = (announcement: AnnouncementResponse) => {
    setSelectedAnnouncementForToggle(announcement);
    setModalMode("toggle");
    setIsOpen(true);
  };

  const getModalTitle = () => {
    if (modalMode === "create") return "Publicar Nuevo Anuncio";
    if (modalMode === "edit") return "Editar Anuncio";
    return "Cambio de Estado del Anuncio";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Ingresa los datos para el nuevo aviso de la comunidad.";
    if (modalMode === "edit")
      return "Modifica los campos necesarios del anuncio.";
    return `¿Estás seguro de ${selectedAnnouncementForToggle?.isActive ? "desactivar" : "activar"} este anuncio?`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo Anuncio
        </Button>
      </div>

      <AnnouncementsList
        onEdit={openEditModal}
        onToggleStatus={openToggleModal}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedId(null);
          setSelectedAnnouncementForToggle(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "toggle" ? "max-w-md" : "max-w-xl"}
      >
        {modalMode === "create" && (
          <AnnouncementForm
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
            <AnnouncementForm
              initialData={announcementToEdit}
              onSubmit={handleUpdate}
              onCancel={() => setIsOpen(false)}
            />
          ))}

        {modalMode === "toggle" && selectedAnnouncementForToggle && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {selectedAnnouncementForToggle.isActive
                ? "El anuncio dejará de mostrarse en el dashboard de los residentes."
                : "El anuncio volverá a estar visible para todos los residentes de la comunidad."}
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
                  selectedAnnouncementForToggle.isActive
                    ? "destructive"
                    : "default"
                }
                onClick={handleConfirmToggle}
                className="cursor-pointer"
              >
                Sí,{" "}
                {selectedAnnouncementForToggle.isActive
                  ? "Desactivar"
                  : "Activar"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
