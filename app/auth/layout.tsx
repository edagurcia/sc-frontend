"use client";

import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted || isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[80vh]">
        <p className="text-sm text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="grid w-full flex-1 lg:grid-cols-2 my-auto px-2">
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <main className="w-full max-w-sm">{children}</main>
      </div>

      <div className="relative hidden bg-muted lg:block min-h-137.5">
        <Image
          src="/smartcommunity_side.png"
          alt="SmartCommunity Security & Management"
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover dark:brightness-[0.4] dark:grayscale-[0.2] shadow-lg"
        />
      </div>
    </div>
  );
}
