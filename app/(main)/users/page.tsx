import { PageView } from "@/components/PageView";
import { UserManagementContainer } from "@/components/users/UserManagementContainer";
import { Users } from "lucide-react";

export const instant = false;

export default function UsersPage() {
  return (
    <PageView
      title="Usuarios"
      description="Gestión global de usuarios, roles y comunidades"
      icon={Users}
    >
      <UserManagementContainer />
    </PageView>
  );
}
