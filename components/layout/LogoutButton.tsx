"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { logoutAction } from "@/actions/auth/logout";

export const LogoutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await logoutAction();
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    } finally {
      logoutStore();

      queryClient.clear();

      localStorage.clear();
      sessionStorage.clear();

      setIsLoading(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>{isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
    </button>
  );
};
