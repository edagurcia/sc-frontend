import type { UserRole } from "@/types";

export type TMenu = {
  id: number;
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  isMenuOption: boolean;
};

export const menuOptions: TMenu[] = [
  // --- GENERAL / COMPARTIDAS ---
  {
    id: 1,
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["super_admin", "community_admin", "guard", "resident"],
    isMenuOption: true,
  },
  {
    id: 2,
    label: "Perfil",
    href: "/dashboard/profile",
    icon: "ShieldUser",
    roles: ["super_admin", "community_admin", "guard", "resident"],
    isMenuOption: true,
  },

  // --- SUPER ADMIN ---
  {
    id: 10,
    label: "Gestión de Comunidades",
    href: "/dashboard/communities",
    icon: "Building2",
    roles: ["super_admin"],
    isMenuOption: true,
  },
  {
    id: 11,
    label: "Gestión de Usuarios",
    href: "/dashboard/users",
    icon: "UsersCog",
    roles: ["super_admin"],
    isMenuOption: true,
  },

  // --- COMMUNITY ADMIN ---
  {
    id: 20,
    label: "Residentes",
    href: "/dashboard/residents",
    icon: "Users",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 21,
    label: "Cobros",
    href: "/dashboard/payments",
    icon: "CreditCard",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 22,
    label: "Anuncios",
    href: "/dashboard/announcements",
    icon: "Megaphone",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 23,
    label: "Notificaciones",
    href: "/dashboard/notifications",
    icon: "Bell",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 24,
    label: "Control de Visitas",
    href: "/dashboard/visits",
    icon: "ClipboardList",
    roles: ["community_admin", "guard"],
    isMenuOption: true,
  },

  // --- RESIDENTE ---
  {
    id: 30,
    label: "Mis Pagos",
    href: "/dashboard/my-payments",
    icon: "Wallet",
    roles: ["resident"],
    isMenuOption: true,
  },
  {
    id: 31,
    label: "Mis Visitas",
    href: "/dashboard/my-visits",
    icon: "UserCheck",
    roles: ["resident"],
    isMenuOption: true,
  },

  // --- RUTAS OCULTAS / DETALLES (No se muestran en el menú lateral) ---
  {
    id: 100,
    label: "Detalle de Comunidad",
    href: "/dashboard/communities/[id]",
    icon: "FileText",
    roles: ["super_admin"],
    isMenuOption: false,
  },
  {
    id: 101,
    label: "Detalle de Residente",
    href: "/dashboard/residents/[id]",
    icon: "FileText",
    roles: ["community_admin"],
    isMenuOption: false,
  },
];
