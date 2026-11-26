"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Loader2, MapPin, Phone, Save, UserCheck } from "lucide-react";
import {
  Resident,
  updateMyProfileSchema,
  UpdateMyProfileFormValues,
} from "@/schemas/resident-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResidentProfileFormProps {
  resident: Resident;
  onSubmit: (values: UpdateMyProfileFormValues) => Promise<void>;
}

export const ResidentProfileForm = ({
  resident,
  onSubmit,
}: ResidentProfileFormProps) => {
  const form = useForm<UpdateMyProfileFormValues>({
    resolver: zodResolver(updateMyProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      emergencyContact: "",
      avatarUrl: "",
      address: "",
      reference: "",
      houseNumber: "",
      street: "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: resident.fullName ?? "",
      phone: resident.phone ?? "",
      email: resident.email ?? "",
      emergencyContact: resident.emergencyContact ?? "",
      avatarUrl: resident.avatarUrl ?? "",
      address: resident.address ?? "",
      reference: resident.reference ?? "",
      houseNumber: resident.houseNumber ?? "",
      street: resident.street ?? "",
    });
  }, [resident, form]);

  const handleFormSubmit: SubmitHandler<UpdateMyProfileFormValues> = async (
    values,
  ) => {
    await onSubmit(values);
  };

  return (
    <Card className="bg-card border-border/60 shadow-2xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-teal-600" />
          Datos Personales y Vivienda
        </CardTitle>
        <CardDescription className="text-xs">
          Actualiza tu información de contacto y ubicación dentro de la
          comunidad
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                placeholder="Nombre completo"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.fullName.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Teléfono
                </span>
              </Label>
              <Input
                id="phone"
                placeholder="9999-9999"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.phone.message)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.email.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
              <Input
                id="emergencyContact"
                placeholder="Nombre y teléfono de emergencia"
                {...form.register("emergencyContact")}
              />
              {form.formState.errors.emergencyContact && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.emergencyContact.message)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="houseNumber">
                <span className="inline-flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground" />
                  Número de Casa
                </span>
              </Label>
              <Input
                id="houseNumber"
                placeholder="Ej. A-12"
                {...form.register("houseNumber")}
              />
              {form.formState.errors.houseNumber && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.houseNumber.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="street">Calle / Bloque</Label>
              <Input
                id="street"
                placeholder="Calle o bloque"
                {...form.register("street")}
              />
              {form.formState.errors.street && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.street.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Dirección
                </span>
              </Label>
              <Input
                id="address"
                placeholder="Dirección de vivienda"
                {...form.register("address")}
              />
              {form.formState.errors.address && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.address.message)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reference">Referencia de Ubicación</Label>
              <Input
                id="reference"
                placeholder="Punto de referencia"
                {...form.register("reference")}
              />
              {form.formState.errors.reference && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.reference.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avatarUrl">URL de Avatar</Label>
              <Input
                id="avatarUrl"
                placeholder="https://..."
                {...form.register("avatarUrl")}
              />
              {form.formState.errors.avatarUrl && (
                <span className="text-xs text-destructive">
                  {String(form.formState.errors.avatarUrl.message)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/60 mt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="gap-1.5 cursor-pointer"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
