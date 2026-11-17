import { Building2 } from "lucide-react";
import { PageView } from "@/components/PageView";
import { CommunityManagementContainer } from "@/components/communities/CommunityManagementContainer";

export const instant = false;

export default function CommunitiesPage() {
  return (
    <PageView
      title="Comunidades"
      description="Gestión de comunidades"
      icon={Building2}
    >
      <CommunityManagementContainer />
    </PageView>
  );
}
