import { create } from "zustand";

interface Dialog {
  show: boolean;
  title: string;
  description: string;
  action: () => void;
  showDialog: (title: string, description: string, action: () => void) => void;
  resetDialog: () => void;
}

export const useDialogStore = create<Dialog>()((set) => ({
  show: false,
  title: "",
  description: "",
  action: () => {},
  showDialog: (title: string, description: string, action: () => void) =>
    set(() => ({
      show: true,
      title,
      description,
      action,
    })),
  resetDialog: () =>
    set(() => ({
      show: false,
      title: "",
      description: "",
    })),
}));
