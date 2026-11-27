"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getResidentPaymentsAction,
  ResidentPaymentsHistoryResponse,
} from "@/actions/residents/getResidentPaymentsAction";

export function useResidentPayments() {
  return useQuery<ResidentPaymentsHistoryResponse, Error>({
    queryKey: ["resident-payments-history"],
    queryFn: async () => {
      const res = await getResidentPaymentsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener el historial de pagos");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
