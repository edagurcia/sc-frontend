import { DoorOpen } from "lucide-react";
import { PageView } from "@/components/PageView";
import { VisitManagementContainer } from "@/components/visits/VisitManagementContainer";

export const instant = false;

export default function VisitsPage() {
  return (
    <PageView
      title="Visitas"
      description="Administra tus visitas frecuentes, casuales y códigos de acceso."
      icon={DoorOpen}
    >
      <VisitManagementContainer />
    </PageView>
  );
}
