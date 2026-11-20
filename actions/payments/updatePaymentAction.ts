"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import {
  PaymentRecord,
  UpdatePaymentFormValues,
  UpdatePaymentResponse,
} from "@/schemas";

export async function updatePaymentAction(
  id: string,
  input: UpdatePaymentFormValues,
): Promise<{
  success: boolean;
  data?: PaymentRecord;
  message?: string;
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: "ID de pago no proporcionado" };
    }

    const response = await scFetch<UpdatePaymentResponse>(
      `/api/v1/payments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/residents");
    revalidatePath("/dashboard/payments");

    return {
      success: true,
      data: response.payment,
      message: response.message,
    };
  } catch (error) {
    console.error(`Error al actualizar el pago ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
