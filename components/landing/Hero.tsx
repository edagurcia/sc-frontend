"use client"

import { Shield, Sparkles, ArrowRight, Eye } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-background via-blue-50/50 to-background py-16 lg:py-24 dark:via-blue-950/20">
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Hero Left Content */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              SaaS Multi-Tenant para Residenciales y Condominios
            </div>

            <h1 className="text-4xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Gestión integral de{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
                Recaudaciones, Garita y Censo
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
              La plataforma transparente para cobro de cuotas de seguridad y
              mantenimiento con emisión de comprobantes PDF, censo
              censal/predial, mapa de propiedades y control total de visitas en
              garita.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <button
                onClick={() => {}}
                className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 active:translate-y-0 sm:w-auto"
              >
                Acceder al Sistema <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="#preview"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-accent sm:w-auto"
              >
                Ver Previsualización{" "}
                <Eye className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>

            {/* Metrics Grid basándonos en el README */}
            <div className="mt-20 grid grid-cols-3 gap-4 border-t border-border/60 pt-8 text-left">
              <div>
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  1 Acceso
                </p>
                <p className="text-xs text-muted-foreground">
                  Exclusivo por Casa/Predio
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  Multi-Cuota
                </p>
                <p className="text-xs text-muted-foreground">
                  Pagos agrupados en PDF
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  100% Geo
                </p>
                <p className="text-xs text-muted-foreground">
                  Polígono y Cobertura
                </p>
              </div>
            </div>
          </div>

          {/* Hero Right Image Asset */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="group relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-blue-500/10">
              <img
                src="/smartcommunity_side.png"
                alt="Vista conceptual 3D SmartCommunity"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60" />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl border border-border/60 bg-background/90 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 font-bold text-blue-600 dark:text-blue-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Control de Seguridad Garita
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Validación de visitas y proveedores
                    </p>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  ACTIVO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
