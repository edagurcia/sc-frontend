"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Receipt,
  Wallet,
} from "lucide-react";
import { useResidentPayments } from "@/hooks/useResidentPayments";
import { getPaymentReceiptPdfAction } from "@/actions/payments/getPaymentReceiptPdfAction";
import { usePaginationStore } from "@/stores";
import { useSearch } from "@/hooks";
import { SearchComponent } from "@/components/SearchComponent";
import { TablePagination } from "@/components/TablePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResidentPaymentRow } from "./ResidentPaymentRow";

function formatCurrency(amount: string | number) {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `L. ${amount}`;
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2,
  }).format(numeric);
}

export const ResidentPaymentsView = () => {
  const { data, isLoading, error } = useResidentPayments();
  const [filterText, setFilterText] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const entityKey = "resident-my-payments-table";
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const payments = data?.payments ?? [];

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    payments.forEach((p) => {
      const year = p.period.split("-")[0];
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [payments]);

  const availableMethods = useMemo(() => {
    const methods = new Set<string>();
    payments.forEach((p) => {
      if (p.paymentMethod) methods.add(p.paymentMethod.toLowerCase());
    });
    return Array.from(methods);
  }, [payments]);

  const preFilteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesYear =
        selectedYear === "all" || p.period.startsWith(`${selectedYear}-`);
      const matchesMethod =
        selectedMethod === "all" ||
        p.paymentMethod.toLowerCase() === selectedMethod;
      return matchesYear && matchesMethod;
    });
  }, [payments, selectedYear, selectedMethod]);

  const { dataSet: searchedPayments } = useSearch({
    data: preFilteredPayments,
    text: filterText,
  });

  const totalHistoricalPaid = useMemo(() => {
    return payments.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [payments]);

  const totalFilteredPaid = useMemo(() => {
    return searchedPayments.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0,
    );
  }, [searchedPayments]);

  const totalItems = searchedPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedPayments = searchedPayments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const handleDownloadReceipt = async (paymentId: string) => {
    setDownloadingId(paymentId);
    try {
      const res = await getPaymentReceiptPdfAction(paymentId);
      if (!res.success || !res.html) {
        throw new Error(res.error || "No se pudo generar el recibo");
      }

      const printWindow = window.open("", "_blank", "noopener,noreferrer");
      if (!printWindow) {
        toast.error(
          "El navegador bloqueó la ventana emergente para descargar el recibo",
        );
        return;
      }

      printWindow.document.open();
      printWindow.document.write(res.html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al descargar el recibo",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>
          Error al cargar tus pagos: {error?.message || "Sin datos disponibles"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Total Histórico Pagado</span>
              <Wallet className="h-4 w-4 text-teal-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold text-emerald-600">
              {formatCurrency(totalHistoricalPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Acumulado de todos tus pagos registrados
          </CardContent>
        </Card>

        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Recibos Emitidos</span>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {payments.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Cuotas saldadas para vivienda #{data.resident.houseNumber}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Monto Filtrado</span>
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {formatCurrency(totalFilteredPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Correspondiente a {searchedPayments.length} pago(s) visibles
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/60 shadow-2xs">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              Historial de Pagos Realizados
            </CardTitle>
            <CardDescription className="text-xs">
              Busca por número de recibo, período o notas y descarga tu
              comprobante individual
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {availableYears.length > 0 && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Filtrar por año"
                className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los años</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Año {yr}
                  </option>
                ))}
              </select>
            )}

            {availableMethods.length > 0 && (
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                aria-label="Filtrar por método de pago"
                className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground capitalize focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los métodos</option>
                {availableMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            )}

            <div className="w-full sm:w-64">
              <SearchComponent
                filterText={filterText}
                setFilterText={setFilterText}
                isLoading={isLoading}
                placeholder="Buscar recibo, período o nota..."
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto border-t border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período Pagado</TableHead>
                  <TableHead>N° Recibo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha de Pago</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right w-36">Comprobante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron pagos registrados con los filtros
                      actuales.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment) => (
                    <ResidentPaymentRow
                      key={payment.id}
                      payment={payment}
                      isDownloading={downloadingId === payment.id}
                      onDownloadReceipt={handleDownloadReceipt}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            entityKey={entityKey}
            totalPages={totalPages}
            totalItems={totalItems}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
