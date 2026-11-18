"use client";

import { useAnnouncements } from "@/hooks/useAnnouncements";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Pin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardAnnouncements = () => {
  const { announcements, isLoading } = useAnnouncements({
    dashboardOnly: true,
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            Anuncios y Avisos
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            Anuncios y Avisos
          </h3>
        </div>
        <Card className="border-dashed border-muted-foreground/30 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Megaphone className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No hay anuncios en este momento.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Los avisos importantes de la comunidad aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            Anuncios y Avisos
          </h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`relative flex flex-col justify-between transition-all hover:shadow-md ${
              announcement.isPinned ? "border-primary/50 bg-primary/2" : ""
            }`}
          >
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold line-clamp-1">
                  {announcement.title}
                </CardTitle>
                {announcement.isPinned && (
                  <Badge
                    variant="default"
                    className="shrink-0 gap-1 text-[10px] px-2 py-0.5"
                  >
                    <Pin className="h-3 w-3 fill-current" />
                    Fijado
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {announcement.content}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(announcement.createdAt).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
