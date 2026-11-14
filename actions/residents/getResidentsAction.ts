"use server";

import { scFetch } from "@/lib/scFetch";
import { Resident } from "@/schemas";

export interface SecurityDevice {
  id: string;
  type: "card" | "tag" | string;
  serial: string;
  status: "active" | "inactive" | string;
  issuedAt: string;
}

export interface ResidentsResponse {
  residents: Resident[];
  period?: string;
  totalDebtors?: number;
}

export async function getResidentsAction(
  communityId?: string,
  onlyDebtors: boolean = false,
  period?: string,
): Promise<{
  success: boolean;
  data?: Resident[];
  error?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (communityId) params.append("communityId", communityId);
    if (onlyDebtors && period) params.append("period", period);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    // Selecciona el endpoint según el parámetro
    const endpoint = onlyDebtors
      ? `/api/v1/residents/debtors${queryString}`
      : `/api/v1/residents${queryString}`;

    const response = await scFetch<ResidentsResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });

    return {
      success: true,
      data: response.residents,
    };
  } catch (error) {
    console.error("Error al obtener el listado de residentes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
