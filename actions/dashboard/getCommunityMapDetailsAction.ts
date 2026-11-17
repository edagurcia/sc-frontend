"use server";

import { scFetch } from "@/lib/scFetch";
import { CommunityResponse } from "@/schemas/community-schema";

export interface ResidentItem {
  id: string;
  fullName: string;
  houseNumber: string | null;
  street: string | null;
  avenue: string | null;
  address: string | null;
  reference: string | null;
  phone: string | null;
  hasCistern: boolean | null;
  floorsCount: number | null;
  isActive: boolean;
}

export interface CommunityDetailResponse {
  community: CommunityResponse;
  residents: ResidentItem[];
}

export async function getCommunityMapDetailsAction(
  communityId: string,
): Promise<{
  success: boolean;
  data?: CommunityDetailResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{
      success: boolean;
      data: CommunityDetailResponse;
    }>(`/api/v1/super-admin/communities/${communityId}/map-details`, {
      method: "GET",
      cache: "no-store",
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Error al obtener los detalles y residentes de la comunidad:",
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
