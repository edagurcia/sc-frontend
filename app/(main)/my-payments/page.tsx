import { PageView } from "@/components/PageView";
import { ResidentPaymentsView } from "@/components/payments/ResidentPaymentsView";
import { Wallet } from "lucide-react";

export const instant = false;

export default function MyPaymentsPage() {
  return (
    <PageView
      title="Mis Pagos"
      description="Pagos realizados a la comunidad."
      icon={Wallet}
    >
      <ResidentPaymentsView />
    </PageView>
  );
}
