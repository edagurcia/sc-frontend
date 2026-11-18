import { Bell } from "lucide-react";
import { PageView } from "@/components/PageView";
import { NotificationManagementContainer } from "@/components/notifications/NotificationManagementContainer";

export const instant = false;

export default function NotificationsPage() {
  return (
    <PageView
      title="Gestión de Notificaciones"
      description="Envía y administra notificaciones para la comunidad o usuarios individuales."
      icon={Bell}
    >
      <NotificationManagementContainer />
    </PageView>
  );
}
