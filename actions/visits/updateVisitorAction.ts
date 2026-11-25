"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import { VisitFormValues, VisitResponse } from "@/schemas/visit-schema";

export async function updateVisitorAction(
  id: string,
  values: Partial<VisitFormValues>,
): Promise<{
  success: boolean;
  message?: string;
  data?: VisitResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{
      message: string;
      visitor: VisitResponse;
    }>(`/api/v1/resident/visitors/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/visitors");
    return {
      success: true,
      message: response.message,
      data: response.visitor,
    };
  } catch (error) {
    console.error("Error al actualizar visita:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
