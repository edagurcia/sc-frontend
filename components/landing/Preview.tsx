"use client"

import { useState } from "react"
import {
  Shield,
  Truck,
  UserCheck,
  Smartphone,
  Megaphone,
  Search,
  FileText,
} from "lucide-react"

export const Preview = () => {
  const [activeTab, setActiveTab] = useState<"guard" | "resident">("guard")

  return (
    <section
      id="preview"
      className="border-t border-border/40 bg-muted/30 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Vistas especializadas para cada rol
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Alterna entre la pantalla simplificada para la garita de seguridad y
            la app comunitaria para los vecinos.
          </p>

          <div className="mt-6 inline-flex rounded-2xl border border-border bg-card p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab("guard")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "guard"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4" /> Vista Garita (Seguridad)
            </button>
            <button
              onClick={() => setActiveTab("resident")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "resident"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4" /> App del Vecino (Recaudación)
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                {activeTab === "guard"
                  ? "GET /api/v1/guard/visitors/active"
                  : "GET /api/v1/resident/dashboard"}
              </span>
            </div>
            <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              {activeTab === "guard"
                ? "Garita en Vivo"
                : "Estado de Cuenta y Noticias"}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "guard" ? (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="text-lg font-bold">
                      Listado Diario de Visitas & Accesos
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Residencial Las Uvas • Polígono Bloque H
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        readOnly
                        value="PedidosYa / Casa #14-B"
                        className="w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs font-medium text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-lg bg-blue-600 p-2.5 text-white">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            PedidosYa (Delivery)
                          </span>
                          <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase dark:text-blue-300">
                            Temporal
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Placa:{" "}
                          <strong className="text-foreground">M-8899</strong> •
                          Repartidor: Carlos Mendoza
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:text-right">
                      <p className="text-xs font-bold text-foreground">
                        Destino: Casa #14-B
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Residente: Carlos Rodríguez
                      </p>
                      <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        PIN: 8842
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-lg bg-indigo-600 p-2.5 text-white">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            Acceso Negocio / Servicios
                          </span>
                          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                            Permanente
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          DNI:{" "}
                          <strong className="text-foreground">
                            0801198512345
                          </strong>{" "}
                          • Días: Lunes a Viernes
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:text-right">
                      <p className="text-xs font-bold text-foreground">
                        Destino: Local Comercial #02
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Residente: María Cordero
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recaudación Status */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                      Estado de Recaudaciones
                    </p>
                    <h5 className="mt-0.5 text-base font-bold text-foreground">
                      Cuota de Mantenimiento - Noviembre 2026
                    </h5>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Monto: L. 400.00 • Estado:{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        PAGADO
                      </strong>
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-card px-3 py-1.5 text-xs font-semibold shadow-sm">
                    <FileText className="h-3.5 w-3.5 text-emerald-600" />{" "}
                    Descargar PDF
                  </button>
                </div>

                {/* Anuncio Directiva */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                  <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase dark:text-amber-300">
                      Anuncio de la Junta Directiva
                    </span>
                    <h5 className="text-sm font-bold text-foreground">
                      Asamblea General de Propietarios
                    </h5>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Se convoca a todos los vecinos el próximo sábado a las
                      5:00 PM para revisar el presupuesto del proyecto de
                      automatización de garita.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
