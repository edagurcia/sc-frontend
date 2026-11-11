import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserRole } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  communityId: string | null;
}

interface Community {
  id: string;
  name: string;
  department: string;
  municipality: string;
  address: string;
  polygon: string | null;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  community: Community | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, community: Community | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      community: null,
      isAuthenticated: false,
      setAuth: (user, community) =>
        set({ user, community, isAuthenticated: !!user }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () =>
        set({ user: null, community: null, isAuthenticated: false }),
    }),
    {
      name: "smartcommunity-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
