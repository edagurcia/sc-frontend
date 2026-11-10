"use client";

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

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Integración directa con TanStack Query
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginInput) => {
      const res = await loginAction(values);
      if (!res.success) throw new Error(res.error || "Error al iniciar sesión");
      return res;
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
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
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
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
