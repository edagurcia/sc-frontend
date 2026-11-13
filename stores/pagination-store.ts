import { create } from "zustand";

interface PaginationStore {
  pages: Record<string, number>;
  pageSize: Record<string, number>;
  setPage: (key: string, page: number) => void;
  resetPage: (key: string) => void;
  setPageSize: (key: string, size: number) => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  pages: {},
  pageSize: {},

  setPage: (key, page) =>
    set((state) => ({ pages: { ...state.pages, [key]: page } })),

  resetPage: (key) => set((state) => ({ pages: { ...state.pages, [key]: 1 } })),

  setPageSize: (key, size) =>
    set((state) => ({
      pageSize: { ...state.pageSize, [key]: size },
      pages: { ...state.pages, [key]: 1 },
    })),
}));
