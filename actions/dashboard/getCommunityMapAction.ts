"use server";

import { scFetch } from "@/lib/scFetch";

export interface CommunityMapInfo {
  id: string;
  name: string;
  department: string;
  municipality: string;
  address: string;
  polygon: string | null;
  isActive: boolean;
}

export interface MapResidentItem {
  id: string;
  fullName: string;
  houseNumber: string | null;
  street: string | null;
  avenue: string | null;
  address: string;
  reference: string;
  phone: string;
  isActive: boolean;
}

export interface CommunityMapResponse {
  community: CommunityMapInfo;
  residents: MapResidentItem[];
}

export async function getCommunityMapAction(): Promise<{
  success: boolean;
  data?: CommunityMapResponse;
  error?: string;
}> {
  try {
    const data = await scFetch<CommunityMapResponse>("/api/v1/dashboard/map", {
      method: "GET",
      next: { revalidate: 300 },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener el mapa de la comunidad:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
