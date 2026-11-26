"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Save,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface GuardUserPayload {
  name: string;
  email: string;
  password: string;
}

interface GuardUserAccessFormProps {
  fullName: string;
  email: string;
  communityName?: string | null;
  hasExistingGuard: boolean;
  onSaveGuard: (payload: GuardUserPayload) => Promise<void>;
  onCancel: () => void;
}

export const GuardUserAccessForm = ({
  fullName,
  email,
  communityName,
  hasExistingGuard,
  onSaveGuard,
  onCancel,
}: GuardUserAccessFormProps) => {
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateSecurePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*";
    const allChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

    const password = [
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      numberChars[Math.floor(Math.random() * numberChars.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    for (let i = password.length; i < 10; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    const shuffledPassword = password.sort(() => Math.random() - 0.5).join("");
    setTempPassword(shuffledPassword);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast.success("Contraseña temporal copiada al portapapeles");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSave = async () => {
    if (!tempPassword || hasExistingGuard) return;
    setIsSaving(true);
    try {
      await onSaveGuard({
        name: fullName,
        email,
        password: tempPassword,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-foreground">
            {fullName}
          </span>
          <Badge
            variant={hasExistingGuard ? "default" : "secondary"}
            className="gap-1 text-[10px]"
          >
            <Shield className="h-3 w-3" />
            {hasExistingGuard ? "Guardia ya creado" : "Único por comunidad"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground pt-1 border-t border-border/40">
          <span>
            <strong className="text-foreground">Correo:</strong> {email}
          </span>
          <span>
            <strong className="text-foreground">Comunidad:</strong>{" "}
            {communityName || "Actual"}
          </span>
        </div>
      </div>

      <Card className="bg-card border-border/60 shadow-none">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Crear Usuario Genérico de Guardia
              </CardTitle>
              <CardDescription className="text-xs">
                Se utilizarán el nombre y correo genéricos de la comunidad.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  readOnly
                  value={tempPassword}
                  placeholder="Haga clic en generar contraseña"
                  className="h-9 text-xs font-mono bg-muted/50 pr-8"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSecurePassword}
                className="gap-1 h-9 text-xs shrink-0 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Generar
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!tempPassword}
                onClick={handleCopy}
                className="gap-1 h-9 text-xs shrink-0 cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copiada" : "Copiar"}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Cumple automáticamente con: mín. 8 caracteres, una mayúscula, un
              número y un carácter especial (!@#$%^&*).
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              Solo puede existir{" "}
              <strong>un usuario guardia por comunidad</strong>. Copia la
              contraseña antes de guardar.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
              className="h-9 text-xs cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!tempPassword || isSaving || hasExistingGuard}
              onClick={handleSave}
              className="gap-1.5 text-xs h-9 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Crear Guardia
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
