import { create } from 'zustand';

interface LoginModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useLoginModalStore = create<LoginModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set((state) => ({ ...state, isOpen: true })),
	onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export { useLoginModalStore };
