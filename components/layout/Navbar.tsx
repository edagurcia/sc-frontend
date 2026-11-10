"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { menuOptions } from "@/data/menu";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  LayoutDashboard,
  Building2,
  UserCog,
  Users,
  CreditCard,
  Megaphone,
  Bell,
  ClipboardList,
  Wallet,
  UserCheck,
  FileText,
  Home,
  ShieldUser,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  Building2,
  UserCog,
  Users,
  CreditCard,
  Megaphone,
  Bell,
  ClipboardList,
  Wallet,
  UserCheck,
  FileText,
  ShieldUser,
};

export const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const allowedMenuOptions = menuOptions.filter(
    (item) => item.roles.includes(user.role) && item.isMenuOption,
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 cursor-pointer rounded-xl border-border bg-card"
          >
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Abrir menú de navegación</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-72 flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4 text-left">
          <SheetTitle className="text-base font-bold">
            SmartCommunity
          </SheetTitle>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </SheetHeader>

        <nav className="flex flex-col gap-1">
          {allowedMenuOptions.map((item) => {
            const IconComponent = iconMap[item.icon] || Home;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t pt-4 mt-auto">
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
};
