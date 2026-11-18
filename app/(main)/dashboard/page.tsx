import { LayoutDashboard } from "lucide-react";
import { PageView } from "@/components/PageView";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

export const instant = false;

export default function DashboardPage() {
  return (
    <PageView
      title="Dashboard"
      description="Bienvenido a tu panel de control principal."
      icon={LayoutDashboard}
    >
      <div className="space-y-6">
        <DashboardLayout />
        <DashboardAnnouncements />
      </div>
    </PageView>
  );
}
