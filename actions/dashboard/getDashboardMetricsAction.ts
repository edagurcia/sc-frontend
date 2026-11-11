"use server";

import { scFetch } from "@/lib/scFetch";

export interface UnpaidResident {
  residentId: string;
  fullName: string;
  houseNumber: string;
  monthlyFee: string;
  phone: string;
}

export interface DashboardMetricsResponse {
  period: string;
  totalResidents: number;
  activeResidents: number;
  totalExpectedAmount: string;
  totalCollectedAmount: string;
  collectionPercentage: number;
  paidResidentsCount: number;
  pendingResidentsCount: number;
  unpaidList: UnpaidResident[];
}

export async function getDashboardMetricsAction(): Promise<{
  success: boolean;
  data?: DashboardMetricsResponse;
  error?: string;
}> {
  try {
    const data = await scFetch<DashboardMetricsResponse>(
      "/api/v1/dashboard/metrics",
      {
        method: "GET",

        next: { revalidate: 60 },
      },
    );

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
