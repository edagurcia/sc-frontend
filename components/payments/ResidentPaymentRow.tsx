"use client";

import { Download, Loader2 } from "lucide-react";
import { ResidentHistoricalPayment } from "@/actions/residents/getResidentPaymentsAction";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResidentPaymentRowProps {
  payment: ResidentHistoricalPayment;
  isDownloading: boolean;
  onDownloadReceipt: (paymentId: string) => void;
}

function formatPeriodLabel(period: string) {
  const [yearStr, monthStr] = period.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return period;

  const date = new Date(Date.UTC(year, monthIndex, 1));
  const formatted = new Intl.DateTimeFormat("es-HN", {
    month: "long",
    timeZone: "UTC",
  }).format(date);

  return `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)} ${year}`;
}

function formatCurrency(amount: string | number) {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `L. ${amount}`;
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2,
  }).format(numeric);
}

function formatDate(dateStr: string) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("es-HN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const ResidentPaymentRow = ({
  payment,
  isDownloading,
  onDownloadReceipt,
}: ResidentPaymentRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {formatPeriodLabel(payment.period)}
        <span className="block text-[11px] font-mono text-muted-foreground">
          {payment.period}
        </span>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {payment.receiptNumber}
      </TableCell>

      <TableCell>
        <Badge variant="secondary" className="capitalize text-xs">
          {payment.paymentMethod}
        </Badge>
      </TableCell>

      <TableCell className="text-xs text-muted-foreground">
        {formatDate(payment.createdAt)}
      </TableCell>

      <TableCell className="text-right font-semibold text-emerald-600">
        {formatCurrency(payment.amount)}
      </TableCell>

      <TableCell className="text-right">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isDownloading}
          onClick={() => onDownloadReceipt(payment.id)}
          className="h-8 px-2.5 gap-1.5 text-xs cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5 text-teal-600" />
              Recibo PDF
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
