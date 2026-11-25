"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { VisitForm } from "./VisitForm";
import { VisitsTableView } from "./VisitsTableView";
import { VisitResponse, VisitFormValues } from "@/schemas/visit-schema";
import { getVisitorByIdAction } from "@/actions/visits";
import { useVisits } from "@/hooks/useVisits";

type ModalMode = "create" | "edit" | "toggle" | "detail";

export const VisitManagementContainer = () => {
  const { createVisit, updateVisit, toggleStatus } = useVisits();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<VisitResponse | null>(
    null,
  );

  const { data: detailResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["visit", selectedId],
    queryFn: () => getVisitorByIdAction(selectedId!),
    enabled: (modalMode === "edit" || modalMode === "detail") && !!selectedId,
    staleTime: 0,
  });

  const activeDetail = detailResponse?.success
    ? detailResponse.data
    : selectedVisit;

  const handleCreate = async (values: VisitFormValues) => {
    await createVisit(values);
    setIsOpen(false);
  };

  const handleUpdate = async (values: VisitFormValues) => {
    if (!selectedId) return;
    await updateVisit({ id: selectedId, values });
    setIsOpen(false);
    setSelectedId(null);
  };

  const handleConfirmToggle = async () => {
    if (!selectedVisit) return;
    await toggleStatus({
      id: selectedVisit.id,
      isActive: !selectedVisit.isActive,
    });
    setIsOpen(false);
    setSelectedVisit(null);
  };

  const openCreateModal = () => {
    setSelectedId(null);
    setSelectedVisit(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openDetailModal = (visit: VisitResponse) => {
    setSelectedId(visit.id);
    setSelectedVisit(visit);
    setModalMode("detail");
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Visita
        </Button>
      </div>

      <VisitsTableView onViewDetail={openDetailModal} />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedId(null);
          setSelectedVisit(null);
        }}
        title={
          modalMode === "create"
            ? "Registrar Nueva Visita"
            : modalMode === "edit"
              ? "Editar Visita"
              : modalMode === "toggle"
                ? "Cambio de Estado de Acceso"
                : "Detalle de la Visita"
        }
        subtitle={
          modalMode === "create"
            ? "Genera un código de acceso para tu visitante o servicio."
            : modalMode === "detail"
              ? "Información completa y código de ingreso."
              : undefined
        }
        className={modalMode === "toggle" ? "max-w-md" : "max-w-xl"}
      >
        {modalMode === "create" && (
          <VisitForm
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
            <VisitForm
              initialData={activeDetail}
              onSubmit={handleUpdate}
              onCancel={() => setIsOpen(false)}
            />
          ))}

        {modalMode === "detail" &&
          (isLoadingDetail ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            activeDetail && (
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Visitante:</span>
                  <span className="font-medium">
                    {activeDetail.visitorName || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Empresa:</span>
                  <span className="font-medium">
                    {activeDetail.companyName || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Placa:</span>
                  <span className="font-medium">
                    {activeDetail.vehiclePlate || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">
                    Código de acceso:
                  </span>
                  <span className="font-mono font-semibold">
                    {activeDetail.accessCode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {activeDetail.isFrequent ? "Frecuente" : "Casual"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Notas:</span>
                  <p className="text-foreground">
                    {activeDetail.notes || "Sin notas adicionales."}
                  </p>
                </div>
              </div>
            )
          ))}

        {modalMode === "toggle" && selectedVisit && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {selectedVisit.isActive
                ? "El código de acceso dejará de estar activo en garita."
                : "El código de acceso volverá a estar habilitado en garita."}
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
                variant={selectedVisit.isActive ? "destructive" : "default"}
                onClick={handleConfirmToggle}
                className="cursor-pointer"
              >
                Sí, {selectedVisit.isActive ? "Revocar" : "Activar"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
