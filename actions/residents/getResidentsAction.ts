"use server";

import { scFetch } from "@/lib/scFetch";

export interface SecurityDevice {
  id: string;
  type: "card" | "tag" | string;
  serial: string;
  status: "active" | "inactive" | string;
  issuedAt: string;
}

export interface Resident {
  id: string;
  communityId: string;
  userId: string | null;
  dni: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  emergencyContact: string | null;
  address: string;
  reference: string;
  houseNumber: string | null;
  street: string | null;
  avenue: string | null;
  tenureType: "propia" | "alquilada" | string;
  securityDevices: SecurityDevice[];
  hasCistern: boolean;
  floorsCount: number;
  hasGarage: boolean;
  adultsCount: number;
  minorsCount: number;
  monthlyFee: string;
  previousFee: string | null;
  lastFeeUpdate: string | null;
  feeUpdateReason: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResidentsResponse {
  residents: Resident[];
}

export async function getResidentsAction(communityId?: string): Promise<{
  success: boolean;
  data?: Resident[];
  error?: string;
}> {
  try {
    const query = communityId
      ? `?communityId=${encodeURIComponent(communityId)}`
      : "";

    const response = await scFetch<ResidentsResponse>(
      `/api/v1/residents${query}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

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
