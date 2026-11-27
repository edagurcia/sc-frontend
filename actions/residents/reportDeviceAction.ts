"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { Resident, ResidentResponse } from "@/schemas";

export interface AddDevicePayload {
  type: "card" | "qr" | "tag";
  serial: string;
}

export async function addMyDeviceAction(input: AddDevicePayload): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentResponse>(
      "/api/v1/resident/me/devices",
      {
        method: "POST",
        body: JSON.stringify(input),
        cache: "no-store",
      },
    );

    revalidatePath("/profile");

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function reportMyDeviceStatusAction(
  deviceId: string,
  status: "lost" | "damaged",
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentResponse>(
      `/api/v1/resident/me/devices/${deviceId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );

    revalidatePath("/profile");

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
