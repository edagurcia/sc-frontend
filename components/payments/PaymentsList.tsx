"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { usePayments, useSearch } from "@/hooks";
import { usePaginationStore } from "@/stores";
import { TablePagination } from "@/components/TablePagination";
import { SearchComponent } from "@/components/SearchComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentHistoryItem } from "@/schemas";
import { PaymentRow } from "./PaymentRow";
import { PaymentActions } from "./PaymentActions";

interface PaymentsListProps {
  onViewDetail: (payment: PaymentHistoryItem) => void;
  onEdit: (payment: PaymentHistoryItem) => void;
  onDownloadReceipt: (payment: PaymentHistoryItem) => void;
}

export const PaymentsList = ({
  onViewDetail,
  onEdit,
  onDownloadReceipt,
}: PaymentsListProps) => {
  const { data: payments = [], isLoading, error } = usePayments();
  const [filterText, setFilterText] = useState("");

  const entityKey = "admin-payments";
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const { dataSet: filteredPayments } = useSearch({
    data: payments,
    text: filterText,
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedPayments = filteredPayments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Error al cargar los cobros: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Historial de Cobros
          </h3>
          <p className="text-xs text-muted-foreground">
            Listado de cuotas registradas y comprobantes disponibles para
            descarga.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por recibo, residente o casa..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Recibo / Residente</TableHead>
              <TableHead className="w-28">Período</TableHead>
              <TableHead className="w-36">Método</TableHead>
              <TableHead className="text-right w-32">Monto</TableHead>
              <TableHead className="w-32">Fecha</TableHead>
              <TableHead className="text-right w-28">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron cobros registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                  actions={
                    <PaymentActions
                      payment={payment}
                      onViewDetail={onViewDetail}
                      onEdit={onEdit}
                      onDownloadReceipt={onDownloadReceipt}
                    />
                  }
                />
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          entityKey={entityKey}
          totalPages={totalPages}
          totalItems={totalItems}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
