"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentAction,
  getPaymentByIdAction,
  getPaymentsAction,
  getPaymentsSummaryAction,
  getResidentStatementAction,
  updatePaymentAction,
  type GetPaymentsParams,
} from "@/actions/payments";
import {
  CreatePaymentFormValues,
  PaymentDetailItem,
  PaymentHistoryItem,
  PaymentSummaryResponse,
  ResidentStatementResponse,
  UpdatePaymentFormValues,
} from "@/schemas";

export function usePayments(params: GetPaymentsParams = {}) {
  return useQuery<PaymentHistoryItem[], Error>({
    queryKey: ["payments", params],
    queryFn: async () => {
      const res = await getPaymentsAction(params);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener el historial de pagos");
      }
      return res.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function usePaymentById(paymentId?: string) {
  return useQuery<PaymentDetailItem, Error>({
    queryKey: ["payment", paymentId],
    enabled: Boolean(paymentId),
    queryFn: async () => {
      const res = await getPaymentByIdAction(paymentId!);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Error al obtener el detalle del pago");
      }
      return res.data;
    },
    staleTime: 0,
  });
}

export function useResidentStatement(residentId?: string) {
  return useQuery<ResidentStatementResponse, Error>({
    queryKey: ["resident-statement", residentId],
    enabled: Boolean(residentId),
    queryFn: async () => {
      const res = await getResidentStatementAction(residentId!);
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "Error al obtener el estado de cuenta del residente",
        );
      }
      return res.data;
    },
    staleTime: 0,
  });
}

export function usePaymentsSummary(period?: string) {
  return useQuery<PaymentSummaryResponse, Error>({
    queryKey: ["payments-summary", period],
    queryFn: async () => {
      const res = await getPaymentsSummaryAction(period);
      if (!res.success || !res.data) {
        throw new Error(
          res.error || "Error al obtener el resumen financiero por período",
        );
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreatePaymentFormValues) => {
      const res = await createPaymentAction(values);
      if (!res.success || !res.data) {
        throw new Error(res.error || "No se pudo registrar el pago");
      }
      return res;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["payments"], exact: false }),
        queryClient.invalidateQueries({
          queryKey: ["payments-summary"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard-metrics"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["residents"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["resident", variables.residentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["resident-statement", variables.residentId],
        }),
      ]);
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: UpdatePaymentFormValues;
    }) => {
      const res = await updatePaymentAction(id, values);
      if (!res.success || !res.data) {
        throw new Error(res.error || "No se pudo actualizar el pago");
      }
      return res;
    },
    onSuccess: async (res) => {
      const residentId = res.data?.residentId;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["payments"], exact: false }),
        queryClient.invalidateQueries({
          queryKey: ["payment", res.data?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["payments-summary"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard-metrics"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["residents"],
          exact: false,
        }),
        ...(residentId
          ? [
              queryClient.invalidateQueries({
                queryKey: ["resident", residentId],
              }),
              queryClient.invalidateQueries({
                queryKey: ["resident-statement", residentId],
              }),
            ]
          : []),
      ]);
    },
  });
}
