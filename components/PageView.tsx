import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageViewProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageView = ({
  title,
  description,
  icon: Icon,
  children,
  actions,
  className,
}: PageViewProps) => {
  return (
    <section
      className={cn("flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8", className)}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card p-2 shadow-2xs">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {actions}
          </div>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </section>
  );
};
