import { z } from "zod";

export const paymentMethodEnum = z.enum([
  "efectivo",
  "transferencia",
  "tarjeta",
  "deposito",
]);

export const createPaymentSchema = z.object({
  residentId: z.string().min(1, "El residente es obligatorio"),
  receiptNumber: z.string().min(1, "El número de recibo es obligatorio"),
  periods: z
    .array(
      z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato YYYY-MM inválido"),
    )
    .min(1, "Debe seleccionar al menos un período"),
  paymentMethod: paymentMethodEnum.default("efectivo"),
  notes: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  receiptNumber: z
    .string()
    .min(1, "El número de recibo es obligatorio")
    .optional(),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0").optional(),
  paymentMethod: paymentMethodEnum.optional(),
  notes: z.string().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodEnum>;
export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;

export interface StatementResident {
  id: string;
  fullName: string;
  houseNumber: string;
  monthlyFee: string;
  joinedDate: string;
  billingStartDate: string;
}

export interface StatementPeriodItem {
  period: string;
  isPaid: boolean;
  amount: string;
}

export interface ResidentStatementResponse {
  resident: StatementResident;
  statement: StatementPeriodItem[];
  unpaidPeriods: StatementPeriodItem[];
  totalDebt: string;
}

export interface PaymentRecord {
  id: string;
  communityId: string;
  residentId: string;
  registeredBy: string;
  receiptNumber: string;
  period: string;
  amount: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  message: string;
  totalAmount: string;
  payments: PaymentRecord[];
}

export interface PaymentHistoryResident {
  id: string;
  fullName: string;
  dni: string;
  houseNumber: string;
  phone?: string;
  address?: string;
}

export interface PaymentHistoryItem {
  id: string;
  receiptNumber: string;
  period: string;
  amount: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  createdAt: string;
  resident: PaymentHistoryResident;
}

export interface PaymentsHistoryResponse {
  payments: PaymentHistoryItem[];
}

export interface PaymentSummaryResponse {
  period: string;
  totalCollected: number;
  paidCount: number;
  pendingCount: number;
  activeResidents: number;
}

export interface PaymentDetailItem extends PaymentRecord {
  resident: Required<PaymentHistoryResident>;
}

export interface PaymentByIdResponse {
  payment: PaymentDetailItem;
}

export interface UpdatePaymentResponse {
  message: string;
  payment: PaymentRecord;
}
