import { PageView } from "@/components/PageView";
import { ResidentProfileContainer } from "@/components/profile/ResidentProfileContainer";
import { ResidentSecurityDevicesCard } from "@/components/profile/ResidentSecurityDevicesCard";
import { UserCircle } from "lucide-react";

export const instant = false;

export default function ProfilePage() {
  return (
    <PageView
      title="Mi Perfil"
      description="Administra tu información personal y seguridad de cuenta"
      icon={UserCircle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <ResidentProfileContainer />
        </div>
        <div className="lg:col-span-5">
          <ResidentSecurityDevicesCard />
        </div>
      </div>
    </PageView>
  );
}
