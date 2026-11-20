"use client";

import { Button } from "@/components/ui/button";
import { Download, Pencil, Eye } from "lucide-react";
import { PaymentHistoryItem } from "@/schemas";

interface PaymentActionsProps {
  payment: PaymentHistoryItem;
  onViewDetail: (payment: PaymentHistoryItem) => void;
  onEdit: (payment: PaymentHistoryItem) => void;
  onDownloadReceipt: (payment: PaymentHistoryItem) => void;
}

export const PaymentActions = ({
  payment,
  onViewDetail,
  onEdit,
  onDownloadReceipt,
}: PaymentActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-sky-600 hover:bg-sky-500/10 cursor-pointer"
        onClick={() => onViewDetail(payment)}
        title="Ver detalle del pago"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-500/10 cursor-pointer"
        onClick={() => onEdit(payment)}
        title="Modificar pago"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
        onClick={() => onDownloadReceipt(payment)}
        title="Descargar recibo PDF agrupado"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};
