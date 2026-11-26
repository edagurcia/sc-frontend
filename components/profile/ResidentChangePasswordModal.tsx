"use client";

import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  changeMyPasswordSchema,
  ChangeMyPasswordFormValues,
} from "@/schemas/resident-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResidentChangePasswordModalProps {
  onCancel: () => void;
}

export const ResidentChangePasswordModal = ({
  onCancel,
}: ResidentChangePasswordModalProps) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<ChangeMyPasswordFormValues>({
    resolver: zodResolver(changeMyPasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = form.watch("newPassword") ?? "";
  const confirmPasswordValue = form.watch("confirmPassword") ?? "";

  const passwordRules = useMemo(
    () => [
      {
        id: "min-length",
        label: "Mínimo 8 caracteres",
        met: newPasswordValue.length >= 8,
      },
      {
        id: "uppercase",
        label: "Al menos una letra mayúscula (A-Z)",
        met: /[A-Z]/.test(newPasswordValue),
      },
      {
        id: "number",
        label: "Al menos un número (0-9)",
        met: /[0-9]/.test(newPasswordValue),
      },
      {
        id: "special",
        label: "Al menos un carácter especial (!@#$%^&*)",
        met: /[!@#$%^&*]/.test(newPasswordValue),
      },
      {
        id: "match",
        label: "Las contraseñas coinciden",
        met:
          newPasswordValue.length > 0 &&
          newPasswordValue === confirmPasswordValue,
      },
    ],
    [newPasswordValue, confirmPasswordValue],
  );

  const metCount = passwordRules.filter((rule) => rule.met).length;
  const isLoading = form.formState.isSubmitting;
  const isDisabled = !form.formState.isValid || isLoading;

  const handleSubmit: SubmitHandler<ChangeMyPasswordFormValues> = async () => {
    toast.info(
      "El controlador de cambio de contraseña aún está pendiente en el backend.",
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4 pt-1"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="currentPassword">Contraseña Actual *</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            placeholder="Contraseña actual"
            disabled={isLoading}
            className="pr-9"
            {...form.register("currentPassword")}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            {showCurrent ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.currentPassword && (
          <span className="text-xs text-destructive">
            {String(form.formState.errors.currentPassword.message)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword">Nueva Contraseña *</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="Nueva contraseña"
            disabled={isLoading}
            className="pr-9"
            {...form.register("newPassword")}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            {showNew ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <span className="text-xs text-destructive">
            {String(form.formState.errors.newPassword.message)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
        <Input
          id="confirmPassword"
          type={showNew ? "text" : "password"}
          placeholder="Confirmar contraseña"
          disabled={isLoading}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <span className="text-xs text-destructive">
            {String(form.formState.errors.confirmPassword.message)}
          </span>
        )}
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            Requisitos de seguridad
          </span>
          <span
            className={`font-semibold transition-colors duration-200 ${
              metCount === passwordRules.length
                ? "text-emerald-600 dark:text-emerald-400"
                : metCount > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            }`}
          >
            {metCount} / {passwordRules.length}
          </span>
        </div>

        <ul className="space-y-1.5 text-xs">
          {passwordRules.map((rule) => (
            <li
              key={rule.id}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                rule.met
                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {rule.met ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              )}
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60 mt-1">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={onCancel}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isDisabled}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              Guardar Contraseña
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
