"use client";

import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, DollarSign, Receipt, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createPaymentSchema,
  CreatePaymentFormValues,
  Resident,
} from "@/schemas";
import { useResidentStatement, useCreatePayment } from "@/hooks";
import { formatCurrency } from "@/utils/formatters";
import { generatePaymentReceiptPdf } from "@/utils/receipt-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentFormProps {
  resident: Resident;
  onSuccess?: () => void;
  onCancel: () => void;
}

interface SelectablePeriodItem {
  period: string;
  amount: string;
  isAdvance: boolean;
}

function parsePeriod(
  periodStr: string,
): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(periodStr);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) };
}

function formatPeriod(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export const PaymentForm = ({
  resident,
  onSuccess,
  onCancel,
}: PaymentFormProps) => {
  const {
    data: statementData,
    isLoading: isLoadingStatement,
    error: statementError,
  } = useResidentStatement(resident.id);

  const { mutateAsync: createPayment, isPending: isSubmitting } =
    useCreatePayment();

  const unitFeeString = useMemo(() => {
    const rawFee =
      statementData?.resident.monthlyFee ?? resident.monthlyFee ?? 0;
    const numeric = Number(rawFee);
    return (Number.isNaN(numeric) ? 0 : numeric).toFixed(2);
  }, [statementData?.resident.monthlyFee, resident.monthlyFee]);

  const selectablePeriods = useMemo<SelectablePeriodItem[]>(() => {
    const unpaid = statementData?.unpaidPeriods ?? [];
    const paidSet = new Set(
      (statementData?.statement ?? [])
        .filter((item) => item.isPaid)
        .map((item) => item.period),
    );

    const items: SelectablePeriodItem[] = unpaid.map((item) => ({
      period: item.period,
      amount: item.amount ?? unitFeeString,
      isAdvance: false,
    }));

    const existingSet = new Set(items.map((i) => i.period));

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentPeriodStr = formatPeriod(currentYear, currentMonth);

    const lastUnpaid = unpaid[unpaid.length - 1]?.period;
    const lastStatement =
      statementData?.statement?.[statementData.statement.length - 1]?.period;

    const anchorPeriod = lastUnpaid || lastStatement || currentPeriodStr;
    const parsedAnchor = parsePeriod(anchorPeriod);

    if (parsedAnchor) {
      const targetYear = parsedAnchor.year;
      let y = parsedAnchor.year;
      let m = parsedAnchor.month + 1;

      while (y === targetYear && m <= 12) {
        const candidate = formatPeriod(y, m);
        if (!existingSet.has(candidate) && !paidSet.has(candidate)) {
          items.push({
            period: candidate,
            amount: unitFeeString,
            isAdvance: true,
          });
          existingSet.add(candidate);
        }
        m += 1;
      }

      if (
        !existingSet.has(currentPeriodStr) &&
        !paidSet.has(currentPeriodStr)
      ) {
        const parsedCurrent = parsePeriod(currentPeriodStr);
        if (parsedCurrent && parsedCurrent.year === targetYear) {
          items.push({
            period: currentPeriodStr,
            amount: unitFeeString,
            isAdvance: false,
          });
        }
      }
    }

    return items.sort((a, b) => a.period.localeCompare(b.period));
  }, [statementData, unitFeeString]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof createPaymentSchema>,
    Record<string, unknown>,
    CreatePaymentFormValues
  >({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      residentId: resident.id,
      receiptNumber: "",
      periods: [],
      paymentMethod: "efectivo",
      notes: "",
    },
  });

  useEffect(() => {
    reset({
      residentId: resident.id,
      receiptNumber: "",
      periods:
        selectablePeriods.length > 0 ? [selectablePeriods[0].period] : [],
      paymentMethod: "efectivo",
      notes: "",
    });
  }, [resident.id, selectablePeriods, reset]);

  const selectedPeriods = watch("periods") ?? [];

  const handleTogglePeriod = (index: number) => {
    const orderedCodes = selectablePeriods.map((item) => item.period);
    const targetPeriod = orderedCodes[index];
    const isCurrentlySelected = selectedPeriods.includes(targetPeriod);

    const nextPeriods = isCurrentlySelected
      ? orderedCodes.slice(0, index)
      : orderedCodes.slice(0, index + 1);

    setValue("periods", nextPeriods, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const calculatedTotal = useMemo(() => {
    if (selectedPeriods.length === 0) return 0;
    return selectedPeriods.reduce((acc, periodCode) => {
      const found = selectablePeriods.find(
        (item) => item.period === periodCode,
      );
      const unitAmount = found ? Number(found.amount) : Number(unitFeeString);
      return acc + (Number.isNaN(unitAmount) ? 0 : unitAmount);
    }, 0);
  }, [selectedPeriods, selectablePeriods, unitFeeString]);

  const handleFormSubmit: SubmitHandler<CreatePaymentFormValues> = async (
    values,
  ) => {
    try {
      const res = await createPayment({
        ...values,
        residentId: resident.id,
      });

      generatePaymentReceiptPdf({
        resident,
        receiptNumber: values.receiptNumber,
        periods: values.periods,
        paymentMethod: values.paymentMethod,
        totalAmount: res.data?.totalAmount ?? calculatedTotal,
        notes: values.notes,
        createdPayment: res.data,
      });

      toast.success(res.message || "Pago registrado exitosamente");
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo registrar el pago",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-3.5 max-h-[75vh] overflow-y-auto pr-1"
    >
      {/* Cabecera compacta del residente y deuda total */}
      <div className="rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {resident.fullName}
          </p>
          <p className="text-xs text-muted-foreground">
            Casa {resident.houseNumber || "S/N"} • Cuota:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(unitFeeString)}
            </span>
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Deuda Pendiente
          </span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            {isLoadingStatement
              ? "..."
              : formatCurrency(statementData?.totalDebt ?? "0.00")}
          </span>
        </div>
      </div>

      {/* Selector compacto de períodos con checkboxes y scroll controlado */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs font-medium">
            Períodos a Cancelar (secuencia continua) *
          </Label>
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
            {selectedPeriods.length} de {selectablePeriods.length}
          </span>
        </div>

        {isLoadingStatement ? (
          <div className="flex items-center justify-center py-6 border border-border/60 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : statementError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {statementError.message}
          </div>
        ) : selectablePeriods.length === 0 ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Este residente ya tiene todos los períodos disponibles cancelados.
            </span>
          </div>
        ) : (
          <div className="max-h-44 overflow-y-auto rounded-lg border border-border/60 bg-muted/10 p-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {selectablePeriods.map((item, idx) => {
                const isChecked = selectedPeriods.includes(item.period);
                return (
                  <label
                    key={item.period}
                    title={`${item.period} (${formatCurrency(item.amount)})${item.isAdvance ? " - Adelanto" : ""}`}
                    className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] cursor-pointer transition-colors select-none ${
                      isChecked
                        ? "border-primary bg-primary/10 text-foreground font-semibold"
                        : "border-border/60 bg-card text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePeriod(idx)}
                      className="h-3.5 w-3.5 shrink-0 rounded border-input accent-primary"
                    />
                    <span className="truncate font-mono">{item.period}</span>
                    {item.isAdvance && (
                      <span className="ml-auto shrink-0 rounded bg-blue-500/15 px-1 py-0.5 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                        Adel.
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {errors.periods && (
          <span className="text-xs text-destructive">
            {errors.periods.message}
          </span>
        )}
      </div>

      {/* Comprobante y Método de Pago */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="receiptNumber"
            className="text-xs flex items-center gap-1.5"
          >
            <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
            Número de Recibo *
          </Label>
          <Input
            id="receiptNumber"
            placeholder="REC-2026-0090"
            className="h-9 text-xs"
            {...register("receiptNumber")}
          />
          {errors.receiptNumber && (
            <span className="text-xs text-destructive">
              {errors.receiptNumber.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="paymentMethod" className="text-xs">
            Método de Pago *
          </Label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  id="paymentMethod"
                  className="h-9 w-full text-xs"
                >
                  <SelectValue placeholder="Seleccione método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="deposito">Depósito</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && (
            <span className="text-xs text-destructive">
              {errors.paymentMethod.message}
            </span>
          )}
        </div>
      </div>

      {/* Notas opcionales */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="notes" className="text-xs">
          Notas / Observaciones
        </Label>
        <Input
          id="notes"
          placeholder="Ej. Comprobante bancario o referencia adicional"
          className="h-9 text-xs"
          {...register("notes")}
        />
      </div>

      {/* Resumen compacto del monto a cobrar */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
          Total a registrar ({selectedPeriods.length} mes
          {selectedPeriods.length === 1 ? "" : "es"})
        </span>
        <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
          {formatCurrency(calculatedTotal)}
        </span>
      </div>

      {/* Botonera */}
      <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={
            isSubmitting ||
            isLoadingStatement ||
            selectablePeriods.length === 0 ||
            selectedPeriods.length === 0
          }
          className="cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-1.5" />
              Registrar Pago
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
