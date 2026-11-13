"use server";

import { scFetch } from "@/lib/scFetch";
import { ResidentFormValues } from "@/schemas";
import { Resident } from "./getResidentsAction";

export interface CreateResidentResponse {
  message: string;
  resident: Resident;
}

export async function createResidentAction(input: ResidentFormValues): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<CreateResidentResponse>(
      "/api/v1/residents",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error("Error al crear el residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
