"use server";

import { scFetch } from "@/lib/scFetch";
import { Resident } from "@/schemas";

export interface ResidentProfileResponse {
  resident: Resident;
}

export async function getMyProfileAction(): Promise<{
  success: boolean;
  data?: Resident;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentProfileResponse>(
      "/api/v1/resident-profile/me",
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

    return {
      success: true,
      data: response.resident,
    };
  } catch (error) {
    console.error("Error al obtener el perfil del residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
