import { MouseEvent, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

// HOOKS
import { useLoginModalStore } from './useLoginModel';

// SERVICES
import { api } from '../services/api';

interface UseFavoritesInterface {
	listingId: string;
	currentUser: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: UseFavoritesInterface) => {
	const router = useRouter();
	const loginModal = useLoginModalStore();

	const hasFavorited = useMemo(() => {
		const list = currentUser?.favoriteIds || [];
		return list.includes(listingId);
	}, [currentUser, listingId]);

	const toggleFavorite = useCallback(
		async (e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();

			if (!currentUser) {
				return loginModal.onOpen();
			}

			try {
				if (hasFavorited) {
					await api.delete(`/favorites/${listingId}`);
				} else {
					await api.post(`/favorites/${listingId}`);
				}

				router.refresh();
				toast.success('Success');
			} catch (error: any) {
				console.error(error);
				toast.error('Ops... something went wrong');
			}
		},
		[currentUser, hasFavorited, listingId, loginModal, router],
	);

	return {
		hasFavorited,
		toggleFavorite,
	};
};

export { useFavorite };
