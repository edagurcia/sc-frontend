"use client";

import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores";
import {
  CommunityDashboard,
  GuardDashboard,
  ResidentDashboard,
  SuperAdminDashboard,
} from "@/components/dashboard";
import type { UserRole } from "@/types";

export const DashboardLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderDashboardByRole = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return <SuperAdminDashboard />;
      case "community_admin":
        return <CommunityDashboard />;
      case "guard":
        return <GuardDashboard />;
      case "resident":
        return <ResidentDashboard />;
      default:
        return (
          <div className="text-muted-foreground">
            Rol no reconocido o sin acceso al panel.
          </div>
        );
    }
  };

  return renderDashboardByRole(user.role);
};
