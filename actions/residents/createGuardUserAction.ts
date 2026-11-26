"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";

export interface CreateGuardUserInput {
  name: string;
  email: string;
  password: string;
  communityId?: string;
}

interface ScFetchResponse {
  ok: boolean;
  json: () => Promise<Record<string, unknown>>;
}

export async function createGuardUserAction(input: CreateGuardUserInput) {
  try {
    const payload = {
      name: input.name,
      email: input.email,
      password: input.password,
      role: "guard" as const,
      ...(input.communityId ? { communityId: input.communityId } : {}),
    };

    const response = (await scFetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as ScFetchResponse;

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          (typeof data?.message === "string" && data.message) ||
          "Error al crear el usuario de guardia",
      };
    }

    revalidatePath("/dashboard/residents");
    revalidatePath("/dashboard/users");

    return {
      success: true,
      data,
      message:
        (typeof data?.message === "string" && data.message) ||
        "Usuario de guardia creado correctamente",
    };
  } catch (error) {
    console.error("Error creating guard user:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}
