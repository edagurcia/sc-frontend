import { LayoutDashboard } from "lucide-react";
import { PageView } from "@/components/PageView";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const instant = false;

export default function DashboardPage() {
  return (
    <PageView
      title="Dashboard"
      description="Bienvenido a tu panel de control principal."
      icon={LayoutDashboard}
    >
      <DashboardLayout />
    </PageView>
  );
}
