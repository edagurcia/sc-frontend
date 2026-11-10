import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center bg-background px-4 text-center transition-colors">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-card p-2 shadow-sm">
        <Ghost className="h-12 w-12 text-muted-foreground" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Página no encontrada
      </h1>

      <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-8">
        La ruta a la que intentas acceder no existe, fue eliminada o escribiste
        mal la URL.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 active:scale-95"
      >
        Regresar al Dashboard
      </Link>
    </div>
  );
}
