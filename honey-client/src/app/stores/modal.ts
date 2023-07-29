import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => any;
}

interface ModalAction {
  openModal: (state: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

interface ModalStore extends ModalState, ModalAction {}

const initialState: ModalState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

export const useModalStore = create<ModalStore>()(
  devtools((set) => ({
    ...initialState,
    openModal: (state) => set({ ...state, isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }))
);
