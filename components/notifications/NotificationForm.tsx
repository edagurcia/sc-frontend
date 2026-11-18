"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, X, Check, ChevronsUpDown } from "lucide-react";
import {
  notificationSchema,
  NotificationFormValues,
} from "@/schemas/notification-schema";
import { useAuthStore } from "@/stores";
import { useResidents } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface NotificationFormProps {
  onSubmit: (values: NotificationFormValues) => Promise<void>;
  onCancel: () => void;
}

export const NotificationForm = ({
  onSubmit,
  onCancel,
}: NotificationFormProps) => {
  const community = useAuthStore((state) => state.community);
  const { data: residents = [], isLoading: isLoadingResidents } =
    useResidents();

  const [openCombobox, setOpenCombobox] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      targetType: "community",
      communityId: community?.id ?? "",
      userId: "",
      title: "",
      message: "",
      type: "alert",
    },
  });

  useEffect(() => {
    if (community?.id) {
      setValue("communityId", community.id);
    }
  }, [community?.id, setValue]);

  const targetType = watch("targetType");
  const selectedUserId = watch("userId");

  const selectedResident = residents.find(
    (r) => r.userId === selectedUserId || r.id === selectedUserId,
  );

  const handleFormSubmit: SubmitHandler<NotificationFormValues> = async (
    data,
  ) => {
    await onSubmit({
      ...data,
      communityId: community?.id ?? data.communityId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      {/* Selector de Destinatario */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="targetType">Enviar a *</Label>
        <Controller
          name="targetType"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                if (val === "community") {
                  setValue("userId", "");
                }
              }}
              value={field.value}
            >
              <SelectTrigger id="targetType" className="w-full">
                <SelectValue placeholder="Seleccione destinatario">
                  {field.value === "community"
                    ? community?.name || "Comunidad Actual"
                    : selectedResident
                      ? selectedResident.fullName
                      : "Usuario específico"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community">
                  {community?.name || "Comunidad Actual"}
                </SelectItem>
                <SelectItem value="user">Usuario específico</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Combobox de Residentes si se elige usuario específico */}
      {targetType === "user" && (
        <div className="flex flex-col gap-1.5">
          <Label>Seleccionar Usuario / Residente *</Label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger
              nativeButton={false}
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between font-normal h-10 cursor-pointer"
                />
              }
            >
              <>
                {selectedResident
                  ? `${selectedResident.fullName} (${selectedResident.email || selectedResident.phone || "Sin contacto"})`
                  : isLoadingResidents
                    ? "Cargando usuarios..."
                    : "Busca y selecciona un residente..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Buscar por nombre, correo o casa..." />
                <CommandList>
                  <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                  <CommandGroup>
                    {residents.map((resident) => {
                      const uId = resident.userId || resident.id;
                      return (
                        <CommandItem
                          key={resident.id}
                          value={`${resident.fullName} ${resident.email} ${resident.houseNumber}`}
                          onSelect={() => {
                            setValue("userId", uId, { shouldValidate: true });
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUserId === uId
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {resident.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Casa: {resident.houseNumber || "S/N"} •{" "}
                              {resident.email || resident.phone}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.userId && (
            <span className="text-xs text-destructive">
              {errors.userId.message || "Debe seleccionar un usuario"}
            </span>
          )}
        </div>
      )}

      {/* Tipo de Notificación */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Tipo de Notificación *</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alert">Alerta / Aviso</SelectItem>
                <SelectItem value="payment">Pago / Cuota</SelectItem>
                <SelectItem value="visit">Visita</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <span className="text-xs text-destructive">
            {errors.type.message}
          </span>
        )}
      </div>

      {/* Título */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Ej. Mantenimiento del Sistema"
          {...register("title")}
        />
        {errors.title && (
          <span className="text-xs text-destructive">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="Escribe el contenido de la notificación..."
          {...register("message")}
        />
        {errors.message && (
          <span className="text-xs text-destructive">
            {errors.message.message}
          </span>
        )}
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
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1.5" />
              Enviar Notificación
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
