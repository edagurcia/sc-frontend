"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      await fetch("http://localhost:3000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.warn("No se pudo contactar al servidor para el logout:", error);
  } finally {
    // Garantizar borrado de la cookie independientemente de la API
    const cookieStore = await cookies();
    cookieStore.delete("token");
  }

  return { success: true, message: "Sesión cerrada exitosamente" };
}
