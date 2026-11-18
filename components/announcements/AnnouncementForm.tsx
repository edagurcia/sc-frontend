"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";
import {
  announcementSchema,
  AnnouncementFormValues,
  AnnouncementResponse,
} from "@/schemas/announcement-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AnnouncementFormProps {
  initialData?: AnnouncementResponse | null;
  onSubmit: (values: AnnouncementFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AnnouncementForm = ({
  initialData,
  onSubmit,
  onCancel,
}: AnnouncementFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof announcementSchema>,
    Record<string, unknown>,
    AnnouncementFormValues
  >({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      isPinned: false,
      expiresAt: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title ?? "",
        content: initialData.content ?? "",
        isPinned: Boolean(initialData.isPinned),
        expiresAt: initialData.expiresAt
          ? initialData.expiresAt.split("T")[0]
          : "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<AnnouncementFormValues> = async (
    data,
  ) => {
    await onSubmit({
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título del Anuncio *</Label>
        <Input
          id="title"
          placeholder="Ej. Mantenimiento de áreas verdes"
          {...register("title")}
        />
        {errors.title && (
          <span className="text-xs text-destructive">
            {String(errors.title.message)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenido *</Label>
        <Textarea
          id="content"
          rows={4}
          placeholder="Escribe los detalles del anuncio aquí..."
          {...register("content")}
        />
        {errors.content && (
          <span className="text-xs text-destructive">
            {String(errors.content.message)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiresAt">Fecha de Expiración (Opcional)</Label>
          <Input id="expiresAt" type="date" {...register("expiresAt")} />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Controller
            name="isPinned"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="isPinned"
                checked={field.value}
                onChange={field.onChange}
                className="rounded border-input h-4 w-4 cursor-pointer"
              />
            )}
          />
          <Label htmlFor="isPinned" className="cursor-pointer font-normal">
            Fijar anuncio en la parte superior
          </Label>
        </div>
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
              {initialData ? "Actualizar Anuncio" : "Publicar Anuncio"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
