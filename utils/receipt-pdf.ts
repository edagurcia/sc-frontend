import { jsPDF } from "jspdf";
import { CreatePaymentResponse, PaymentMethod, Resident } from "@/schemas";
import { formatCurrency } from "@/utils/formatters";
import { amountToWords, Language } from "@/utils/amount-to-word";

export interface ReceiptPeriodLine {
  period: string;
  amount: string | number;
}

export interface GenerateReceiptPdfParams {
  resident: Resident;
  receiptNumber: string;
  periods: string[];
  periodAmounts?: ReceiptPeriodLine[];
  paymentMethod: PaymentMethod;
  totalAmount: string | number;
  notes?: string;
  createdPayment?: CreatePaymentResponse;
  issuedAt?: string;
  lang?: Language;
  currencyName?: string;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia bancaria",
  deposito: "Depósito",
  tarjeta: "Tarjeta",
};

export function generatePaymentReceiptPdf({
  resident,
  receiptNumber,
  periods,
  periodAmounts,
  paymentMethod,
  totalAmount,
  notes,
  createdPayment,
  issuedAt,
  lang = "es",
  currencyName,
}: GenerateReceiptPdfParams): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const rawDate =
    createdPayment?.payments?.[0]?.createdAt ??
    issuedAt ??
    new Date().toISOString();

  const formattedDate = new Date(rawDate).toLocaleDateString("es-HN", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const sortedPeriods = Array.from(new Set(periods)).sort((a, b) =>
    a.localeCompare(b),
  );

  const numericTotal = Number(totalAmount) || 0;
  const fallbackUnitAmount =
    sortedPeriods.length > 0
      ? numericTotal / sortedPeriods.length
      : numericTotal;

  const amountByPeriod = new Map<string, number>();
  periodAmounts?.forEach((item) => {
    const val = Number(item.amount);
    if (!Number.isNaN(val)) {
      amountByPeriod.set(item.period, val);
    }
  });

  const amountInWords = amountToWords(numericTotal, lang, currencyName);

  // Encabezado
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 215.9, 34, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SMART COMMUNITY", 18, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Recibo Oficial de Pago Agrupado", 18, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`RECIBO: ${receiptNumber}`, 198, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Fecha: ${formattedDate}`, 198, 24, { align: "right" });

  // Datos del residente
  let y = 46;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DATOS DEL RESIDENTE", 18, y);

  doc.setDrawColor(203, 213, 225);
  doc.line(18, y + 2, 198, y + 2);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Residente:", 18, y);
  doc.setFont("helvetica", "normal");
  doc.text(resident.fullName, 45, y);

  doc.setFont("helvetica", "bold");
  doc.text("Casa / Unidad:", 130, y);
  doc.setFont("helvetica", "normal");
  doc.text(resident.houseNumber || "S/N", 162, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Método de pago:", 18, y);
  doc.setFont("helvetica", "normal");
  doc.text(PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod, 52, y);

  doc.setFont("helvetica", "bold");
  doc.text("Períodos:", 130, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${sortedPeriods.length} mes(es)`, 162, y);

  // Detalle agrupado de períodos del recibo
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PERÍODOS INCLUIDOS EN EL RECIBO", 18, y);
  doc.line(18, y + 2, 198, y + 2);

  y += 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(18, y - 4, 180, 8, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Período", 22, y + 1);
  doc.text("Concepto", 65, y + 1);
  doc.text("Monto", 194, y + 1, { align: "right" });

  y += 9;
  doc.setFont("helvetica", "normal");
  sortedPeriods.forEach((period) => {
    if (y > 225) {
      doc.addPage();
      y = 24;
    }
    const lineAmount = amountByPeriod.get(period) ?? fallbackUnitAmount;
    doc.text(period, 22, y);
    doc.text("Cuota de mantenimiento residencial", 65, y);
    doc.text(formatCurrency(lineAmount), 194, y, { align: "right" });
    doc.setDrawColor(241, 245, 249);
    doc.line(18, y + 2.5, 198, y + 2.5);
    y += 8;
  });

  if (y > 215) {
    doc.addPage();
    y = 24;
  }

  // Total agrupado
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.rect(115, y - 4, 83, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL RECIBO:", 120, y + 2.5);
  doc.text(formatCurrency(numericTotal), 194, y + 2.5, { align: "right" });

  // Monto en letras
  y += 14;
  const wrappedWords = doc.splitTextToSize(amountInWords, 172);
  const wordsBoxHeight = Math.max(12, wrappedWords.length * 4.5 + 7);

  if (y + wordsBoxHeight > 255) {
    doc.addPage();
    y = 24;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(18, y - 4, 180, wordsBoxHeight, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("SON (MONTO EN LETRAS):", 22, y + 1);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(wrappedWords, 22, y + 6.5);

  y += wordsBoxHeight + 4;

  // Notas opcionales
  if (notes?.trim()) {
    const wrappedNotes = doc.splitTextToSize(notes.trim(), 178);
    if (y + wrappedNotes.length * 4.5 + 10 > 255) {
      doc.addPage();
      y = 24;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Observaciones:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(wrappedNotes, 18, y + 6);
  }

  // Pie de página
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Comprobante agrupado generado por SmartCommunity.", 108, 265, {
    align: "center",
  });

  const safeReceipt = receiptNumber.replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`recibo-${safeReceipt}.pdf`);
}
