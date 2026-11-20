"use client";

import { useMemo, useState } from "react";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { PaymentHistoryItem, Resident } from "@/schemas";
import { usePayments, useResidents, usePaymentById } from "@/hooks";
import { generatePaymentReceiptPdf } from "@/utils/receipt-pdf";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { PaymentForm } from "./PaymentForm";
import { UpdatePaymentForm } from "./UpdatePaymentForm";
import { PaymentsList } from "./PaymentsList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type ModalMode = "create" | "edit" | "detail" | null;

export const PaymentsManagementContainer = () => {
  usePayments();
  const { data: residents = [], isLoading: isLoadingResidents } =
    useResidents();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryItem | null>(null);
  const [openResidentCombobox, setOpenResidentCombobox] = useState(false);

  const { data: paymentDetail, isLoading: isLoadingDetail } = usePaymentById(
    modalMode === "detail" ? selectedPayment?.id : undefined,
  );

  const handleOpenCreateModal = () => {
    setSelectedPayment(null);
    setSelectedResident(null);
    setModalMode("create");
  };

  const handleOpenEditModal = (payment: PaymentHistoryItem) => {
    setSelectedResident(null);
    setSelectedPayment(payment);
    setModalMode("edit");
  };

  const handleOpenDetailModal = (payment: PaymentHistoryItem) => {
    setSelectedResident(null);
    setSelectedPayment(payment);
    setModalMode("detail");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedPayment(null);
    setSelectedResident(null);
    setOpenResidentCombobox(false);
  };

  const handleDownloadReceipt = (payment: PaymentHistoryItem) => {
    const periods = [...(payment.periods ?? [])].sort((a, b) =>
      a.localeCompare(b),
    );
    const totalAmount = Number(payment.amount) || 0;
    const count = periods.length > 0 ? periods.length : 1;
    const unitAmount = (totalAmount / count).toFixed(2);

    const periodAmounts = periods.map((period) => ({
      period,
      amount: unitAmount,
    }));

    const residentForReceipt: Resident = {
      id: payment.resident.id,
      fullName: payment.resident.fullName,
      houseNumber: payment.resident.houseNumber,
      monthlyFee: unitAmount,
    } as Resident;

    generatePaymentReceiptPdf({
      resident: residentForReceipt,
      receiptNumber: payment.receiptNumber,
      periods,
      periodAmounts,
      paymentMethod: payment.paymentMethod,
      totalAmount,
      notes: payment.notes ?? undefined,
      issuedAt: payment.createdAt,
    });

    toast.success(`Recibo ${payment.receiptNumber} descargado`);
  };

  const detailPeriods = useMemo(() => {
    const basePeriods = selectedPayment?.periods ?? [];
    const extraPeriod = paymentDetail?.period;
    const merged = new Set<string>(basePeriods);
    if (extraPeriod) {
      merged.add(extraPeriod);
    }
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
  }, [selectedPayment?.periods, paymentDetail?.period]);

  const getModalTitle = () => {
    if (modalMode === "create") return "Registrar Cobro";
    if (modalMode === "edit") return "Modificar Pago";
    if (modalMode === "detail") return "Detalle del Pago";
    return "";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Selecciona un residente y registra los períodos a cancelar.";
    if (modalMode === "edit")
      return `Editando comprobante ${selectedPayment?.receiptNumber ?? ""}`;
    if (modalMode === "detail")
      return `Comprobante ${selectedPayment?.receiptNumber ?? ""}`;
    return "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          onClick={handleOpenCreateModal}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Registrar Cobro
        </Button>
      </div>

      <PaymentsList
        onViewDetail={handleOpenDetailModal}
        onEdit={handleOpenEditModal}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <Modal
        isOpen={modalMode !== null}
        onClose={handleCloseModal}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "detail" ? "max-w-lg" : "max-w-xl"}
      >
        {modalMode === "create" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">
                Seleccionar Residente *
              </label>
              <Popover
                open={openResidentCombobox}
                onOpenChange={setOpenResidentCombobox}
              >
                <PopoverTrigger
                  nativeButton={true}
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResidentCombobox}
                      className="w-full justify-between font-normal h-10 cursor-pointer"
                    />
                  }
                >
                  <>
                    {selectedResident
                      ? `${selectedResident.fullName} • Casa ${selectedResident.houseNumber || "S/N"}`
                      : isLoadingResidents
                        ? "Cargando residentes..."
                        : "Busca y selecciona un residente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o casa..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron residentes.</CommandEmpty>
                      <CommandGroup>
                        {residents.map((resident) => (
                          <CommandItem
                            key={resident.id}
                            value={`${resident.fullName} ${resident.houseNumber}`}
                            onSelect={() => {
                              setSelectedResident(resident);
                              setOpenResidentCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedResident?.id === resident.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {resident.fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Casa: {resident.houseNumber || "S/N"} • Cuota:{" "}
                                {formatCurrency(resident.monthlyFee)}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedResident && (
              <PaymentForm
                resident={selectedResident}
                onSuccess={handleCloseModal}
                onCancel={handleCloseModal}
              />
            )}
          </div>
        )}

        {modalMode === "edit" && selectedPayment && (
          <UpdatePaymentForm
            payment={selectedPayment}
            onSuccess={handleCloseModal}
            onCancel={handleCloseModal}
          />
        )}

        {modalMode === "detail" && selectedPayment && (
          <div className="flex flex-col gap-3 text-xs">
            {isLoadingDetail ? (
              <p className="text-muted-foreground py-4">Cargando detalle...</p>
            ) : (
              <>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Recibo:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {selectedPayment.receiptNumber}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Residente:</span>
                    <span className="font-semibold text-right text-foreground">
                      {paymentDetail?.resident.fullName ??
                        selectedPayment.resident.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Casa:</span>
                    <span className="font-medium text-foreground">
                      {paymentDetail?.resident.houseNumber ??
                        selectedPayment.resident.houseNumber ??
                        "S/N"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      Mes(es) pagado(s):
                    </span>
                    <span className="font-mono text-right text-foreground">
                      {detailPeriods.length > 0
                        ? detailPeriods.join(", ")
                        : "Sin período"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      Método de pago:
                    </span>
                    <span className="capitalize font-medium text-foreground">
                      {paymentDetail?.paymentMethod ??
                        selectedPayment.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Monto total:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(
                        selectedPayment.amount ?? paymentDetail?.amount ?? 0,
                      )}
                    </span>
                  </div>
                  {(paymentDetail?.notes ?? selectedPayment.notes) && (
                    <div className="pt-1 border-t border-border/60">
                      <span className="text-muted-foreground block">
                        Notas:
                      </span>
                      <p className="text-foreground mt-0.5">
                        {paymentDetail?.notes ?? selectedPayment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCloseModal}
                    className="cursor-pointer"
                  >
                    Cerrar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleDownloadReceipt(selectedPayment)}
                    className="cursor-pointer"
                  >
                    Descargar Recibo PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
