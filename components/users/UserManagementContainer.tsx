"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { useUsers } from "@/hooks/useUsers";
import { useCommunityNames } from "@/hooks/useCommunityNames";
import {
  CreatableUserFormValues,
  UpdateUserFormValues,
  User,
} from "@/schemas/user-schema";
import { createUserAction } from "@/actions/users/createUserAction";
import { updateUserAction } from "@/actions/users/updateUserAction";
import { toggleUserStatusAction } from "@/actions/users/toggleUserStatusAction";
import { resetUserPasswordAction } from "@/actions/users/resetUserPasswordAction";
import { UsersList } from "./UsersList";
import { UserForm, CommunityOption } from "./UserForm";
import { UserResetPasswordForm } from "./UserResetPasswordForm";

type ModalMode = "create" | "edit" | "toggle" | "reset-password";

export const UserManagementContainer = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsers();

  const communityIds = useMemo(
    () =>
      users.map((u) => u.communityId).filter((id): id is string => Boolean(id)),
    [users],
  );

  const { communityMap } = useCommunityNames(communityIds);

  const communities = useMemo<CommunityOption[]>(
    () =>
      Object.entries(communityMap).map(([id, name]) => ({
        id,
        name,
      })),
    [communityMap],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForToggle, setUserForToggle] = useState<User | null>(null);
  const [userForReset, setUserForReset] = useState<User | null>(null);

  const resolveCommunityLabel = (user: User | null) => {
    if (!user) return "—";
    if (!user.communityId) {
      return user.role === "super_admin"
        ? "Acceso global (Plataforma)"
        : "Sin comunidad asignada";
    }
    return communityMap[user.communityId] ?? "Cargando comunidad...";
  };

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: ["users"],
      exact: false,
    });
  };

  const handleCreate = async (values: CreatableUserFormValues) => {
    const result = await createUserAction(values);
    if (result.success) {
      toast.success(result.message || "Usuario creado correctamente");
      await refreshUsers();
      setIsOpen(false);
    } else {
      toast.error(result.error || "No se pudo crear el usuario");
    }
  };

  const handleUpdate = async (values: UpdateUserFormValues) => {
    if (!selectedUser) return;
    const result = await updateUserAction(selectedUser.id, values);
    if (result.success) {
      toast.success(result.message || "Usuario actualizado correctamente");
      await refreshUsers();
      setIsOpen(false);
      setSelectedUser(null);
    } else {
      toast.error(result.error || "No se pudo actualizar el usuario");
    }
  };

  const handleConfirmToggle = async () => {
    if (!userForToggle) return;
    const result = await toggleUserStatusAction(userForToggle.id);
    if (result.success) {
      toast.success(result.message || "Estado del usuario actualizado");
      await refreshUsers();
      setIsOpen(false);
      setUserForToggle(null);
    } else {
      toast.error(result.error || "No se pudo cambiar el estado del usuario");
    }
  };

  const handleConfirmResetPassword = async (
    user: User,
    newPassword: string,
  ) => {
    const result = await resetUserPasswordAction(user.id, newPassword);
    if (result.success) {
      toast.success(result.message || "Contraseña restablecida correctamente");
      await refreshUsers();
      setIsOpen(false);
      setUserForReset(null);
    } else {
      toast.error(result.error || "No se pudo restablecer la contraseña");
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setUserForToggle(null);
    setUserForReset(null);
    setModalMode("create");
    setIsOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsOpen(true);
  };

  const openToggleModal = (user: User) => {
    setUserForToggle(user);
    setModalMode("toggle");
    setIsOpen(true);
  };

  const openResetPasswordModal = (user: User) => {
    setUserForReset(user);
    setModalMode("reset-password");
    setIsOpen(true);
  };

  const getModalTitle = () => {
    if (modalMode === "create") return "Registrar Nuevo Usuario";
    if (modalMode === "edit") return "Modificando datos de usuario";
    if (modalMode === "reset-password") return "Resetear Contraseña de Usuario";
    return "Cambio de estado del usuario";
  };

  const getModalSubtitle = () => {
    if (modalMode === "create")
      return "Crea una cuenta y asígnala a un rol y comunidad.";
    if (modalMode === "edit")
      return `Actualiza los datos de ${selectedUser?.name ?? "el usuario"}.`;
    if (modalMode === "reset-password")
      return `Genera una nueva contraseña para ${userForReset?.name ?? "el usuario"} (${userForReset?.email || "Sin correo"})`;
    return `¿Estás seguro de cambiar el estado de ${userForToggle?.name}?`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-2">
        <Button onClick={openCreateModal} className="cursor-pointer">
          <Plus /> Nuevo Usuario
        </Button>
      </div>

      <UsersList
        communityMap={communityMap}
        entityKey="admin-users"
        onEdit={openEditModal}
        onToggleStatus={openToggleModal}
        onResetPassword={openResetPasswordModal}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedUser(null);
          setUserForToggle(null);
          setUserForReset(null);
        }}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className={modalMode === "toggle" ? "max-w-md" : "max-w-2xl"}
      >
        {modalMode === "create" && (
          <UserForm
            communities={communities}
            onSubmitCreate={handleCreate}
            onCancel={() => setIsOpen(false)}
          />
        )}

        {modalMode === "edit" && selectedUser && (
          <UserForm
            initialData={selectedUser}
            communities={communities}
            onSubmitUpdate={handleUpdate}
            onCancel={() => setIsOpen(false)}
          />
        )}

        {modalMode === "toggle" && userForToggle && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Esta acción cambiará el acceso y la visibilidad del usuario en{" "}
              <strong className="text-foreground">
                {resolveCommunityLabel(userForToggle)}
              </strong>
              .
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant={userForToggle.isActive ? "destructive" : "default"}
                onClick={handleConfirmToggle}
                className="cursor-pointer"
              >
                Sí, {userForToggle.isActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        )}

        {modalMode === "reset-password" && userForReset && (
          <UserResetPasswordForm
            user={userForReset}
            communityLabel={resolveCommunityLabel(userForReset)}
            onConfirmReset={handleConfirmResetPassword}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};
