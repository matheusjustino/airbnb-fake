import { create } from 'zustand';

interface SearchModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useSearchModalStore = create<SearchModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set((state) => ({ ...state, isOpen: true })),
	onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export { useSearchModalStore };
