"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import { z } from "zod";
import { createResidentSchema, CreateResidentInput, Resident } from "@/schemas";
import {
  DNI_LENGTH,
  PHONE_LENGTH,
  handleDigitsChange,
  handleDigitsKeyDown,
  handleDigitsPaste,
} from "@/utils/dni-phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResidentFormProps {
  initialData?: Resident | null;
  onSubmit: (values: CreateResidentInput) => Promise<void>;
  onCancel: () => void;
}

export const ResidentForm = ({
  initialData,
  onSubmit,
  onCancel,
}: ResidentFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof createResidentSchema>,
    Record<string, unknown>,
    CreateResidentInput
  >({
    resolver: zodResolver(createResidentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dni: "",
      phone: "",
      houseNumber: "",
      street: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName ?? "",
        email: initialData.email ?? "",
        dni: initialData.dni ?? "",
        phone: initialData.phone ?? "",
        houseNumber: initialData.houseNumber ?? "",
        street: initialData.street ?? "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        dni: "",
        phone: "",
        houseNumber: "",
        street: "",
        isActive: true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<CreateResidentInput> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <Input
            id="fullName"
            placeholder="Juan Pérez"
            {...register("fullName")}
          />
          {errors.fullName && (
            <span className="text-xs text-destructive">
              {String(errors.fullName.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-destructive">
              {String(errors.email.message)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dni">DNI / Identidad (13 números) *</Label>
          <Controller
            name="dni"
            control={control}
            render={({ field }) => (
              <Input
                id="dni"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={DNI_LENGTH}
                placeholder="0801199012345"
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
          {errors.dni && (
            <span className="text-xs text-destructive">
              {String(errors.dni.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono (8 números) *</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={PHONE_LENGTH}
                placeholder="95556810"
                value={field.value ?? ""}
                onKeyDown={handleDigitsKeyDown}
                onPaste={(e) =>
                  handleDigitsPaste(
                    e,
                    (clean) => field.onChange(clean),
                    PHONE_LENGTH,
                  )
                }
                onChange={(e) =>
                  handleDigitsChange(
                    e,
                    (clean) => field.onChange(clean),
                    PHONE_LENGTH,
                  )
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.phone && (
            <span className="text-xs text-destructive">
              {String(errors.phone.message)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="houseNumber">N° Casa *</Label>
          <Input
            id="houseNumber"
            placeholder="Casa 14"
            {...register("houseNumber")}
          />
          {errors.houseNumber && (
            <span className="text-xs text-destructive">
              {String(errors.houseNumber.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="street">Calle o Bloque *</Label>
          <Input
            id="street"
            placeholder="Calle Principal"
            {...register("street")}
          />
          {errors.street && (
            <span className="text-xs text-destructive">
              {String(errors.street.message)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isActive"
              checked={Boolean(field.value)}
              onChange={field.onChange}
              className="rounded border-input h-4 w-4 cursor-pointer"
            />
          )}
        />
        <Label htmlFor="isActive" className="cursor-pointer font-normal">
          Residente activo
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
              {initialData ? "Actualizar Residente" : "Registrar Residente"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
