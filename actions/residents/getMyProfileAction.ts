"use server";

import { scFetch } from "@/lib/scFetch";
import { Resident } from "@/schemas/resident-schema";

export async function getMyProfileAction(): Promise<{
  success: boolean;
  data?: Resident;
  error?: string;
}> {
  try {
    const response = await scFetch<{ resident: Resident }>(
      "/api/v1/resident/me",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return { success: true, data: response.resident };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
