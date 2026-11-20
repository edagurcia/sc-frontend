"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  updatePaymentSchema,
  UpdatePaymentFormValues,
  PaymentHistoryItem,
} from "@/schemas";
import { useUpdatePayment } from "@/hooks";
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

interface UpdatePaymentFormProps {
  payment: PaymentHistoryItem;
  onSuccess?: () => void;
  onCancel: () => void;
}

export const UpdatePaymentForm = ({
  payment,
  onSuccess,
  onCancel,
}: UpdatePaymentFormProps) => {
  const { mutateAsync: updatePayment, isPending: isSubmitting } =
    useUpdatePayment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof updatePaymentSchema>,
    Record<string, unknown>,
    UpdatePaymentFormValues
  >({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      receiptNumber: payment.receiptNumber,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      notes: payment.notes ?? "",
    },
  });

  useEffect(() => {
    reset({
      receiptNumber: payment.receiptNumber,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      notes: payment.notes ?? "",
    });
  }, [payment, reset]);

  const handleFormSubmit: SubmitHandler<UpdatePaymentFormValues> = async (
    values,
  ) => {
    try {
      const res = await updatePayment({
        id: payment.id,
        values,
      });
      toast.success(res.message || "Pago actualizado correctamente");
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo actualizar el pago",
      );
    }
  };

  const formattedPeriods =
    payment.periods && payment.periods.length > 0
      ? payment.periods.join(", ")
      : "—";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-3.5"
    >
      <div className="rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs">
        <p className="font-semibold text-foreground">
          {payment.resident.fullName} • Casa{" "}
          {payment.resident.houseNumber || "S/N"}
        </p>
        <p className="text-muted-foreground font-mono mt-0.5">
          Período(s): {formattedPeriods}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="edit-receiptNumber" className="text-xs">
            Número de Recibo *
          </Label>
          <Input
            id="edit-receiptNumber"
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
          <Label htmlFor="edit-amount" className="text-xs">
            Monto *
          </Label>
          <Input
            id="edit-amount"
            type="number"
            step="0.01"
            className="h-9 text-xs"
            {...register("amount")}
          />
          {errors.amount && (
            <span className="text-xs text-destructive">
              {errors.amount.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="edit-paymentMethod" className="text-xs">
          Método de Pago *
        </Label>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger
                id="edit-paymentMethod"
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

      <div className="flex flex-col gap-1">
        <Label htmlFor="edit-notes" className="text-xs">
          Notas / Observaciones
        </Label>
        <Input id="edit-notes" className="h-9 text-xs" {...register("notes")} />
      </div>

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
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
