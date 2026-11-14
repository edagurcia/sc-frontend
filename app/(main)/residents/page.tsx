import { PageView } from "@/components/PageView";
import { ResidentManagementContainer } from "@/components/resident/ResidentManagementContainer";
import { Users } from "lucide-react";

export const instant = false;

export default function ResidentsPage() {
  return (
    <PageView
      title="Residentes"
      description="Gestión de residentes"
      icon={Users}
    >
      <ResidentManagementContainer />
    </PageView>
  );
}
