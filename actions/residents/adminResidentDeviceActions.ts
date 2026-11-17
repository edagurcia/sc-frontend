"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { Resident, ResidentResponse } from "@/schemas";
import { AddDevicePayload } from "./residentDeviceActions";

export async function addResidentDeviceAction(
  residentId: string,
  input: AddDevicePayload,
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentResponse>(
      `/api/v1/residents/${residentId}/devices`,
      {
        method: "POST",
        body: JSON.stringify(input),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error(
      `Error al registrar dispositivo para el residente ${residentId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function updateResidentDeviceStatusAction(
  residentId: string,
  deviceId: string,
  status: "active" | "inactive" | "lost" | "damaged",
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentResponse>(
      `/api/v1/residents/${residentId}/devices/${deviceId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error(
      `Error al actualizar estado del dispositivo ${deviceId} del residente ${residentId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
