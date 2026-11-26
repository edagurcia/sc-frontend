"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import {
  createUserSchema,
  CreatableUserFormValues,
  User,
  UserMutationResponse,
} from "@/schemas/user-schema";

export async function createUserAction(
  input: CreatableUserFormValues,
): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  error?: string;
}> {
  try {
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Datos de usuario inválidos",
      };
    }

    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
      ...(parsed.data.communityId
        ? { communityId: parsed.data.communityId }
        : {}),
    };

    const response = await scFetch<UserMutationResponse>("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data: response.data,
      message: response.message || "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
