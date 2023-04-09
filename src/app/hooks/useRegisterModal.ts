import { create } from 'zustand';

interface RegisterModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useRegisterModalStore = create<RegisterModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set((state) => ({ ...state, isOpen: true })),
	onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export { useRegisterModalStore };
