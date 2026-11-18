import { Megaphone } from "lucide-react";
import { PageView } from "@/components/PageView";
import { AnnouncementManagementContainer } from "@/components/announcements/AnnouncementManagementContainer";

export const instant = false;

export default function AnnouncementPage() {
  return (
    <PageView
      title="Dashboard"
      description="Bienvenido a tu panel de control principal."
      icon={Megaphone}
    >
      <AnnouncementManagementContainer />
    </PageView>
  );
}
