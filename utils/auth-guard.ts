import { menuOptions, UserRole } from "@/data/menu";

export const isRouteAllowed = (pathname: string, role: UserRole): boolean => {
  return menuOptions.some((item) => {
    const routePattern = item.href.replace(/\[.*?\]/g, ".*");
    const regex = new RegExp(`^${routePattern}$`);

    const matchesPath = regex.test(pathname);
    const hasRole = item.roles.includes(role);

    return matchesPath && hasRole;
  });
};
