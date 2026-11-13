"use server";

import { scFetch } from "@/lib/scFetch";
import { Resident, UpdateMyProfileFormValues } from "@/schemas";

export interface UpdateMyProfileResponse {
  message: string;
  resident: Resident;
}

export async function updateMyResidentProfileAct(
  input: UpdateMyProfileFormValues,
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<UpdateMyProfileResponse>(
      "/api/v1/resident-profile/me",
      {
        method: "PUT",
        body: JSON.stringify(input),
      },
    );

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error("Error al actualizar el perfil del residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
