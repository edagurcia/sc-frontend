"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import { residentSchema, ResidentFormValues } from "@/schemas";
import { Resident } from "@/schemas";
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
import { z } from "zod";

interface ResidentFormProps {
  initialData?: Resident | null;
  onSubmit: (values: ResidentFormValues) => Promise<void>;
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
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof residentSchema>,
    Record<string, unknown>,
    ResidentFormValues
  >({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      dni: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      reference: "",
      houseNumber: "",
      street: "",
      avenue: "",
      tenureType: "Propia",
      emergencyContact: "",
      avatarUrl: "",
      monthlyFee: 500,
      hasCistern: false,
      floorsCount: 1,
      hasGarage: false,
      adultsCount: 1,
      minorsCount: 0,
      securityDevices: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        dni: initialData.dni ?? "",
        fullName: initialData.fullName ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        address: initialData.address ?? "",
        reference: initialData.reference ?? "",
        houseNumber: initialData.houseNumber ?? "",
        street: initialData.street ?? "",
        avenue: initialData.avenue ?? "",
        tenureType: initialData.tenureType ?? "Propia",
        emergencyContact: initialData.emergencyContact ?? "",
        avatarUrl: initialData.avatarUrl ?? "",
        monthlyFee: initialData.monthlyFee
          ? Number(initialData.monthlyFee)
          : 500,
        hasCistern: Boolean(initialData.hasCistern),
        floorsCount: initialData.floorsCount
          ? Number(initialData.floorsCount)
          : 1,
        hasGarage: Boolean(initialData.hasGarage),
        adultsCount: initialData.adultsCount
          ? Number(initialData.adultsCount)
          : 1,
        minorsCount: initialData.minorsCount
          ? Number(initialData.minorsCount)
          : 0,
        securityDevices: (initialData.securityDevices ?? []).map((device) => ({
          id: device.id,
          type: device.type,
          serial: device.serial,
          status: device.status === "inactive" ? "inactive" : "active",
          issuedAt: device.issuedAt,
        })),
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<ResidentFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      {/* Datos Personales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dni">DNI (Solo números, máx. 13) *</Label>
          <Input
            id="dni"
            maxLength={13}
            placeholder="0801199012345"
            {...register("dni", {
              onChange: (e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setValue("dni", onlyNums);
              },
            })}
          />
          {errors.dni && (
            <span className="text-xs text-destructive">
              {errors.dni.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <Input
            id="fullName"
            placeholder="Juan Pérez"
            {...register("fullName")}
          />
          {errors.fullName && (
            <span className="text-xs text-destructive">
              {errors.fullName.message}
            </span>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input id="phone" placeholder="95556810" {...register("phone")} />
          {errors.phone && (
            <span className="text-xs text-destructive">
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>

      {/* Ubicación y Domicilio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="houseNumber">N° Casa *</Label>
          <Input
            id="houseNumber"
            placeholder="Casa 14"
            {...register("houseNumber")}
          />
          {errors.houseNumber && (
            <span className="text-xs text-destructive">
              {errors.houseNumber.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="street">Calle *</Label>
          <Input
            id="street"
            placeholder="Calle Principal"
            {...register("street")}
          />
          {errors.street && (
            <span className="text-xs text-destructive">
              {errors.street.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="avenue">Avenida *</Label>
          <Input
            id="avenue"
            placeholder="Avenida Central"
            {...register("avenue")}
          />
          {errors.avenue && (
            <span className="text-xs text-destructive">
              {errors.avenue.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Dirección / Colonia *</Label>
          <Input
            id="address"
            placeholder="Colonia Residencial"
            {...register("address")}
          />
          {errors.address && (
            <span className="text-xs text-destructive">
              {errors.address.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reference">Referencia *</Label>
          <Input
            id="reference"
            placeholder="Cerca del parque central"
            {...register("reference")}
          />
          {errors.reference && (
            <span className="text-xs text-destructive">
              {errors.reference.message}
            </span>
          )}
        </div>
      </div>

      {/* Tenencia (Shadcn Select) y Cuota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tenureType">Tipo de Tenencia *</Label>
          <Controller
            name="tenureType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger id="tenureType" className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de tenencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Propia">Propia</SelectItem>
                  <SelectItem value="Alquiler">Alquiler</SelectItem>
                  <SelectItem value="Negocio">Negocio</SelectItem>
                  <SelectItem value="Familiar">Familiar</SelectItem>
                  <SelectItem value="Prestado">Prestado</SelectItem>
                  <SelectItem value="Cuidando">Cuidando</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tenureType && (
            <span className="text-xs text-destructive">
              {errors.tenureType.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="monthlyFee">Cuota Mensual *</Label>
          <Input
            id="monthlyFee"
            type="number"
            step="0.01"
            placeholder="500"
            {...register("monthlyFee", { valueAsNumber: true })}
          />
          {errors.monthlyFee && (
            <span className="text-xs text-destructive">
              {errors.monthlyFee.message}
            </span>
          )}
        </div>
      </div>

      {/* Características */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="floorsCount">Pisos</Label>
          <Input
            id="floorsCount"
            type="number"
            {...register("floorsCount", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="adultsCount">Adultos</Label>
          <Input
            id="adultsCount"
            type="number"
            {...register("adultsCount", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minorsCount">Menores</Label>
          <Input
            id="minorsCount"
            type="number"
            {...register("minorsCount", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col justify-end pb-2 gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...register("hasCistern")}
              className="rounded border-input"
            />
            Cisterna
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...register("hasGarage")}
              className="rounded border-input"
            />
            Garaje
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
        <Input
          id="emergencyContact"
          placeholder="99926409 (Nombre - Parentesco)"
          {...register("emergencyContact")}
        />
      </div>

      {/* Botones */}
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
