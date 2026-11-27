"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Home,
  IdCard,
  Loader2,
  MapPin,
  Receipt,
} from "lucide-react";
import { useResidentDashboard } from "@/hooks/useResidentDashboard";
import { ResidentPaymentItem } from "@/actions/residents/getResidentDashboardAction";
import { getResidentStatementPdfAction } from "@/actions/residents/getResidentStatementPdfAction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("es-HN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const ResidentDashboard = () => {
  const { data, isLoading, error } = useResidentDashboard();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "PAGADO" | "PENDIENTE"
  >("all");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const summary = useMemo(() => {
    const payments = data?.paymentStatus ?? [];
    const paidItems = payments.filter((p) => p.status === "PAGADO");
    const pendingItems = payments.filter((p) => p.status !== "PAGADO");

    const paidAmount = paidItems.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0,
    );
    const pendingAmount = pendingItems.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0,
    );

    return {
      totalPeriods: payments.length,
      paidCount: paidItems.length,
      pendingCount: pendingItems.length,
      paidAmount,
      pendingAmount,
    };
  }, [data?.paymentStatus]);

  const filteredPayments = useMemo<ResidentPaymentItem[]>(() => {
    const payments = data?.paymentStatus ?? [];
    if (statusFilter === "all") return payments;
    return payments.filter((item) =>
      statusFilter === "PAGADO"
        ? item.status === "PAGADO"
        : item.status !== "PAGADO",
    );
  }, [data?.paymentStatus, statusFilter]);

  // ... dentro de ResidentDashboard:
  const handleDownloadStatementPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const res = await getResidentStatementPdfAction(data?.year);

      if (!res.success || !res.html) {
        throw new Error(res.error || "No se pudo generar el estado de cuenta");
      }

      const printWindow = window.open("", "_blank", "noopener,noreferrer");

      if (!printWindow) {
        toast.error(
          "El navegador bloqueó la ventana emergente para descargar el PDF",
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
        err instanceof Error
          ? err.message
          : "Error al descargar el estado de cuenta",
      );
    } finally {
      setIsDownloadingPdf(false);
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
          Error al cargar el dashboard:{" "}
          {error?.message || "Sin datos disponibles"}
        </span>
      </div>
    );
  }

  const { resident, year } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado del Residente y Acción PDF */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-2xs">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {resident.fullName}
            </h2>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Año {year}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <IdCard className="h-3.5 w-3.5 text-foreground/70" />
              <strong className="text-foreground">DNI:</strong> {resident.dni}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-foreground/70" />
              <strong className="text-foreground">Casa:</strong>{" "}
              {resident.houseNumber}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-foreground/70" />
              <strong className="text-foreground">Dirección:</strong>{" "}
              {resident.address}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleDownloadStatementPdf}
          disabled={isDownloadingPdf}
          className="gap-2 shrink-0 cursor-pointer"
        >
          {isDownloadingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Estado de Cuenta PDF ({year})
            </>
          )}
        </Button>
      </div>

      {/* Tarjetas de Resumen del Año */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Cuota Mensual</span>
              <DollarSign className="h-4 w-4 text-teal-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {formatCurrency(resident.monthlyFee)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Tarifa base asignada a la vivienda #{resident.houseNumber}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Periodos Pagados ({year})</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold text-emerald-600">
              {summary.paidCount} / {summary.totalPeriods}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Total pagado: {formatCurrency(summary.paidAmount)}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Periodos Pendientes</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold text-amber-600">
              {summary.pendingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Saldo pendiente: {formatCurrency(summary.pendingAmount)}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/60 shadow-2xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center justify-between">
              <span>Comprobantes Emitidos</span>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {summary.paidCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Recibos registrados en el año {year}
          </CardContent>
        </Card>
      </div>

      {/* Estado de Pagos del Año */}
      <Card className="bg-card border-border/60 shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              Estado de Pagos — {year}
            </CardTitle>
            <CardDescription className="text-xs">
              Historial mensual de cuotas, recibos y métodos de pago
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="text-xs h-8 cursor-pointer"
            >
              Todos ({data.paymentStatus.length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "PAGADO" ? "default" : "outline"}
              onClick={() => setStatusFilter("PAGADO")}
              className="text-xs h-8 cursor-pointer"
            >
              Pagados ({summary.paidCount})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "PENDIENTE" ? "default" : "outline"}
              onClick={() => setStatusFilter("PENDIENTE")}
              className="text-xs h-8 cursor-pointer"
            >
              Pendientes ({summary.pendingCount})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto border-t border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Recibo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Fecha de Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No hay registros de pago para el filtro seleccionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((item) => {
                    const isPaid = item.status === "PAGADO";
                    return (
                      <TableRow key={item.period}>
                        <TableCell className="font-medium">
                          {formatPeriodLabel(item.period)}
                          <span className="block text-[11px] font-mono text-muted-foreground">
                            {item.period}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={isPaid ? "default" : "outline"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.receiptNumber || "—"}
                        </TableCell>
                        <TableCell className="capitalize text-xs">
                          {item.paymentMethod || "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {formatDate(item.paymentDate)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
