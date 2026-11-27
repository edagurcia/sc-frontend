"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import { Resident, UpdateMyProfileFormValues } from "@/schemas/resident-schema";

export async function updateMyResidentProfileAct(
  values: UpdateMyProfileFormValues,
): Promise<{
  success: boolean;
  message?: string;
  data?: Resident;
  error?: string;
}> {
  try {
    const response = await scFetch<{ message: string; data: Resident }>(
      "/api/v1/resident/me",
      {
        method: "PUT",
        body: JSON.stringify(values),
      },
    );

    revalidatePath("/dashboard/profile");
    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
