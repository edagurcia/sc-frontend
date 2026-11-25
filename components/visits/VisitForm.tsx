"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";
import {
  visitsSchema,
  VisitFormValues,
  VisitResponse,
} from "@/schemas/visit-schema";
import {
  DNI_LENGTH,
  handleDigitsChange,
  handleDigitsKeyDown,
  handleDigitsPaste,
} from "@/utils/dni-phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VisitFormProps {
  initialData?: VisitResponse | null;
  onSubmit: (values: VisitFormValues) => Promise<void>;
  onCancel: () => void;
}

export const VisitForm = ({
  initialData,
  onSubmit,
  onCancel,
}: VisitFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof visitsSchema>,
    Record<string, unknown>,
    VisitFormValues
  >({
    resolver: zodResolver(visitsSchema),
    defaultValues: {
      visitorName: "",
      companyName: "",
      identification: "",
      vehiclePlate: "",
      notes: "",
      isFrequent: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        visitorName: initialData.visitorName ?? "",
        companyName: initialData.companyName ?? "",
        identification: initialData.identification ?? "",
        vehiclePlate: initialData.vehiclePlate ?? "",
        notes: initialData.notes ?? "",
        isFrequent: Boolean(initialData.isFrequent),
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<VisitFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitorName">Nombre del Visitante</Label>
          <Input
            id="visitorName"
            placeholder="Ej. Carlos Mendoza"
            {...register("visitorName")}
          />
          {errors.visitorName && (
            <span className="text-xs text-destructive">
              {String(errors.visitorName.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyName">Empresa / Servicio</Label>
          <Input
            id="companyName"
            placeholder="Ej. Mantenimiento / Delivery"
            {...register("companyName")}
          />
          {errors.companyName && (
            <span className="text-xs text-destructive">
              {String(errors.companyName.message)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identification">DNI / Identificación</Label>
          <Controller
            name="identification"
            control={control}
            render={({ field }) => (
              <Input
                id="identification"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={DNI_LENGTH}
                placeholder="Ej. 0801199012345"
                value={field.value ?? ""}
                onKeyDown={handleDigitsKeyDown}
                onPaste={(e) =>
                  handleDigitsPaste(
                    e,
                    (clean) => field.onChange(clean),
                    DNI_LENGTH,
                  )
                }
                onChange={(e) =>
                  handleDigitsChange(
                    e,
                    (clean) => field.onChange(clean),
                    DNI_LENGTH,
                  )
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.identification && (
            <span className="text-xs text-destructive">
              {String(errors.identification.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehiclePlate">Placa Vehicular</Label>
          <Input
            id="vehiclePlate"
            placeholder="Ej. HAK-4821"
            {...register("vehiclePlate")}
          />
          {errors.vehiclePlate && (
            <span className="text-xs text-destructive">
              {String(errors.vehiclePlate.message)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notas para Garita</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Instrucciones o detalles adicionales de la visita..."
          {...register("notes")}
        />
        {errors.notes && (
          <span className="text-xs text-destructive">
            {String(errors.notes.message)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Controller
          name="isFrequent"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isFrequent"
              checked={Boolean(field.value)}
              onChange={field.onChange}
              className="rounded border-input h-4 w-4 cursor-pointer"
            />
          )}
        />
        <Label htmlFor="isFrequent" className="cursor-pointer font-normal">
          Marcar como visita frecuente
        </Label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button
          type="submit"
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
              {initialData ? "Actualizar Visita" : "Registrar Visita"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
