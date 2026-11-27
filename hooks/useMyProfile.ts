"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfileAction } from "@/actions/residents/getMyProfileAction";
import { updateMyResidentProfileAct } from "@/actions/residents/updateMyProfileAction";
import {
  addMyDeviceAction,
  AddDevicePayload,
  reportMyDeviceStatusAction,
} from "@/actions/residents/residentDeviceActions";
import { Resident, UpdateMyProfileFormValues } from "@/schemas";

export function useMyProfile() {
  return useQuery<Resident, Error>({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await getMyProfileAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "No se pudo cargar el perfil");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateMyProfileFormValues) => {
      const res = await updateMyResidentProfileAct(values);
      if (!res.success) {
        throw new Error(res.error || "No se pudo actualizar el perfil");
      }
      return res;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
        queryClient.invalidateQueries({
          queryKey: ["resident-dashboard"],
          exact: false,
        }),
      ]);
    },
  });
}

export function useMySecurityDevices() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
      queryClient.invalidateQueries({
        queryKey: ["resident-dashboard"],
        exact: false,
      }),
    ]);
  };

  const addDeviceMutation = useMutation({
    mutationFn: async (values: AddDevicePayload) => {
      const res = await addMyDeviceAction(values);
      if (!res.success || !res.data) {
        throw new Error(res.error || "No se pudo registrar el dispositivo");
      }
      return res;
    },
    onSuccess: invalidate,
  });

  const reportDeviceMutation = useMutation({
    mutationFn: async ({
      deviceId,
      status,
    }: {
      deviceId: string;
      status: "lost" | "damaged";
    }) => {
      const res = await reportMyDeviceStatusAction(deviceId, status);
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "No se pudo actualizar el estado del dispositivo",
        );
      }
      return res;
    },
    onSuccess: invalidate,
  });

  return {
    addDevice: addDeviceMutation.mutateAsync,
    isAddingDevice: addDeviceMutation.isPending,
    reportDevice: reportDeviceMutation.mutateAsync,
    isReportingDevice: reportDeviceMutation.isPending,
  };
}
