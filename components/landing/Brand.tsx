"use client"

export const Brand = () => {
  return (
    <section className="border-y border-border/40 bg-card/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <img
              src="/smart_community_logo.png"
              alt="Logo completo SmartCommunity"
              className="h-16 w-auto max-w-full object-contain sm:h-20"
            />
          </div>
          <p className="max-w-md text-center text-sm text-muted-foreground md:text-right">
            Plataforma integral para Juntas Directivas, Vecinos y Personal de
            Garita. Transparencia y control operacional.
          </p>
        </div>
      </div>
    </section>
  )
}
