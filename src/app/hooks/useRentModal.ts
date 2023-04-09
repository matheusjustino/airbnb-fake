import { create } from 'zustand';

interface RentModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useRentModalStore = create<RentModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set((state) => ({ ...state, isOpen: true })),
	onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export { useRentModalStore };
