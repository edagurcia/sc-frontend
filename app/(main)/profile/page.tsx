import { PageView } from "@/components/PageView";
import { ResidentProfileContainer } from "@/components/profile/ResidentProfileContainer";
import { UserCircle } from "lucide-react";

export const instant = false;

export default function ProfilePage() {
  return (
    <PageView
      title="Mi Perfil"
      description="Administra tu información personal y seguridad de cuenta"
      icon={UserCircle}
    >
      <ResidentProfileContainer />
    </PageView>
  );
}
