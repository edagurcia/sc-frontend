"use server";

import { cookies } from "next/headers";
import { loginSchema, LoginInput } from "@/schemas";

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    communityId: string | null;
  };
}

export async function loginAction(values: LoginInput) {
  // 1. Validar los datos con Zod en el servidor
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Datos de acceso inválidos" };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Error al iniciar sesión",
      };
    }

    // 2. Guardar el token de forma segura en una Cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
