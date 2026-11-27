import type { TMenu } from "@/types";

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
    href: "/profile",
    icon: "ShieldUser",
    roles: ["super_admin", "community_admin", "guard", "resident"],
    isMenuOption: true,
  },
  {
    id: 3,
    label: "Visitas",
    href: "/visits",
    icon: "UserCheck",
    roles: ["super_admin", "community_admin", "resident"],
    isMenuOption: true,
  },

  // --- SUPER ADMIN ---
  {
    id: 10,
    label: "Gestión de Comunidades",
    href: "/communities",
    icon: "Building2",
    roles: ["super_admin"],
    isMenuOption: true,
  },
  {
    id: 11,
    label: "Gestión de Usuarios",
    href: "/users",
    icon: "UsersCog",
    roles: ["super_admin"],
    isMenuOption: true,
  },

  // --- COMMUNITY ADMIN ---
  {
    id: 20,
    label: "Residentes",
    href: "/residents",
    icon: "Users",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 21,
    label: "Cobros",
    href: "/payments",
    icon: "CreditCard",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 22,
    label: "Anuncios",
    href: "/announcements",
    icon: "Megaphone",
    roles: ["community_admin"],
    isMenuOption: true,
  },
  {
    id: 23,
    label: "Notificaciones",
    href: "/notifications",
    icon: "Bell",
    roles: ["community_admin"],
    isMenuOption: true,
  },

  // --- RESIDENTE ---
  {
    id: 30,
    label: "Mis Pagos",
    href: "/my-payments",
    icon: "Wallet",
    roles: ["resident"],
    isMenuOption: true,
  },

  // --- RUTAS OCULTAS / DETALLES (No se muestran en el menú lateral) ---
  {
    id: 100,
    label: "Detalle de Comunidad",
    href: "/communities/[id]",
    icon: "FileText",
    roles: ["super_admin"],
    isMenuOption: false,
  },
  {
    id: 101,
    label: "Detalle de Residente",
    href: "/residents/[id]",
    icon: "FileText",
    roles: ["community_admin"],
    isMenuOption: false,
  },
];
