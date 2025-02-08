import { create } from 'zustand';

interface TaskbarStore {
  isVisible: boolean;
  toggleVisibility: () => void;
}

export const useTaskbarStore = create<TaskbarStore>((set) => ({
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
})); 