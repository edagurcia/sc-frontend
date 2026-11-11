"use server";

import { cookies } from "next/headers";

export async function getPeriodReportHtmlAction(period: string): Promise<{
  success: boolean;
  html?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/reports/period-payments?period=${period}`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al generar el reporte de recaudación");
    }

    const html = await response.text();
    return { success: true, html };
  } catch (error) {
    console.error("Error en reporte HTML:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}
