"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import { VisitFormValues, VisitResponse } from "@/schemas/visit-schema";

export async function createVisitorAction(values: VisitFormValues): Promise<{
  success: boolean;
  message?: string;
  data?: VisitResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{
      message: string;
      visitor: VisitResponse;
    }>("/api/v1/resident/visitors", {
      method: "POST",
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
    console.error("Error al registrar visita:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
