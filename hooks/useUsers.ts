"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersAction } from "@/actions/users/getUsersAction";
import { createUserAction } from "@/actions/users/createUserAction";
import { updateUserAction } from "@/actions/users/updateUserAction";
import { toggleUserStatusAction } from "@/actions/users/toggleUserStatusAction";
import { resetUserPasswordAction } from "@/actions/users/resetUserPasswordAction";
import {
  CreatableUserFormValues,
  UpdateUserFormValues,
  User,
} from "@/schemas/user-schema";

const USERS_QUERY_KEY = ["users"] as const;

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const res = await getUsersAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener el listado de usuarios");
      }
      return res.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatableUserFormValues) => {
      const res = await createUserAction(input);
      if (!res.success) {
        throw new Error(res.error || "Error al crear el usuario");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      input,
    }: {
      userId: string;
      input: UpdateUserFormValues;
    }) => {
      const res = await updateUserAction(userId, input);
      if (!res.success) {
        throw new Error(res.error || "Error al actualizar el usuario");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await toggleUserStatusAction(userId);
      if (!res.success) {
        throw new Error(res.error || "Error al cambiar el estado del usuario");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => {
      const res = await resetUserPasswordAction(userId, newPassword);
      if (!res.success) {
        throw new Error(res.error || "Error al restablecer la contraseña");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
