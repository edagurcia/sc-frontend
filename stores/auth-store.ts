import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserRole } from "@/data/menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  communityId: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "smartcommunity-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
