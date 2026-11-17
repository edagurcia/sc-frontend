"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createCommunitySchema,
  CreateCommunityInput,
  CommunityResponse,
} from "@/schemas/community-schema";
import { CommunityMapPolygon } from "./CommunityMapPolygon";

interface CommunityFormProps {
  initialData?: CommunityResponse | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const CommunityForm = ({
  initialData,
  onSubmit,
  onCancel,
}: CommunityFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommunityInput>({
    resolver: zodResolver(createCommunitySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      department: initialData?.department || "Francisco Morazán",
      municipality: initialData?.municipality || "Tegucigalpa",
      address: initialData?.address || "",
      polygon: initialData?.polygon || "",
      allowUserCreation: initialData?.allowUserCreation ?? true,
    },
  });

  const allowUserCreation = watch("allowUserCreation");
  const polygonValue = watch("polygon");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {/* Área scrollable con padding lateral (px-1) para no cortar los focus rings de los inputs y pb-6 para respiración al final */}
      <div className="max-h-[72vh] overflow-y-auto px-1 pb-6 space-y-5 scrollbar-thin">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre de la Comunidad</Label>
            <Input
              id="name"
              placeholder="Ej. Residencial Las Uvas"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-destructive">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              placeholder="Ej. Francisco Morazán"
              {...register("department")}
            />
            {errors.department && (
              <span className="text-xs text-destructive">
                {errors.department.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="municipality">Municipio</Label>
            <Input
              id="municipality"
              placeholder="Ej. Tegucigalpa"
              {...register("municipality")}
            />
            {errors.municipality && (
              <span className="text-xs text-destructive">
                {errors.municipality.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Dirección / Referencia</Label>
            <Input
              id="address"
              placeholder="Ej. Anillo Periférico Sur"
              {...register("address")}
            />
            {errors.address && (
              <span className="text-xs text-destructive">
                {errors.address.message}
              </span>
            )}
          </div>
        </div>

        {/* Sin wrapper con overflow-hidden para no cortar controles/tooltips de Leaflet ni duplicar título */}
        <div className="space-y-1.5 pt-1">
          <CommunityMapPolygon
            value={polygonValue}
            onChange={(newPolygon) =>
              setValue("polygon", newPolygon, { shouldValidate: true })
            }
          />
          {errors.polygon && (
            <span className="text-xs text-destructive">
              {errors.polygon.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/30">
          <div className="space-y-0.5 pr-4">
            <Label className="text-sm font-medium">
              Permitir Creación de Usuarios
            </Label>
            <p className="text-xs text-muted-foreground">
              Habilita que los administradores de esta comunidad registren
              nuevos accesos.
            </p>
          </div>
          <Switch
            checked={allowUserCreation}
            onCheckedChange={(checked) =>
              setValue("allowUserCreation", checked)
            }
          />
        </div>
      </div>

      {/* Footer fijo separado visualmente con sombra superior sutil para suavizar el corte del scroll */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 bg-background shadow-[0_-8px_16px_-12px_rgba(0,0,0,0.12)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting
            ? "Guardando..."
            : initialData
              ? "Actualizar Comunidad"
              : "Registrar Comunidad"}
        </Button>
      </div>
    </form>
  );
};
