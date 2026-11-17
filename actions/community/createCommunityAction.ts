"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import {
  CommunityResponse,
  CreateCommunityInput,
} from "@/schemas/community-schema";

export async function createCommunityAction(
  values: CreateCommunityInput,
): Promise<{
  success: boolean;
  data?: CommunityResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{ data: CommunityResponse }>(
      "/api/v1/communities",
      {
        method: "POST",
        body: JSON.stringify(values),
      },
    );

    revalidatePath("/dashboard");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear comunidad:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
