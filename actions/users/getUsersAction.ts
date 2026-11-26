"use server";

import { scFetch } from "@/lib/scFetch";
import { User, UsersResponse } from "@/schemas/user-schema";

export async function getUsersAction(): Promise<{
  success: boolean;
  data?: User[];
  error?: string;
}> {
  try {
    const response = await scFetch<UsersResponse | { data?: User[] }>(
      "/api/v1/users",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const users = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
