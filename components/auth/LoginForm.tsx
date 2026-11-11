"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas";
import { loginAction } from "@/actions/auth/login";
import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { UserRole } from "@/types";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginInput) => {
      const res = await loginAction(values);
      if (!res.success) throw new Error(res.error || "Error al iniciar sesión");
      return res;
    },
    onSuccess: (data) => {
      if (data.user) {
        setAuth(
          {
            ...data.user,
            role: data.user.role as UserRole,
          },
          data.community ?? null,
        );
        toast.success("¡Bienvenido de vuelta!");
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: LoginInput) => {
    login(values);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <FieldGroup className="grid gap-4">
            <Field className="grid gap-2">
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="residente@ejemplo.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-destructive">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <Field className="grid gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
                >
                  ¿Olvidó su contraseña?
                </a>
              </div>

              {/* Contenedor relativo para posicionar el botón de forma elegante */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="***********"
                  autoComplete="current-password"
                  className="pr-10" // Espacio a la derecha para que el texto no choque con el icono
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  tabIndex={-1} // Evita que se seleccione al navegar con Tab si se prefiere
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="text-xs text-destructive">
                  {errors.password.message}
                </span>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!isValid || isPending}
            >
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
