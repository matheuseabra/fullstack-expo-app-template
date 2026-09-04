import { create } from "zustand";

type AddTaskSheetStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useAddTaskSheetStore = create<AddTaskSheetStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
