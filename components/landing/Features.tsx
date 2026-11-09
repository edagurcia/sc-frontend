"use client"

import { Shield, Users, QrCode, Megaphone, Receipt, MapPin } from "lucide-react"

export const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Diseñado para la convivencia y la seguridad
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Desde el cobro transparente de cuotas hasta el censo censal de
            predios y mapas georeferenciados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Recaudaciones & PDF */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400">
              <Receipt className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Recaudación y Comprobantes PDF
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Permite pagar una o más cuotas simultáneas de seguridad o
              mantenimiento. Genera recibos en PDF descargables o enviables por
              WhatsApp con un histórico completo de tarifas.
            </p>
          </div>

          {/* Censo Poblacional y Predial */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform group-hover:scale-110 dark:text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Censo de Vecinos y Estructura
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Control censo detallado (Mayores/Menores de edad, Tenencia
              propia/alquilada, Tipo de propiedad como Casa/Apto/Negocio y
              atributos como cisterna y pisos).
            </p>
          </div>

          {/* Garita y Accesos Permanentes */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-110 dark:text-blue-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Bitácora de Seguridad Garita
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Genera el listado diario de visitas ocasionales (ej. PedidosYa) y
              accesos permanentes para trabajadores y negocios dentro de la
              comunidad.
            </p>
          </div>

          {/* Georeferenciación y Polígono */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 transition-transform group-hover:scale-110 dark:text-purple-400">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Polígono Georeferenciado</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ubicación de propiedades dentro del polígono delimitador de la
              comunidad para evitar vecinos fuera del área y guiar con precisión
              a la seguridad.
            </p>
          </div>

          {/* Tablón de Notificaciones Comunitarias */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 transition-transform group-hover:scale-110 dark:text-cyan-400">
              <Megaphone className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Anuncios y Noticias Varias
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Canal exclusivo para avisos oficiales de la Directiva,
              alquileres/ventas internas, mantenimientos, mascotas extraviadas o
              ventas de garaje.
            </p>
          </div>

          {/* Roadmap Futurista */}
          <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110 dark:text-amber-400">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Innovación a Largo Plazo</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Preparado para generación de QR con temporizador de entrada,
              integración con plumas automatizadas y sistema opcional de
              votación electrónica.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
