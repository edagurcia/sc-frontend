"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isRouteAllowed } from "@/utils/auth-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 1. Validar si está autenticado
    if (!isAuthenticated || !user) {
      toast.error("Debes iniciar sesión para acceder");
      router.replace("/auth/login");
      return;
    }

    // 2. Validar si el rol tiene permiso para esta ruta usando el menú
    const hasPermission = isRouteAllowed(pathname, user.role);
    if (!hasPermission) {
      toast.error("No tienes permisos para acceder a esta sección");
      router.replace("/dashboard"); // Redirige al dashboard general o vista permitida
    }
  }, [isMounted, isAuthenticated, user, pathname, router]);

  if (!isMounted || !isAuthenticated || !user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh] gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Verificando sesión y permisos...
        </p>
      </div>
    );
  }

  // Validación final antes de renderizar para evitar parpadeos
  if (!isRouteAllowed(pathname, user.role)) {
    return null;
  }

  return <>{children}</>;
}
