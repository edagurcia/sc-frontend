"use server";

import { scFetch } from "@/lib/scFetch";

export interface ResidentProfileRecord {
  id: string;
  communityId: string;
  fullName: string;
  dni: string;
  phone: string | null;
  email: string;
  address: string;
  houseNumber: string;
  monthlyFee: string;
  isActive: boolean;
  latitude?: string | number | null;
  longitude?: string | number | null;
  locationNote?: string | null;
}

export interface ResidentProfilePayload {
  resident: ResidentProfileRecord;
  devices?: unknown[];
}

export async function getMyResidentProfileAction(): Promise<{
  success: boolean;
  data?: ResidentProfilePayload;
  error?: string;
}> {
  try {
    const response = await scFetch<
      ResidentProfilePayload | { data?: ResidentProfilePayload }
    >("/api/v1/resident-profile/me", {
      method: "GET",
      cache: "no-store",
    });

    const payload = "resident" in response ? response : response?.data;

    if (!payload?.resident) {
      return {
        success: false,
        error: "No se encontró el perfil del residente",
      };
    }

    return {
      success: true,
      data: {
        resident: payload.resident,
        devices: Array.isArray(payload.devices) ? payload.devices : [],
      },
    };
  } catch (error) {
    console.error("Error al obtener perfil de residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
