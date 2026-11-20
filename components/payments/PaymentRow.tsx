"use client";

import { ReactNode } from "react";
import {
  Banknote,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Calendar,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaymentHistoryItem, PaymentMethod } from "@/schemas";
import { formatCurrency } from "@/utils/formatters";

interface PaymentRowProps {
  payment: PaymentHistoryItem;
  actions?: ReactNode;
}

const getMethodBadge = (method: PaymentMethod) => {
  switch (method) {
    case "efectivo":
      return (
        <Badge
          variant="outline"
          className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
        >
          <Banknote className="h-3 w-3" /> Efectivo
        </Badge>
      );
    case "transferencia":
      return (
        <Badge
          variant="outline"
          className="gap-1 text-[10px] bg-sky-500/10 text-sky-600 border-sky-500/20"
        >
          <ArrowLeftRight className="h-3 w-3" /> Transferencia
        </Badge>
      );
    case "deposito":
      return (
        <Badge
          variant="outline"
          className="gap-1 text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
        >
          <Landmark className="h-3 w-3" /> Depósito
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="gap-1 text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20"
        >
          <CreditCard className="h-3 w-3" /> Tarjeta
        </Badge>
      );
  }
};

export const PaymentRow = ({ payment, actions }: PaymentRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-foreground">
            {payment.receiptNumber}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {payment.resident.fullName} • Casa{" "}
            {payment.resident.houseNumber || "S/N"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{payment.periods.join(", ")}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {payment.periods.length > 1
              ? `Pagó ${payment.periods.length} meses`
              : `Mes pagado: ${payment.periods[0] ?? ""}`}
          </span>
        </div>
      </TableCell>
      <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
      <TableCell className="text-right font-semibold text-xs text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
        {formatCurrency(payment.amount)}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(payment.createdAt).toLocaleDateString("es-HN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
