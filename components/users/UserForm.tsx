"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import {
  createUserSchema,
  CreatableUserFormValues,
  updateUserSchema,
  UpdateUserFormValues,
  User,
} from "@/schemas/user-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CommunityOption {
  id: string;
  name: string;
}

interface UserFormProps {
  initialData?: User | null;
  communities?: CommunityOption[];
  onSubmitCreate?: (values: CreatableUserFormValues) => Promise<void>;
  onSubmitUpdate?: (values: UpdateUserFormValues) => Promise<void>;
  onCancel: () => void;
}

export const UserForm = ({
  initialData,
  communities = [],
  onSubmitCreate,
  onSubmitUpdate,
  onCancel,
}: UserFormProps) => {
  const isEditing = Boolean(initialData);

  const createForm = useForm<CreatableUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "resident",
      communityId: "",
    },
  });

  const editForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "resident",
    },
  });

  useEffect(() => {
    if (initialData) {
      editForm.reset({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        role:
          initialData.role === "super_admin"
            ? undefined
            : (initialData.role as UpdateUserFormValues["role"]),
      });
    } else {
      createForm.reset({
        name: "",
        email: "",
        password: "",
        role: "resident",
        communityId: "",
      });
    }
  }, [initialData, createForm, editForm]);

  const selectedRole = createForm.watch("role");
  const isSubmitting = isEditing
    ? editForm.formState.isSubmitting
    : createForm.formState.isSubmitting;

  const handleCreateSubmit: SubmitHandler<CreatableUserFormValues> = async (
    data,
  ) => {
    await onSubmitCreate?.(data);
  };

  const handleEditSubmit: SubmitHandler<UpdateUserFormValues> = async (
    data,
  ) => {
    await onSubmitUpdate?.(data);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={editForm.handleSubmit(handleEditSubmit)}
        className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-name">Nombre Completo *</Label>
          <Input
            id="edit-name"
            placeholder="Carlos Méndez"
            {...editForm.register("name")}
          />
          {editForm.formState.errors.name && (
            <span className="text-xs text-destructive">
              {String(editForm.formState.errors.name.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-email">Correo Electrónico *</Label>
          <Input
            id="edit-email"
            type="email"
            placeholder="correo@ejemplo.com"
            {...editForm.register("email")}
          />
          {editForm.formState.errors.email && (
            <span className="text-xs text-destructive">
              {String(editForm.formState.errors.email.message)}
            </span>
          )}
        </div>

        {initialData?.role !== "super_admin" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-role">Rol</Label>
            <select
              id="edit-role"
              {...editForm.register("role")}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="resident">Residente</option>
              <option value="guard">Guardia</option>
              <option value="community_admin">Admin de Comunidad</option>
            </select>
            {editForm.formState.errors.role && (
              <span className="text-xs text-destructive">
                {String(editForm.formState.errors.role.message)}
              </span>
            )}
          </div>
        )}

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
                Actualizar Usuario
              </>
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={createForm.handleSubmit(handleCreateSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            placeholder="Carlos Méndez"
            {...createForm.register("name")}
          />
          {createForm.formState.errors.name && (
            <span className="text-xs text-destructive">
              {String(createForm.formState.errors.name.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            {...createForm.register("email")}
          />
          {createForm.formState.errors.email && (
            <span className="text-xs text-destructive">
              {String(createForm.formState.errors.email.message)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña *</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mín. 8 caracteres, Mayús, Num y !@#$%^&*"
            {...createForm.register("password")}
          />
          {createForm.formState.errors.password && (
            <span className="text-xs text-destructive">
              {String(createForm.formState.errors.password.message)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Rol *</Label>
          <select
            id="role"
            {...createForm.register("role")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="resident">Residente</option>
            <option value="guard">Guardia</option>
            <option value="community_admin">Admin de Comunidad</option>
          </select>
          {createForm.formState.errors.role && (
            <span className="text-xs text-destructive">
              {String(createForm.formState.errors.role.message)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="communityId">
          Comunidad {selectedRole === "community_admin" ? "*" : "(Opcional)"}
        </Label>
        {communities.length > 0 ? (
          <select
            id="communityId"
            {...createForm.register("communityId")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Selecciona una comunidad...</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="communityId"
            placeholder="UUID de la comunidad"
            {...createForm.register("communityId")}
          />
        )}
        {createForm.formState.errors.communityId && (
          <span className="text-xs text-destructive">
            {String(createForm.formState.errors.communityId.message)}
          </span>
        )}
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
              Crear Usuario
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
