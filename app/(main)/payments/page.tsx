import { Receipt } from "lucide-react";
import { PageView } from "@/components/PageView";
import { PaymentsManagementContainer } from "@/components/payments/PaymentsManagementContainer";

export const instant = false;

export default function PaymentsPage() {
  return (
    <PageView
      title="Gestión de Cobros"
      description="Consulta el historial de cuotas cobradas y descarga recibos agrupados en PDF."
      icon={Receipt}
    >
      <PaymentsManagementContainer />
    </PageView>
  );
}
