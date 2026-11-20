"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { CreatePaymentFormValues, CreatePaymentResponse } from "@/schemas";

export async function createPaymentAction(
  input: CreatePaymentFormValues,
): Promise<{
  success: boolean;
  data?: CreatePaymentResponse;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<CreatePaymentResponse>("/api/v1/payments", {
      method: "POST",
      body: JSON.stringify(input),
      cache: "no-store",
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/residents");
    revalidatePath("/dashboard/payments");

    return {
      success: true,
      data: response,
      message: response.message,
    };
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
