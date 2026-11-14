"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { UpdateResidentFormValues, Resident } from "@/schemas";

export interface UpdateResidentResponse {
  message: string;
  resident: Resident;
}

export async function updateResidentAction(
  id: string,
  input: UpdateResidentFormValues,
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<UpdateResidentResponse>(
      `/api/v1/residents/${id}`,
      {
        method: "PUT",
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
    console.error(`Error al actualizar el residente ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
