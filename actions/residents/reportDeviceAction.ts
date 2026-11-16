"use server";

import { scFetch } from "@/lib/scFetch";
import { ReportDeviceInput, Resident } from "@/schemas";

export interface ReportDeviceResponse {
  message: string;
  resident: Resident;
}

export async function reportDeviceAction(input: ReportDeviceInput): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ReportDeviceResponse>(
      "/api/v1/resident-profile/me/devices/report",
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
    );

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error("Error al reportar el dispositivo de acceso:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
