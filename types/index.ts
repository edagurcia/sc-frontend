export type UserRole = "super_admin" | "community_admin" | "guard" | "resident";

export type TMenu = {
  id: number;
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  isMenuOption: boolean;
};
