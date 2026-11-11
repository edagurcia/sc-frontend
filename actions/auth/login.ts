"use server";

import { cookies } from "next/headers";
import { loginSchema, LoginInput } from "@/schemas";

interface Community {
  id: string;
  name: string;
  department: string;
  municipality: string;
  address: string;
  polygon: string | null;
  isActive: boolean;
}

interface AuthResponse {
  message: string;
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    communityId: string | null;
    isActive?: boolean;
  };
  community: Community | null;
}

export async function loginAction(values: LoginInput) {
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
        error: (data as any).error || data.message || "Error al iniciar sesión",
      };
    }

    if (data.token) {
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
    }

    return {
      success: true,
      user: data.user,
      community: data.community,
    };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

// 3. Aplicando la misma interfaz al check de sesión
export async function checkAuthStatusAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { success: false, error: "No hay sesión activa" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/check-status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      return { success: false, error: "Sesión inválida" };
    }

    return {
      success: true,
      user: data.user,
      community: data.community,
    };
  } catch (error) {
    console.error("Error en checkAuthStatusAction:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
